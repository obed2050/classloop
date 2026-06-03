import User from '../models/User.js';
import Follow from '../models/Follow.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { sanitizeUser, getPagination } from '../utils/helpers.js';
import { regex, serializeUser } from '../utils/mongoFormat.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService.js';
import { createNotification } from './notificationController.js';
import fs from 'fs';

export const getUserProfile = async (req, res) => {
  const userDoc = await User.findOne({ username: req.params.username, is_banned: false });
  if (!userDoc) return errorResponse(res, 'User not found', 404);

  const user = sanitizeUser(userDoc);
  if (req.user) {
    user.is_following = !!(await Follow.exists({ follower: req.user.id, following: user.id }));
  }

  return successResponse(res, { user });
};

export const updateProfile = async (req, res) => {
  const fields = ['full_name', 'bio', 'school_name', 'graduation_year', 'class_section', 'is_private'];
  const updates = {};
  fields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
  return successResponse(res, { user: sanitizeUser(user) }, 'Profile updated');
};

export const uploadProfilePicture = async (req, res) => {
  if (!req.file) return errorResponse(res, 'No file uploaded', 400);

  const current = await User.findById(req.user.id).select('profile_picture');
  if (current?.profile_picture) {
    const parts = current.profile_picture.split('/');
    const publicId = parts.slice(-2).join('/').replace(/\.[^/.]+$/, '');
    await deleteFromCloudinary(publicId);
  }

  const { url } = await uploadToCloudinary(req.file.path, 'avatars', 'image');
  fs.unlinkSync(req.file.path);

  await User.findByIdAndUpdate(req.user.id, { profile_picture: url });
  return successResponse(res, { profile_picture: url }, 'Profile picture updated');
};

export const followUser = async (req, res) => {
  const { userId } = req.params;
  if (userId === req.user.id) return errorResponse(res, 'Cannot follow yourself', 400);

  const target = await User.findById(userId).select('username');
  if (!target) return errorResponse(res, 'User not found', 404);

  const existing = await Follow.findOne({ follower: req.user.id, following: userId });
  if (existing) {
    await existing.deleteOne();
    await User.findByIdAndUpdate(userId, { $inc: { followers_count: -1 } });
    await User.findByIdAndUpdate(req.user.id, { $inc: { following_count: -1 } });
    return successResponse(res, { following: false }, 'Unfollowed successfully');
  }

  await Follow.create({ follower: req.user.id, following: userId });
  await User.findByIdAndUpdate(userId, { $inc: { followers_count: 1 } });
  await User.findByIdAndUpdate(req.user.id, { $inc: { following_count: 1 } });

  await createNotification({
    recipientId: userId,
    senderId: req.user.id,
    type: 'follow',
    message: `${req.user.username} started following you`,
  });

  return successResponse(res, { following: true }, 'Followed successfully');
};

export const getFollowers = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const [follows, total] = await Promise.all([
    Follow.find({ following: req.params.userId }).populate('follower', 'username full_name profile_picture school_name').skip(offset).limit(limit),
    Follow.countDocuments({ following: req.params.userId }),
  ]);
  return paginatedResponse(res, follows.map((f) => serializeUser(f.follower)), total, page, limit);
};

export const getFollowing = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const [follows, total] = await Promise.all([
    Follow.find({ follower: req.params.userId }).populate('following', 'username full_name profile_picture school_name').skip(offset).limit(limit),
    Follow.countDocuments({ follower: req.params.userId }),
  ]);
  return paginatedResponse(res, follows.map((f) => serializeUser(f.following)), total, page, limit);
};

export const searchUsers = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const q = regex(req.query.q);
  const filter = { is_banned: false, $or: [{ username: q }, { full_name: q }, { school_name: q }] };
  const [users, total] = await Promise.all([
    User.find(filter).select('username full_name profile_picture school_name graduation_year').skip(offset).limit(limit),
    User.countDocuments(filter),
  ]);
  return paginatedResponse(res, users.map(serializeUser), total, page, limit);
};

export const getSuggestedUsers = async (req, res) => {
  const follows = await Follow.find({ follower: req.user.id }).select('following');
  const excluded = [req.user.id, ...follows.map((f) => f.following)];
  const users = await User.find({ _id: { $nin: excluded }, is_banned: false })
    .select('username full_name profile_picture school_name followers_count')
    .sort({ followers_count: -1 })
    .limit(10);
  return successResponse(res, { users: users.map(serializeUser) });
};

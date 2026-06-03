import User from '../models/User.js';
import Post from '../models/Post.js';
import Reel from '../models/Reel.js';
import Message from '../models/Message.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { getPagination } from '../utils/helpers.js';
import { regex, serializeUser, withUser } from '../utils/mongoFormat.js';

export const getAllUsers = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { search, role, banned } = req.query;
  const filter = {};
  if (search) filter.$or = [{ username: regex(search) }, { email: regex(search) }, { full_name: regex(search) }];
  if (role) filter.role = role;
  if (banned !== undefined) filter.is_banned = banned === 'true';

  const [users, total] = await Promise.all([
    User.find(filter).select('username email full_name role is_banned posts_count followers_count createdAt').sort({ createdAt: -1 }).skip(offset).limit(limit),
    User.countDocuments(filter),
  ]);
  return paginatedResponse(res, users.map(serializeUser), total, page, limit);
};

export const banUser = async (req, res) => {
  const user = await User.findById(req.params.userId).select('role');
  if (!user) return errorResponse(res, 'User not found', 404);
  if (user.role === 'admin') return errorResponse(res, 'Cannot ban an admin', 403);
  await User.findByIdAndUpdate(req.params.userId, { is_banned: true });
  return successResponse(res, {}, 'User banned');
};

export const unbanUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.userId, { is_banned: false });
  return successResponse(res, {}, 'User unbanned');
};

export const deletePostAdmin = async (req, res) => {
  const post = await Post.findOneAndUpdate({ _id: req.params.postId, is_deleted: false }, { is_deleted: true });
  if (!post) return errorResponse(res, 'Post not found', 404);
  return successResponse(res, {}, 'Post removed');
};

export const getDashboardStats = async (req, res) => {
  const [usersTotal, usersBanned, posts, reels, messages] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ is_banned: true }),
    Post.countDocuments({ is_deleted: false }),
    Reel.countDocuments({ is_deleted: false }),
    Message.countDocuments({ is_deleted: false }),
  ]);

  return successResponse(res, {
    stats: { users: { total: usersTotal, banned: usersBanned }, posts, reels, messages },
  });
};

export const getFlaggedContent = async (req, res) => {
  const { limit, offset } = getPagination(req.query);
  const posts = await Post.find({ is_deleted: false })
    .populate('user', 'username')
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);
  return successResponse(res, { posts: posts.map(withUser) });
};

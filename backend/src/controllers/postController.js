import Post from '../models/Post.js';
import User from '../models/User.js';
import Follow from '../models/Follow.js';
import Like from '../models/Like.js';
import SavedPost from '../models/SavedPost.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { getPagination, extractHashtags } from '../utils/helpers.js';
import { idOf, regex, withUser } from '../utils/mongoFormat.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService.js';
import { createNotification } from './notificationController.js';
import fs from 'fs';

const populateUser = (query) => query.populate('user', 'username full_name profile_picture school_name graduation_year');

export const createPost = async (req, res) => {
  const { caption, is_memory, memory_year, memory_type } = req.body;
  if (!req.file) return errorResponse(res, 'Media file required', 400);

  const isVideo = req.file.mimetype.startsWith('video');
  const { url, publicId } = await uploadToCloudinary(req.file.path, isVideo ? 'posts/videos' : 'posts/images', isVideo ? 'video' : 'image');
  fs.unlinkSync(req.file.path);

  const post = await Post.create({
    user: req.user.id,
    caption,
    media_url: url,
    media_type: isVideo ? 'video' : 'image',
    media_public_id: publicId,
    hashtags: extractHashtags(caption),
    is_memory: is_memory === true || is_memory === 'true',
    memory_year: memory_year || null,
    memory_type: memory_type || null,
  });
  await User.findByIdAndUpdate(req.user.id, { $inc: { posts_count: 1 } });

  const populated = await populateUser(Post.findById(post.id));
  return successResponse(res, { post: withUser(populated) }, 'Post created', 201);
};

export const getFeed = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const following = await Follow.find({ follower: req.user.id }).select('following');
  const followingIds = following.map((f) => f.following);
  const filter = {
    is_deleted: false,
    $or: [{ user: { $in: followingIds } }, { likes_count: { $gt: 10 } }, { is_memory: true }],
  };
  const [posts, total] = await Promise.all([
    populateUser(Post.find(filter).sort({ likes_count: -1, createdAt: -1 }).skip(offset).limit(limit)),
    Post.countDocuments(filter),
  ]);

  const postIds = posts.map((p) => p.id);
  const [liked, saved] = await Promise.all([
    Like.find({ user: req.user.id, target_type: 'post', target_id: { $in: postIds } }).select('target_id'),
    SavedPost.find({ user: req.user.id, post: { $in: postIds } }).select('post'),
  ]);
  const likedSet = new Set(liked.map((l) => idOf(l.target_id)));
  const savedSet = new Set(saved.map((s) => idOf(s.post)));
  const data = posts.map((p) => ({ ...withUser(p), is_liked: likedSet.has(p.id), is_saved: savedSet.has(p.id) }));
  return paginatedResponse(res, data, total, page, limit);
};

export const getPost = async (req, res) => {
  const post = await populateUser(Post.findOne({ _id: req.params.id, is_deleted: false }));
  if (!post) return errorResponse(res, 'Post not found', 404);
  return successResponse(res, { post: withUser(post) });
};

export const getUserPosts = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const filter = { user: req.params.userId, is_deleted: false };
  const [posts, total] = await Promise.all([
    populateUser(Post.find(filter).sort({ createdAt: -1 }).skip(offset).limit(limit)),
    Post.countDocuments(filter),
  ]);
  return paginatedResponse(res, posts.map(withUser), total, page, limit);
};

export const deletePost = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, is_deleted: false });
  if (!post) return errorResponse(res, 'Post not found', 404);
  if (idOf(post.user) !== req.user.id && req.user.role !== 'admin') return errorResponse(res, 'Unauthorized', 403);

  if (post.media_public_id) await deleteFromCloudinary(post.media_public_id, post.media_type);
  post.is_deleted = true;
  await post.save();
  await User.findByIdAndUpdate(post.user, { $inc: { posts_count: -1 } });
  return successResponse(res, {}, 'Post deleted');
};

export const likePost = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, is_deleted: false });
  if (!post) return errorResponse(res, 'Post not found', 404);

  const existing = await Like.findOne({ user: req.user.id, target_id: post.id, target_type: 'post' });
  if (existing) {
    await existing.deleteOne();
    await Post.findByIdAndUpdate(post.id, { $inc: { likes_count: -1 } });
    return successResponse(res, { liked: false }, 'Post unliked');
  }

  await Like.create({ user: req.user.id, target_id: post.id, target_type: 'post' });
  await Post.findByIdAndUpdate(post.id, { $inc: { likes_count: 1 } });
  if (idOf(post.user) !== req.user.id) {
    await createNotification({ recipientId: post.user, senderId: req.user.id, type: 'like', targetId: post.id, targetType: 'post', message: `${req.user.username} liked your post` });
  }
  return successResponse(res, { liked: true }, 'Post liked');
};

export const savePost = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, is_deleted: false });
  if (!post) return errorResponse(res, 'Post not found', 404);
  const existing = await SavedPost.findOne({ user: req.user.id, post: post.id });
  if (existing) {
    await existing.deleteOne();
    await Post.findByIdAndUpdate(post.id, { $inc: { saves_count: -1 } });
    return successResponse(res, { saved: false }, 'Post unsaved');
  }
  await SavedPost.create({ user: req.user.id, post: post.id });
  await Post.findByIdAndUpdate(post.id, { $inc: { saves_count: 1 } });
  return successResponse(res, { saved: true }, 'Post saved');
};

export const getSavedPosts = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const [saved, total] = await Promise.all([
    SavedPost.find({ user: req.user.id }).populate({ path: 'post', match: { is_deleted: false }, populate: { path: 'user', select: 'username full_name profile_picture' } }).sort({ createdAt: -1 }).skip(offset).limit(limit),
    SavedPost.countDocuments({ user: req.user.id }),
  ]);
  const posts = saved.filter((s) => s.post).map((s) => withUser(s.post));
  return paginatedResponse(res, posts, total, page, limit);
};

export const searchPosts = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const q = regex(req.query.q);
  const filter = { is_deleted: false, $or: [{ caption: q }, { hashtags: q }] };
  if (req.query.type) filter.memory_type = req.query.type;
  const posts = await populateUser(Post.find(filter).sort({ likes_count: -1, createdAt: -1 }).skip(offset).limit(limit));
  return successResponse(res, { posts: posts.map(withUser) });
};

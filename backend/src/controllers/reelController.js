import Reel from '../models/Reel.js';
import Like from '../models/Like.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { getPagination, extractHashtags } from '../utils/helpers.js';
import { idOf, withUser } from '../utils/mongoFormat.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService.js';
import { createNotification } from './notificationController.js';
import fs from 'fs';

const populateUser = (query) => query.populate('user', 'username full_name profile_picture');

export const createReel = async (req, res) => {
  const { caption, audio_name } = req.body;
  if (!req.file) return errorResponse(res, 'Video file required', 400);
  if (!req.file.mimetype.startsWith('video')) return errorResponse(res, 'Only video files allowed for reels', 400);

  const { url, publicId } = await uploadToCloudinary(req.file.path, 'reels', 'video');
  fs.unlinkSync(req.file.path);

  const reel = await Reel.create({
    user: req.user.id,
    video_url: url,
    video_public_id: publicId,
    caption,
    hashtags: extractHashtags(caption),
    audio_name: audio_name || null,
  });

  const populated = await populateUser(Reel.findById(reel.id));
  return successResponse(res, { reel: withUser(populated) }, 'Reel created', 201);
};

export const getReels = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const filter = { is_deleted: false };
  const [reels, total] = await Promise.all([
    populateUser(Reel.find(filter).sort({ createdAt: -1 }).skip(offset).limit(limit)),
    Reel.countDocuments(filter),
  ]);
  return paginatedResponse(res, reels.map(withUser), total, page, limit);
};

export const getTrendingReels = async (req, res) => {
  const { limit } = getPagination(req.query);
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const reels = await populateUser(Reel.find({ is_deleted: false, createdAt: { $gte: since } }).limit(limit * 3));
  reels.sort((a, b) => (b.likes_count * 2 + b.views_count + b.comments_count * 3) - (a.likes_count * 2 + a.views_count + a.comments_count * 3));
  return successResponse(res, { reels: reels.slice(0, limit).map(withUser) });
};

export const getReel = async (req, res) => {
  const reel = await populateUser(Reel.findOneAndUpdate({ _id: req.params.id, is_deleted: false }, { $inc: { views_count: 1 } }, { new: true }));
  if (!reel) return errorResponse(res, 'Reel not found', 404);
  return successResponse(res, { reel: withUser(reel) });
};

export const deleteReel = async (req, res) => {
  const reel = await Reel.findOne({ _id: req.params.id, is_deleted: false });
  if (!reel) return errorResponse(res, 'Reel not found', 404);
  if (idOf(reel.user) !== req.user.id && req.user.role !== 'admin') return errorResponse(res, 'Unauthorized', 403);

  if (reel.video_public_id) await deleteFromCloudinary(reel.video_public_id, 'video');
  reel.is_deleted = true;
  await reel.save();
  return successResponse(res, {}, 'Reel deleted');
};

export const likeReel = async (req, res) => {
  const reel = await Reel.findOne({ _id: req.params.id, is_deleted: false });
  if (!reel) return errorResponse(res, 'Reel not found', 404);

  const existing = await Like.findOne({ user: req.user.id, target_id: reel.id, target_type: 'reel' });
  if (existing) {
    await existing.deleteOne();
    await Reel.findByIdAndUpdate(reel.id, { $inc: { likes_count: -1 } });
    return successResponse(res, { liked: false }, 'Reel unliked');
  }

  await Like.create({ user: req.user.id, target_id: reel.id, target_type: 'reel' });
  await Reel.findByIdAndUpdate(reel.id, { $inc: { likes_count: 1 } });
  if (idOf(reel.user) !== req.user.id) {
    await createNotification({ recipientId: reel.user, senderId: req.user.id, type: 'like', targetId: reel.id, targetType: 'reel', message: `${req.user.username} liked your reel` });
  }

  return successResponse(res, { liked: true }, 'Reel liked');
};

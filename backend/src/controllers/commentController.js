import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import Reel from '../models/Reel.js';
import Like from '../models/Like.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { getPagination } from '../utils/helpers.js';
import { idOf, toPlain } from '../utils/mongoFormat.js';
import { createNotification } from './notificationController.js';

const Target = { post: Post, reel: Reel };
const countField = { post: Post, reel: Reel };

const serializeComment = (doc, replyCount = null) => {
  const obj = toPlain(doc);
  const user = doc.user;
  obj.user_id = idOf(user || obj.user);
  obj.parent_id = idOf(obj.parent) || null;
  if (user?.username) {
    obj.username = user.username;
    obj.full_name = user.full_name;
    obj.profile_picture = user.profile_picture;
  }
  if (replyCount !== null) obj.reply_count = replyCount;
  delete obj.user;
  delete obj.parent;
  return obj;
};

export const addComment = async (req, res) => {
  const { target_id, target_type, content, parent_id } = req.body;
  const Model = Target[target_type];
  const target = Model && await Model.findOne({ _id: target_id, is_deleted: false });
  if (!target) return errorResponse(res, `${target_type} not found`, 404);

  if (parent_id) {
    const parent = await Comment.findOne({ _id: parent_id, is_deleted: false });
    if (!parent) return errorResponse(res, 'Parent comment not found', 404);
  }

  const comment = await Comment.create({ user: req.user.id, target_id, target_type, parent: parent_id || null, content });
  await countField[target_type].findByIdAndUpdate(target_id, { $inc: { comments_count: 1 } });
  const populated = await Comment.findById(comment.id).populate('user', 'username full_name profile_picture');

  if (idOf(target.user) !== req.user.id) {
    await createNotification({
      recipientId: target.user,
      senderId: req.user.id,
      type: parent_id ? 'reply' : 'comment',
      targetId: target_id,
      targetType: target_type,
      message: `${req.user.username} ${parent_id ? 'replied to a comment on' : 'commented on'} your ${target_type}`,
    });
  }

  return successResponse(res, { comment: serializeComment(populated) }, 'Comment added', 201);
};

export const getComments = async (req, res) => {
  const { target_id, target_type } = req.query;
  const { page, limit, offset } = getPagination(req.query);
  const filter = { target_id, target_type, parent: null, is_deleted: false };
  const [comments, total] = await Promise.all([
    Comment.find(filter).populate('user', 'username full_name profile_picture').sort({ createdAt: -1 }).skip(offset).limit(limit),
    Comment.countDocuments(filter),
  ]);
  const counts = await Comment.aggregate([
    { $match: { parent: { $in: comments.map((c) => c._id) }, is_deleted: false } },
    { $group: { _id: '$parent', count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c) => [idOf(c._id), c.count]));
  return paginatedResponse(res, comments.map((c) => serializeComment(c, countMap.get(c.id) || 0)), total, page, limit);
};

export const getReplies = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const filter = { parent: req.params.commentId, is_deleted: false };
  const [replies, total] = await Promise.all([
    Comment.find(filter).populate('user', 'username full_name profile_picture').sort({ createdAt: 1 }).skip(offset).limit(limit),
    Comment.countDocuments(filter),
  ]);
  return paginatedResponse(res, replies.map((c) => serializeComment(c)), total, page, limit);
};

export const deleteComment = async (req, res) => {
  const comment = await Comment.findOne({ _id: req.params.id, is_deleted: false });
  if (!comment) return errorResponse(res, 'Comment not found', 404);
  if (idOf(comment.user) !== req.user.id && req.user.role !== 'admin') return errorResponse(res, 'Unauthorized', 403);

  comment.is_deleted = true;
  await comment.save();
  await countField[comment.target_type].findByIdAndUpdate(comment.target_id, { $inc: { comments_count: -1 } });
  return successResponse(res, {}, 'Comment deleted');
};

export const likeComment = async (req, res) => {
  const comment = await Comment.findOne({ _id: req.params.id, is_deleted: false });
  if (!comment) return errorResponse(res, 'Comment not found', 404);
  const existing = await Like.findOne({ user: req.user.id, target_id: comment.id, target_type: 'comment' });
  if (existing) {
    await existing.deleteOne();
    await Comment.findByIdAndUpdate(comment.id, { $inc: { likes_count: -1 } });
    return successResponse(res, { liked: false });
  }
  await Like.create({ user: req.user.id, target_id: comment.id, target_type: 'comment' });
  await Comment.findByIdAndUpdate(comment.id, { $inc: { likes_count: 1 } });
  return successResponse(res, { liked: true });
};

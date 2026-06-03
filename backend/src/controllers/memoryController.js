import Memory from '../models/Memory.js';
import mongoose from 'mongoose';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { getPagination } from '../utils/helpers.js';
import { idOf, withUser } from '../utils/mongoFormat.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';
import fs from 'fs';

const populateUser = (query) => query.populate('user', 'username full_name profile_picture');

export const createMemory = async (req, res) => {
  const { title, description, memory_date, memory_year, memory_type, tags } = req.body;
  const files = req.files || {};
  let beforeImage = null;
  let afterImage = null;

  if (files.before_image?.[0]) {
    const { url } = await uploadToCloudinary(files.before_image[0].path, 'memories', 'image');
    fs.unlinkSync(files.before_image[0].path);
    beforeImage = url;
  }
  if (files.after_image?.[0]) {
    const { url } = await uploadToCloudinary(files.after_image[0].path, 'memories', 'image');
    fs.unlinkSync(files.after_image[0].path);
    afterImage = url;
  }

  const memory = await Memory.create({
    user: req.user.id,
    title,
    description,
    before_image: beforeImage,
    after_image: afterImage,
    memory_date: memory_date || null,
    memory_year: memory_year || null,
    memory_type,
    tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
  });
  const populated = await populateUser(Memory.findById(memory.id));
  return successResponse(res, { memory: withUser(populated) }, 'Memory created', 201);
};

export const getMemories = async (req, res) => {
  const { type, year, userId } = req.query;
  const { page, limit, offset } = getPagination(req.query);
  const filter = { is_deleted: false };
  if (type) filter.memory_type = type;
  if (year) filter.memory_year = Number(year);
  if (userId) filter.user = userId;

  const [memories, total] = await Promise.all([
    populateUser(Memory.find(filter).sort({ createdAt: -1 }).skip(offset).limit(limit)),
    Memory.countDocuments(filter),
  ]);
  return paginatedResponse(res, memories.map(withUser), total, page, limit);
};

export const getMemoryTimeline = async (req, res) => {
  const timeline = await Memory.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(req.params.userId), is_deleted: false, memory_year: { $ne: null } } },
    { $group: { _id: '$memory_year', count: { $sum: 1 }, memories: { $push: { id: '$_id', title: '$title', memory_type: '$memory_type', before_image: '$before_image' } } } },
    { $sort: { _id: -1 } },
    { $project: { _id: 0, memory_year: '$_id', count: 1, memories: 1 } },
  ]);
  return successResponse(res, { timeline });
};

export const deleteMemory = async (req, res) => {
  const memory = await Memory.findOne({ _id: req.params.id, is_deleted: false });
  if (!memory) return errorResponse(res, 'Memory not found', 404);
  if (idOf(memory.user) !== req.user.id && req.user.role !== 'admin') return errorResponse(res, 'Unauthorized', 403);
  memory.is_deleted = true;
  await memory.save();
  return successResponse(res, {}, 'Memory deleted');
};

export const likeMemory = async (req, res) => {
  const memory = await Memory.findOneAndUpdate({ _id: req.params.id, is_deleted: false }, { $inc: { likes_count: 1 } });
  if (!memory) return errorResponse(res, 'Memory not found', 404);
  return successResponse(res, {}, 'Memory liked');
};

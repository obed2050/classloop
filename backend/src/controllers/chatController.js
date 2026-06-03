import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { getPagination } from '../utils/helpers.js';
import { idOf, toPlain } from '../utils/mongoFormat.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';
import { createNotification } from './notificationController.js';
import fs from 'fs';

const serializeConversation = (doc) => {
  const obj = toPlain(doc);
  const participants = doc.participants || [];
  obj.participants = participants.map((p) => idOf(p));
  obj.participant_names = participants.map((p) => p.username).filter(Boolean).join(', ');
  obj.participant_avatars = participants.map((p) => p.profile_picture).filter(Boolean).join(',');
  obj.created_by = idOf(obj.created_by);
  return obj;
};

const serializeMessage = (doc) => {
  const obj = toPlain(doc);
  const sender = doc.sender;
  obj.conversation_id = idOf(obj.conversation);
  obj.sender_id = idOf(sender || obj.sender);
  if (sender?.username) {
    obj.username = sender.username;
    obj.full_name = sender.full_name;
    obj.profile_picture = sender.profile_picture;
  }
  delete obj.conversation;
  delete obj.sender;
  return obj;
};

export const getOrCreateConversation = async (req, res) => {
  const { userId } = req.body;
  if (userId === req.user.id) return errorResponse(res, 'Cannot chat with yourself', 400);
  if (!(await User.exists({ _id: userId }))) return errorResponse(res, 'User not found', 404);

  const existing = await Conversation.findOne({ is_group: false, participants: { $all: [req.user.id, userId], $size: 2 } });
  if (existing) return successResponse(res, { conversation: serializeConversation(existing) });

  const conversation = await Conversation.create({ created_by: req.user.id, participants: [req.user.id, userId] });
  return successResponse(res, { conversation: serializeConversation(conversation) }, 'Conversation created', 201);
};

export const createGroupChat = async (req, res) => {
  const { name, memberIds } = req.body;
  if (!name || !memberIds?.length) return errorResponse(res, 'Group name and members required', 400);
  const participants = [...new Set([req.user.id, ...memberIds])];
  const conversation = await Conversation.create({ name, is_group: true, created_by: req.user.id, participants });
  return successResponse(res, { conversation: serializeConversation(conversation) }, 'Group created', 201);
};

export const getMyConversations = async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user.id })
    .populate('participants', 'username profile_picture')
    .sort({ last_message_at: -1 });
  return successResponse(res, { conversations: conversations.map(serializeConversation) });
};

export const getMessages = async (req, res) => {
  const { conversationId } = req.params;
  const { page, limit, offset } = getPagination(req.query);
  const conversation = await Conversation.findOne({ _id: conversationId, participants: req.user.id });
  if (!conversation) return errorResponse(res, 'Access denied', 403);

  const filter = { conversation: conversationId, is_deleted: false };
  const [messages, total] = await Promise.all([
    Message.find(filter).populate('sender', 'username full_name profile_picture').sort({ createdAt: -1 }).skip(offset).limit(limit),
    Message.countDocuments(filter),
  ]);
  await Message.updateMany({ conversation: conversationId, sender: { $ne: req.user.id } }, { is_read: true });
  return paginatedResponse(res, messages.reverse().map(serializeMessage), total, page, limit);
};

export const sendMessage = async (req, res) => {
  const { conversationId } = req.params;
  const { content } = req.body;
  const conversation = await Conversation.findOne({ _id: conversationId, participants: req.user.id });
  if (!conversation) return errorResponse(res, 'Access denied', 403);

  let mediaUrl = null;
  let mediaType = null;
  if (req.file) {
    const isVideo = req.file.mimetype.startsWith('video');
    const { url } = await uploadToCloudinary(req.file.path, 'messages', isVideo ? 'video' : 'image');
    fs.unlinkSync(req.file.path);
    mediaUrl = url;
    mediaType = isVideo ? 'video' : 'image';
  }
  if (!content && !mediaUrl) return errorResponse(res, 'Message content or media required', 400);

  const message = await Message.create({ conversation: conversationId, sender: req.user.id, content: content || null, media_url: mediaUrl, media_type: mediaType });
  conversation.last_message = content || 'Media';
  conversation.last_message_at = new Date();
  await conversation.save();

  const populated = await Message.findById(message.id).populate('sender', 'username full_name profile_picture');
  for (const participantId of conversation.participants) {
    if (idOf(participantId) !== req.user.id) {
      await createNotification({ recipientId: participantId, senderId: req.user.id, type: 'message', targetId: conversationId, targetType: 'conversation', message: `${req.user.username} sent you a message` });
    }
  }

  return successResponse(res, { message: serializeMessage(populated) }, 'Message sent', 201);
};

export const deleteMessage = async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) return errorResponse(res, 'Message not found', 404);
  if (idOf(message.sender) !== req.user.id) return errorResponse(res, 'Unauthorized', 403);
  message.is_deleted = true;
  await message.save();
  return successResponse(res, {}, 'Message deleted');
};

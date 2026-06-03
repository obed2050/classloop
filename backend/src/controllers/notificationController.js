import Notification from '../models/Notification.js';
import { successResponse, paginatedResponse } from '../utils/apiResponse.js';
import { getPagination } from '../utils/helpers.js';
import { idOf, toPlain } from '../utils/mongoFormat.js';

const serializeNotification = (doc) => {
  const obj = toPlain(doc);
  const sender = doc.sender;
  obj.recipient_id = idOf(obj.recipient);
  obj.sender_id = idOf(sender || obj.sender);
  if (sender?.username) {
    obj.sender_username = sender.username;
    obj.sender_avatar = sender.profile_picture;
  }
  delete obj.recipient;
  delete obj.sender;
  return obj;
};

export const createNotification = async ({ recipientId, senderId, type, targetId, targetType, message }) => {
  try {
    await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type,
      target_id: targetId || null,
      target_type: targetType || null,
      message,
    });
  } catch (_) {}
};

export const getNotifications = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const filter = { recipient: req.user.id };
  const [notifications, total, unread] = await Promise.all([
    Notification.find(filter).populate('sender', 'username profile_picture').sort({ createdAt: -1 }).skip(offset).limit(limit),
    Notification.countDocuments(filter),
    Notification.countDocuments({ ...filter, is_read: false }),
  ]);

  return paginatedResponse(res, notifications.map(serializeNotification), total, page, limit, `${unread} unread notifications`);
};

export const markAsRead = async (req, res) => {
  await Notification.updateMany({ recipient: req.user.id }, { is_read: true });
  return successResponse(res, {}, 'All notifications marked as read');
};

export const markOneAsRead = async (req, res) => {
  await Notification.updateOne({ _id: req.params.id, recipient: req.user.id }, { is_read: true });
  return successResponse(res, {}, 'Notification marked as read');
};

import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import { idOf, serializeUser } from '../utils/mongoFormat.js';
import logger from '../utils/logger.js';

const onlineUsers = new Map();

const socketHandler = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
      if (!token) return next(new Error('Authentication required'));

      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('username profile_picture');
      if (!user) return next(new Error('User not found'));

      socket.user = serializeUser(user);
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    logger.info(`Socket connected: ${socket.user.username} (${socket.id})`);

    onlineUsers.set(userId, socket.id);
    io.emit('user:online', { userId, username: socket.user.username });
    socket.join(`user:${userId}`);

    socket.on('conversation:join', (conversationId) => socket.join(`conversation:${conversationId}`));
    socket.on('conversation:leave', (conversationId) => socket.leave(`conversation:${conversationId}`));

    socket.on('message:send', async ({ conversationId, content, mediaUrl, mediaType }) => {
      try {
        const conversation = await Conversation.findOne({ _id: conversationId, participants: userId });
        if (!conversation) return socket.emit('error', { message: 'Not a participant' });

        const messageDoc = await Message.create({
          conversation: conversationId,
          sender: userId,
          content: content || null,
          media_url: mediaUrl || null,
          media_type: mediaType || null,
        });
        conversation.last_message = content || 'Media';
        conversation.last_message_at = new Date();
        await conversation.save();

        const message = {
          id: messageDoc.id,
          conversation_id: conversationId,
          sender_id: userId,
          username: socket.user.username,
          profile_picture: socket.user.profile_picture,
          content,
          media_url: mediaUrl,
          media_type: mediaType,
          created_at: messageDoc.createdAt,
        };

        io.to(`conversation:${conversationId}`).emit('message:new', message);

        for (const participantId of conversation.participants) {
          const participant = idOf(participantId);
          if (participant === userId) continue;
          if (onlineUsers.has(participant)) {
            io.to(`user:${participant}`).emit('notification:new', {
              type: 'message',
              message: `${socket.user.username} sent a message`,
              conversationId,
            });
          }
        }
      } catch (err) {
        logger.error('Socket message:send error:', err.message);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('typing:start', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('typing:start', { userId, username: socket.user.username, conversationId });
    });

    socket.on('typing:stop', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('typing:stop', { userId, conversationId });
    });

    socket.on('notification:read', async ({ notificationId }) => {
      await Notification.updateOne({ _id: notificationId, recipient: userId }, { is_read: true });
    });

    socket.on('status:get', ({ userIds }) => {
      const statuses = userIds.reduce((acc, id) => {
        acc[id] = onlineUsers.has(id);
        return acc;
      }, {});
      socket.emit('status:response', statuses);
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('user:offline', { userId });
      logger.info(`Socket disconnected: ${socket.user.username}`);
    });
  });
};

export const emitToUser = (io, userId, event, data) => {
  io.to(`user:${userId}`).emit(event, data);
};

export const getOnlineUsers = () => Array.from(onlineUsers.keys());

export default socketHandler;

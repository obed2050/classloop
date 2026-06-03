import { Router } from 'express';
import {
  getOrCreateConversation, createGroupChat, getMyConversations,
  getMessages, sendMessage, deleteMessage,
} from '../controllers/chatController.js';
import { authenticate } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = Router();

router.get('/conversations', authenticate, getMyConversations);
router.post('/conversations', authenticate, getOrCreateConversation);
router.post('/conversations/group', authenticate, createGroupChat);
router.get('/conversations/:conversationId/messages', authenticate, getMessages);
router.post('/conversations/:conversationId/messages', authenticate, uploadSingle('media'), sendMessage);
router.delete('/messages/:id', authenticate, deleteMessage);

export default router;

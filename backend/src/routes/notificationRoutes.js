import { Router } from 'express';
import { getNotifications, markAsRead, markOneAsRead } from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getNotifications);
router.put('/read-all', authenticate, markAsRead);
router.put('/:id/read', authenticate, markOneAsRead);

export default router;

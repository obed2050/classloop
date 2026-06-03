import { Router } from 'express';
import {
  getAllUsers, banUser, unbanUser, deletePostAdmin,
  getDashboardStats, getFlaggedContent,
} from '../controllers/adminController.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, authorizeAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:userId/ban', banUser);
router.put('/users/:userId/unban', unbanUser);
router.delete('/posts/:postId', deletePostAdmin);
router.get('/flagged', getFlaggedContent);

export default router;

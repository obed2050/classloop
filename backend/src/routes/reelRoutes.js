import { Router } from 'express';
import {
  createReel, getReels, getTrendingReels, getReel, deleteReel, likeReel,
} from '../controllers/reelController.js';
import { authenticate } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = Router();

router.get('/', authenticate, getReels);
router.get('/trending', authenticate, getTrendingReels);
router.post('/', authenticate, uploadSingle('video'), createReel);
router.get('/:id', authenticate, getReel);
router.delete('/:id', authenticate, deleteReel);
router.post('/:id/like', authenticate, likeReel);

export default router;

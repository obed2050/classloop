import { Router } from 'express';
import { createMemory, getMemories, getMemoryTimeline, deleteMemory, likeMemory } from '../controllers/memoryController.js';
import { authenticate } from '../middleware/auth.js';
import { uploadFields } from '../middleware/upload.js';

const router = Router();

router.get('/', authenticate, getMemories);
router.post('/', authenticate, uploadFields([{ name: 'before_image', maxCount: 1 }, { name: 'after_image', maxCount: 1 }]), createMemory);
router.get('/timeline/:userId', authenticate, getMemoryTimeline);
router.delete('/:id', authenticate, deleteMemory);
router.post('/:id/like', authenticate, likeMemory);

export default router;

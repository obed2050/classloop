import { Router } from 'express';
import { addComment, getComments, getReplies, deleteComment, likeComment } from '../controllers/commentController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { commentValidation } from '../validations/index.js';

const router = Router();

router.get('/', authenticate, getComments);
router.post('/', authenticate, commentValidation, validate, addComment);
router.get('/:commentId/replies', authenticate, getReplies);
router.delete('/:id', authenticate, deleteComment);
router.post('/:id/like', authenticate, likeComment);

export default router;

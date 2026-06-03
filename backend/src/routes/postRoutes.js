import { Router } from 'express';
import {
  createPost, getFeed, getPost, getUserPosts,
  deletePost, likePost, savePost, getSavedPosts, searchPosts,
} from '../controllers/postController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { postValidation } from '../validations/index.js';
import { uploadSingle } from '../middleware/upload.js';

const router = Router();

router.get('/feed', authenticate, getFeed);
router.get('/saved', authenticate, getSavedPosts);
router.get('/search', authenticate, searchPosts);
router.post('/', authenticate, uploadSingle('media'), postValidation, validate, createPost);
router.get('/user/:userId', authenticate, getUserPosts);
router.get('/:id', authenticate, getPost);
router.delete('/:id', authenticate, deletePost);
router.post('/:id/like', authenticate, likePost);
router.post('/:id/save', authenticate, savePost);

export default router;

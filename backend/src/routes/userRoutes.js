import { Router } from 'express';
import {
  getUserProfile, updateProfile, uploadProfilePicture,
  followUser, getFollowers, getFollowing, searchUsers, getSuggestedUsers,
} from '../controllers/userController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateProfileValidation, searchValidation } from '../validations/index.js';
import { uploadSingle } from '../middleware/upload.js';

const router = Router();

router.get('/search', authenticate, searchValidation, validate, searchUsers);
router.get('/suggested', authenticate, getSuggestedUsers);
router.get('/:username', optionalAuth, getUserProfile);
router.put('/profile/update', authenticate, updateProfileValidation, validate, updateProfile);
router.post('/profile/avatar', authenticate, uploadSingle('avatar'), uploadProfilePicture);
router.post('/:userId/follow', authenticate, followUser);
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);

export default router;

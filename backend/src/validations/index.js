import { body, query } from 'express-validator';

export const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_.]+$/)
    .withMessage('Username must be 3-30 chars, letters/numbers/._'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('full_name').trim().isLength({ min: 2, max: 100 }).withMessage('Full name required'),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

export const updateProfileValidation = [
  body('full_name').optional().trim().isLength({ min: 2, max: 100 }),
  body('bio').optional().isLength({ max: 300 }).withMessage('Bio max 300 chars'),
  body('school_name').optional().trim().isLength({ max: 100 }),
  body('graduation_year').optional().isInt({ min: 1990, max: 2030 }),
  body('class_section').optional().trim().isLength({ max: 20 }),
];

export const postValidation = [
  body('caption').optional().isLength({ max: 2200 }).withMessage('Caption max 2200 chars'),
  body('memory_year').optional().isInt({ min: 1990, max: new Date().getFullYear() }),
];

export const commentValidation = [
  body('content').trim().isLength({ min: 1, max: 500 }).withMessage('Comment must be 1-500 chars'),
];

export const messageValidation = [
  body('content').optional().trim().isLength({ min: 1, max: 1000 }),
];

export const searchValidation = [
  query('q').trim().isLength({ min: 1 }).withMessage('Search query required'),
];

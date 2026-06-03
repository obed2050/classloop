import User from '../models/User.js';
import { generateToken, setTokenCookie } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { sanitizeUser } from '../utils/helpers.js';

export const register = async (req, res) => {
  const { username, email, password, full_name, school_name, graduation_year } = req.body;

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) return errorResponse(res, 'Email or username already taken', 409);

  const user = await User.create({ username, email, password, full_name, school_name, graduation_year });
  const token = generateToken({ id: user.id, role: user.role });
  setTokenCookie(res, token);

  return successResponse(res, { user: sanitizeUser(user), token }, 'Registration successful', 201);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) return errorResponse(res, 'Invalid credentials', 401);

  if (user.is_banned) return errorResponse(res, 'Your account has been banned', 403);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return errorResponse(res, 'Invalid credentials', 401);

  const token = generateToken({ id: user.id, role: user.role });
  setTokenCookie(res, token);

  return successResponse(res, { user: sanitizeUser(user), token }, 'Login successful');
};

export const logout = (req, res) => {
  res.clearCookie('token');
  return successResponse(res, {}, 'Logged out successfully');
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  return successResponse(res, { user: sanitizeUser(user) });
};

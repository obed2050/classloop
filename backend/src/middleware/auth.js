import { verifyToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/apiResponse.js';
import User from '../models/User.js';
import { serializeUser } from '../utils/mongoFormat.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) return errorResponse(res, 'Access denied. No token provided.', 401);

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('username email role is_banned');

    if (!user) return errorResponse(res, 'User not found', 401);
    if (user.is_banned) return errorResponse(res, 'Your account has been banned', 403);

    req.user = serializeUser(user);
    next();
  } catch (err) {
    return errorResponse(res, 'Invalid or expired token', 401);
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') return errorResponse(res, 'Admin access required', 403);
  next();
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('username email role');
      if (user) req.user = serializeUser(user);
    }
  } catch (_) {}
  next();
};

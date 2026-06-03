import { randomUUID } from 'crypto';

export const generateId = () => randomUUID();

export const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit) || 10));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

export const extractHashtags = (caption = '') => {
  const matches = caption.match(/#[\w]+/g);
  return matches ? matches.map((tag) => tag.toLowerCase()) : [];
};

export const sanitizeUser = (user) => {
  const obj = user?.toObject ? user.toObject({ virtuals: true }) : user;
  const { password, ...safe } = obj || {};
  if (safe._id) {
    safe.id = safe._id.toString();
    delete safe._id;
  }
  delete safe.__v;
  return safe;
};

export const buildSearchQuery = (search, fields) => {
  if (!search) return { clause: '', params: [] };
  const conditions = fields.map((f) => `${f} LIKE ?`).join(' OR ');
  const params = fields.map(() => `%${search}%`);
  return { clause: `(${conditions})`, params };
};

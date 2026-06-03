export const idOf = (value) => value?._id?.toString?.() || value?.id?.toString?.() || value?.toString?.() || value;

export const toPlain = (doc) => {
  if (!doc) return doc;
  const obj = doc.toObject ? doc.toObject({ virtuals: true }) : { ...doc };
  obj.id = idOf(obj._id || obj.id);
  delete obj._id;
  delete obj.__v;
  if (obj.createdAt) obj.created_at = obj.createdAt;
  if (obj.updatedAt) obj.updated_at = obj.updatedAt;
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
};

export const publicUserFields = 'username full_name profile_picture school_name graduation_year class_section role is_banned is_private followers_count following_count posts_count email';

export const serializeUser = (user) => {
  const obj = toPlain(user);
  if (!obj) return obj;
  delete obj.password;
  return obj;
};

export const withUser = (doc, userKey = 'user') => {
  const obj = toPlain(doc);
  const user = doc?.[userKey] || obj?.[userKey];
  const plainUser = serializeUser(user);
  if (plainUser) {
    obj.user_id = plainUser.id;
    obj.username = plainUser.username;
    obj.full_name = plainUser.full_name;
    obj.profile_picture = plainUser.profile_picture;
    obj.school_name = plainUser.school_name;
    obj.graduation_year = plainUser.graduation_year;
  } else if (obj[userKey]) {
    obj.user_id = idOf(obj[userKey]);
  }
  delete obj[userKey];
  return obj;
};

export const regex = (value) => new RegExp(String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

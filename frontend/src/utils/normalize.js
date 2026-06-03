export const normalizeUser = (u) => ({
  id: u.id || u._id,
  name: u.full_name || u.name,
  username: u.username,
  avatar: u.profile_picture || u.avatar,
  cover: u.cover || '',
  bio: u.bio || '',
  school: u.school_name || u.school || '',
  followers: u.followers_count !== undefined ? formatCount(u.followers_count) : u.followers || '0',
  following: u.following_count !== undefined ? u.following_count : u.following || 0,
  posts: u.posts_count !== undefined ? u.posts_count : u.posts || 0,
  is_following: u.is_following || false,
  is_private: u.is_private || false,
});

export const normalizePost = (p) => ({
  id: p.id || p._id,
  author: p.user ? normalizeUser(p.user) : p.author,
  image: p.media_url || p.image,
  caption: p.caption || '',
  likes: p.likes_count !== undefined ? formatCount(p.likes_count) : p.likes || '0',
  comments: p.comments_count !== undefined ? p.comments_count : p.comments || 0,
  shares: p.shares_count !== undefined ? p.shares_count : p.shares || 0,
  time: p.createdAt ? timeAgo(p.createdAt) : p.time || 'Now',
  is_liked: p.is_liked || false,
  is_saved: p.is_saved || false,
  is_memory: p.is_memory || false,
  memory_year: p.memory_year || null,
  memory_type: p.memory_type || null,
});

export const normalizeMemory = (m) => ({
  id: m.id || m._id,
  title: m.title,
  note: m.description || m.note,
  image: m.before_image || m.image || '',
  after_image: m.after_image || null,
  type: m.memory_type || m.type || 'Memory',
  year: m.memory_year ? String(m.memory_year) : m.year || '',
  likes_count: m.likes_count || 0,
  tags: m.tags || [],
  user: m.user ? normalizeUser(m.user) : null,
});

export const normalizeReel = (r) => ({
  id: r.id || r._id,
  author: r.user ? normalizeUser(r.user) : r.author,
  image: r.video_url || r.thumbnail_url || r.image,
  caption: r.caption || '',
  likes: r.likes_count !== undefined ? formatCount(r.likes_count) : r.likes || '0',
  comments: r.comments_count !== undefined ? formatCount(r.comments_count) : r.comments || '0',
  views: r.views_count || 0,
});

export const normalizeConversation = (c) => ({
  id: c.id || c._id,
  user: c.user ? normalizeUser(c.user) : c.participants?.[0] ? normalizeUser(c.participants[0]) : {},
  last: c.last_message || c.last || '',
  unread: c.unread_count || c.unread || 0,
  messages: (c.messages || []).map((m) => ({
    id: m.id || m._id,
    from: m.sender === 'me' || (m.sender && m.sender === 'current') ? 'me' : 'them',
    text: m.content || m.text,
  })),
});

export const normalizeNotification = (n) => ({
  id: n.id || n._id,
  user: n.sender ? normalizeUser(n.sender) : n.user,
  text: n.message || n.text,
  time: n.createdAt ? timeAgo(n.createdAt) : n.time || '',
  is_read: n.is_read || false,
  type: n.type,
});

const timeAgo = (date) => {
  const now = new Date();
  const then = new Date(date);
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d`;
  return `${Math.floor(diff / 2592000)}mo`;
};

const formatCount = (num) => {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'K';
  return String(num);
};

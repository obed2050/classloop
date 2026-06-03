import api from './api.js';

export const getReels = (page = 1) => api.get('/reels', { params: { page, limit: 5 } });
export const getTrendingReels = () => api.get('/reels/trending');
export const createReel = (formData) => api.post('/reels', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const likeReel = (id) => api.post(`/reels/${id}/like`);

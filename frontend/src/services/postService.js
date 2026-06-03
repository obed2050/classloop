import api from './api.js';

export const getFeed = (page = 1) => api.get('/posts/feed', { params: { page, limit: 10 } });
export const getPost = (id) => api.get(`/posts/${id}`);
export const getUserPosts = (userId, page = 1) => api.get(`/posts/user/${userId}`, { params: { page, limit: 12 } });
export const createPost = (formData) => api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const likePost = (id) => api.post(`/posts/${id}/like`);
export const savePost = (id) => api.post(`/posts/${id}/save`);
export const getSavedPosts = (page = 1) => api.get('/posts/saved', { params: { page, limit: 12 } });
export const searchPosts = (q, type) => api.get('/posts/search', { params: { q, type } });

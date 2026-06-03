import api from './api.js';

export const getUserProfile = (username) => api.get(`/users/${username}`);
export const updateProfile = (data) => api.put('/users/profile/update', data);
export const uploadAvatar = (formData) => api.post('/users/profile/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const followUser = (userId) => api.post(`/users/${userId}/follow`);
export const getFollowers = (userId) => api.get(`/users/${userId}/followers`);
export const getFollowing = (userId) => api.get(`/users/${userId}/following`);
export const getSuggested = () => api.get('/users/suggested');
export const searchUsers = (q) => api.get('/users/search', { params: { q } });

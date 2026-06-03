import api from './api.js';

export const getMemories = (params) => api.get('/memories', { params });
export const getMemoryTimeline = (userId) => api.get(`/memories/timeline/${userId}`);
export const createMemory = (formData) => api.post('/memories', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const likeMemory = (id) => api.post(`/memories/${id}/like`);
export const deleteMemory = (id) => api.delete(`/memories/${id}`);

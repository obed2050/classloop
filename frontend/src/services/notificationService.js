import api from './api.js';

export const getNotifications = () => api.get('/notifications');
export const markAllRead = () => api.put('/notifications/read-all');
export const markRead = (id) => api.put(`/notifications/${id}/read`);

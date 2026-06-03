import api from './api.js';

export const getConversations = () => api.get('/chat/conversations');
export const createConversation = (participantId) => api.post('/chat/conversations', { participantId });
export const getMessages = (conversationId) => api.get(`/chat/conversations/${conversationId}/messages`);
export const sendMessage = (conversationId, content) => api.post(`/chat/conversations/${conversationId}/messages`, { content });

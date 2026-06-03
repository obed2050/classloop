import { io } from 'socket.io-client';

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      autoConnect: false,
      transports: ['websocket'],
    });
  }
  return socket;
};

export const connectSocket = () => {
  const instance = getSocket();
  if (!instance.connected) instance.connect();
  return instance;
};

export const disconnectSocket = () => {
  if (socket?.connected) socket.disconnect();
};

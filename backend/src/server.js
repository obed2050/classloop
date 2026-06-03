import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import socketHandler from './sockets/socketHandler.js';
import logger from './utils/logger.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

// ─── Socket.IO Setup ───────────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST'],
  },
  pingTimeout: 60000,
});

socketHandler(io);

// Make io accessible in controllers via app
app.set('io', io);

// ─── Start Server ──────────────────────────────────────────────────────────────
const start = async () => {
  await connectDB();
  httpServer.listen(PORT, () => {
    logger.info(`🚀 ClassLoop server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    logger.info(`📡 Socket.IO ready`);
    logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
  });
};

// ─── Graceful Shutdown ─────────────────────────────────────────────────────────
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err.message);
  process.exit(1);
});

start();

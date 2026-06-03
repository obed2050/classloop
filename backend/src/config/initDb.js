import dotenv from 'dotenv';
import { connectDB } from './db.js';
import logger from '../utils/logger.js';

dotenv.config();

const initDb = async () => {
  await connectDB();
  logger.info('MongoDB models initialized and indexes synced');
  process.exit(0);
};

initDb().catch((err) => {
  logger.error('Database initialization failed:', err.message);
  process.exit(1);
});

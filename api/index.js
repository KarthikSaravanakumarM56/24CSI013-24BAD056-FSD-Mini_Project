const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Cache DB connection across serverless invocations
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('[Vercel] Warning: MONGODB_URI is not set. Please add it to your Vercel Environment Variables.');
  }

  try {
    await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/skillbridge', {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false
    });
    isConnected = true;
    console.log('[Vercel Serverless] MongoDB Connected successfully.');
  } catch (err) {
    console.error('[Vercel Serverless] Database connection error:', err.message);
  }
};

const app = require('../server/src/server');

module.exports = async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};

const { connectDB } = require('../server/src/config/db');
const app = require('../server/src/server');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('[Vercel Serverless] Database connection error:', err.message);
  }
  return app(req, res);
};

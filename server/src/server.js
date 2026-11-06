const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { connectDB, sanitizeMongoUri } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure database connection is established before processing API requests (Essential for Serverless / Vercel)
app.use(async (req, res, next) => {
  const url = req.originalUrl || req.url || '';
  if (url.startsWith('/api') && url !== '/api/health' && url !== '/api/debug-db') {
    try {
      await connectDB();
    } catch (err) {
      console.warn('[Database Connection Warning]:', err.message);
      // For Google instant auth or static catalog routes, let routes proceed with fallback
      if (url.startsWith('/api/auth/google') || url.startsWith('/api/users/domains')) {
        return next();
      }
      return res.status(500).json({
        success: false,
        message: `Database connection error: ${err.message}. Please check MONGODB_URI and verify MongoDB Atlas Network Access whitelist (0.0.0.0/0).`
      });
    }
  }
  next();
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'SkillBridge API',
    timestamp: new Date().toISOString()
  });
});

// Diagnostic DB Status Check
app.get('/api/debug-db', async (req, res) => {
  try {
    const rawUri = process.env.MONGODB_URI || 'NOT_SET';
    const sanitized = sanitizeMongoUri(rawUri);
    const masked = sanitized.replace(/\/\/.*@/, '//<credentials>@');
    await connectDB();
    const state = mongoose.connection.readyState;
    res.json({
      connected: state === 1,
      readyState: state,
      maskedUri: masked,
      hasSrv: rawUri.includes('mongodb+srv://')
    });
  } catch (err) {
    res.status(500).json({
      connected: false,
      error: err.message,
      name: err.name
    });
  }
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/assessments', require('./routes/assessmentRoutes'));
app.use('/api/mentors', require('./routes/mentorRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Static serving for Production (Single-port deployment)
const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Global Error Handler
app.use(errorHandler);

// Connect DB & Start Server (Only in standalone/local mode, not in Vercel serverless)
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 SkillBridge Server running on port ${PORT}`);
      console.log(`📡 API URL: http://localhost:${PORT}/api`);
      console.log(`===============================================`);
    });
  } catch (err) {
    console.error('[Server Error] Failed to start server:', err);
    process.exit(1);
  }
};

if (!process.env.VERCEL) {
  startServer();
}

module.exports = app;

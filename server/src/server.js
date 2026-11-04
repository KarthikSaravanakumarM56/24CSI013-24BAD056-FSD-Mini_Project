const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'SkillBridge API',
    timestamp: new Date().toISOString()
  });
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

    // Auto-seed if database is currently empty
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Server] Database is empty. Running automatic seed...');
      const seedAll = require('./seed/seedData');
      await seedAll();
    }

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

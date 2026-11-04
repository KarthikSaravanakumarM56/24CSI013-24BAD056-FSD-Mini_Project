const mongoose = require('mongoose');

let mongoMemoryServer = null;
let isSeeded = false;

// Auto-sanitizes MongoDB URI: strips accidental <brackets> and URL-encodes special characters in password
const sanitizeMongoUri = (rawUri) => {
  if (!rawUri || !rawUri.includes('://')) return rawUri;
  try {
    const schemeMatch = rawUri.match(/^([a-z0-9+]+:\/\/)(.*)$/i);
    if (!schemeMatch) return rawUri;
    const scheme = schemeMatch[1];
    const afterScheme = schemeMatch[2];

    const lastAtIndex = afterScheme.lastIndexOf('@');
    if (lastAtIndex === -1) return rawUri;

    const creds = afterScheme.substring(0, lastAtIndex);
    const hostAndRest = afterScheme.substring(lastAtIndex + 1);

    const colonIndex = creds.indexOf(':');
    if (colonIndex === -1) return rawUri;

    let user = creds.substring(0, colonIndex);
    let pass = creds.substring(colonIndex + 1);

    if (pass.startsWith('<') && pass.endsWith('>')) {
      pass = pass.slice(1, -1);
    }
    if (user.startsWith('<') && user.endsWith('>')) {
      user = user.slice(1, -1);
    }

    let decodedPass;
    try {
      decodedPass = decodeURIComponent(pass);
    } catch (e) {
      decodedPass = pass;
    }
    const encodedPass = encodeURIComponent(decodedPass);

    return `${scheme}${user}:${encodedPass}@${hostAndRest}`;
  } catch (err) {
    console.warn('[Database] URI sanitization fallback:', err.message);
    return rawUri;
  }
};

const connectDB = async () => {
  // If already connected, reuse connection (essential for serverless environments like Vercel)
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const rawUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillbridge';
  const uri = sanitizeMongoUri(rawUri);
  const isCloudUri = uri.includes('mongodb+srv://') || process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

  try {
    // Connect with serverSelectionTimeoutMS
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: isCloudUri ? 8000 : 3000,
      bufferCommands: false
    });
    console.log(`[Database] MongoDB Connected successfully`);

    // Auto-seed if database is currently empty
    if (!isSeeded) {
      try {
        const User = require('../models/User');
        const userCount = await User.countDocuments();
        if (userCount === 0) {
          console.log('[Server] Database is empty. Running automatic seed...');
          const seedAll = require('../seed/seedData');
          await seedAll();
        }
        isSeeded = true;
      } catch (seedErr) {
        console.warn('[Database] Seeding check error:', seedErr.message);
      }
    }

    return mongoose.connection;
  } catch (err) {
    console.error(`[Database] Connection error:`, err.message);

    // In Cloud/Vercel environments, do not attempt to run MongoDB Memory Server
    if (isCloudUri || process.env.VERCEL) {
      throw err;
    }

    console.log(`[Database] Initializing MongoDB Memory Server for local development...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[Database] Connected to in-memory MongoDB at: ${memoryUri}`);

      if (!isSeeded) {
        const seedAll = require('../seed/seedData');
        await seedAll();
        isSeeded = true;
      }
      return mongoose.connection;
    } catch (memErr) {
      console.error(`[Database] Critical error starting in-memory MongoDB:`, memErr.message);
      throw memErr;
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB, sanitizeMongoUri };

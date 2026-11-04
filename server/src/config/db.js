const mongoose = require('mongoose');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

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
  // If already connected and ready, return existing connection immediately
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If already connecting, await that same in-flight promise!
  if (!cached.promise) {
    const rawUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillbridge';
    const uri = sanitizeMongoUri(rawUri);
    const isCloudUri = uri.includes('mongodb+srv://') || process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: isCloudUri ? 15000 : 3000
    };

    cached.promise = mongoose.connect(uri, opts).then(async (m) => {
      console.log('[Database] MongoDB Connected successfully');

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
          console.warn('[Database] Seeding check warning:', seedErr.message);
        }
      }

      return m;
    }).catch(err => {
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error('[Database] Connection failed:', err.message);

    // In local development, fall back to in-memory server if not in cloud
    const isCloud = (process.env.MONGODB_URI || '').includes('mongodb+srv://') || !!process.env.VERCEL;
    if (isCloud) {
      throw err;
    }

    console.log('[Database] Initializing MongoDB Memory Server for local fallback...');
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
    cached.conn = mongoose.connection;
    return cached.conn;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  cached.conn = null;
  cached.promise = null;
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB, sanitizeMongoUri };

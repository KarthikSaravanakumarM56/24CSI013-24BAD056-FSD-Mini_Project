const mongoose = require('mongoose');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

let mongoMemoryServer = null;
let isSeeded = false;

// Auto-sanitizes MongoDB URI: strips accidental quotes/brackets, URL-encodes special characters in password, and validates placeholders
const sanitizeMongoUri = (rawUri) => {
  if (!rawUri) return rawUri;
  // Clean whitespace and surrounding double/single quotes
  let clean = String(rawUri).trim().replace(/^["']|["']$/g, '');
  if (!clean.includes('://')) return clean;

  try {
    const schemeMatch = clean.match(/^([a-z0-9+]+:\/\/)(.*)$/i);
    if (!schemeMatch) return clean;
    const scheme = schemeMatch[1];
    const afterScheme = schemeMatch[2];

    const lastAtIndex = afterScheme.lastIndexOf('@');
    if (lastAtIndex === -1) return clean;

    const creds = afterScheme.substring(0, lastAtIndex);
    let hostAndRest = afterScheme.substring(lastAtIndex + 1);

    const colonIndex = creds.indexOf(':');
    if (colonIndex === -1) return clean;

    let user = creds.substring(0, colonIndex);
    let pass = creds.substring(colonIndex + 1);

    // Strip accidental < > brackets from username and password
    pass = pass.replace(/^<|>$/g, '').trim();
    user = user.replace(/^<|>$/g, '').trim();

    // Check for common documentation placeholders
    if (pass === 'password' || pass === 'db_password' || pass === '<db_password>' || pass === '<password>') {
      throw new Error("MONGODB_URI still contains placeholder '<db_password>'. Please replace it with your actual MongoDB Atlas database user password in Vercel environment variables.");
    }

    if (hostAndRest.toLowerCase().includes('cluster0.xxxxx') || hostAndRest.toLowerCase().includes('xxxxx.mongodb.net')) {
      throw new Error("MONGODB_URI contains placeholder cluster 'cluster0.xxxxx.mongodb.net'. Please replace it with your actual MongoDB Atlas cluster hostname.");
    }

    // Safely decode and re-encode to avoid unescaped characters error
    let decodedPass;
    try {
      decodedPass = decodeURIComponent(pass);
    } catch (e) {
      decodedPass = pass;
    }
    const encodedPass = encodeURIComponent(decodedPass);

    let decodedUser;
    try {
      decodedUser = decodeURIComponent(user);
    } catch (e) {
      decodedUser = user;
    }
    const encodedUser = encodeURIComponent(decodedUser);

    // Auto-inject database name if missing (e.g. mongodb+srv://...@cluster.mongodb.net/?...)
    if (hostAndRest.includes('.mongodb.net/?')) {
      hostAndRest = hostAndRest.replace('.mongodb.net/?', '.mongodb.net/skillbridge?');
    } else if (hostAndRest.endsWith('.mongodb.net/')) {
      hostAndRest = hostAndRest.replace(/\.mongodb\.net\/$/, '.mongodb.net/skillbridge');
    } else if (hostAndRest.endsWith('.mongodb.net')) {
      hostAndRest = `${hostAndRest}/skillbridge`;
    }

    return `${scheme}${encodedUser}:${encodedPass}@${hostAndRest}`;
  } catch (err) {
    if (err.message && err.message.includes('MONGODB_URI')) {
      throw err;
    }
    console.warn('[Database] URI sanitization fallback:', err.message);
    return clean;
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

const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  // If already connected, reuse connection (essential for serverless environments like Vercel)
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillbridge';
  
  try {
    // Attempt standard connection first with 3s timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] MongoDB Connected successfully to: ${uri}`);
  } catch (err) {
    console.warn(`[Database] Could not connect to local MongoDB (${err.message}).`);
    console.log(`[Database] Initializing MongoDB Memory Server for seamless local preview...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[Database] Connected to in-memory MongoDB at: ${memoryUri}`);
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

module.exports = { connectDB, disconnectDB };

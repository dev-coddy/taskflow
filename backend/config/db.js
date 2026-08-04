import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    let connUri = process.env.MONGODB_URI;

    if (!connUri || connUri.trim() === '' || connUri.includes('YOUR_MONGODB_URI')) {
      console.log('⚡ No MongoDB URI found in environment. Initializing in-memory MongoDB database for development...');
      mongoMemoryServer = await MongoMemoryServer.create();
      connUri = mongoMemoryServer.getUri();
    }

    const conn = await mongoose.connect(connUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // If external Atlas fails, fallback to MongoMemoryServer
    if (!mongoMemoryServer) {
      console.log('🔄 Attempting fallback to In-Memory MongoDB Server...');
      try {
        mongoMemoryServer = await MongoMemoryServer.create();
        const connUri = mongoMemoryServer.getUri();
        const conn = await mongoose.connect(connUri);
        console.log(`✅ MongoDB Connected (Fallback In-Memory): ${conn.connection.host}`);
        return;
      } catch (fallbackError) {
        console.error(`❌ Fallback MongoDB Connection Failed: ${fallbackError.message}`);
      }
    }
    process.exit(1);
  }
};

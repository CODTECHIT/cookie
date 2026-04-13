import mongoose from 'mongoose';
import logger from '../utils/logger.js';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
       const opts = {
          dbName: "daksha_food_db",
          bufferCommands: false,
          maxPoolSize: 10, // Optimized for M0 free tier
          minPoolSize: 1,
          serverSelectionTimeoutMS: 5000, 
          socketTimeoutMS: 45000,
          family: 4, // Use IPv4
          heartbeatFrequencyMS: 10000,
       };

       cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
          return mongoose;
       });
    }

    try {
       cached.conn = await cached.promise;
       
       // Alert if we lose connection
       mongoose.connection.on('error', err => logger.error('❌ MongoDB secondary error:', err));
       mongoose.connection.on('disconnected', () => logger.warn('⚠️ MongoDB disconnected. Re-connecting...'));
       
       logger.info(`✅ MongoDB Connected (${mongoose.connection.name})`);
    } catch (error) {
       cached.promise = null;
       logger.error(`❌ MongoDB Connection Error: ${error.message}`);
       throw error;
    }
    return cached.conn;
};

export default connectDB;

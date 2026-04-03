import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
   if (cached.conn) return cached.conn;

   if (!cached.promise) {
      cached.promise = mongoose.connect(process.env.MONGO_URI, {
         dbName: "daksha_food_db",
         bufferCommands: false,
         maxPoolSize: 1, // Crucial for serverless to prevent connection leaks
      }).then((mongoose) => {
         return mongoose;
      });
   }

   try {
      cached.conn = await cached.promise;
      console.log(`✅ MongoDB Connected`);
   } catch (error) {
      cached.promise = null;
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
      throw error;
   }
   return cached.conn;
};

export default connectDB;

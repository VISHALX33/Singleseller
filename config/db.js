/**
 * Database Configuration
 * Handles MongoDB Atlas connection using Mongoose
 */

import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas
 * Uses the MONGO_URI from environment variables
 * Returns a promise that resolves when connection is established
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;

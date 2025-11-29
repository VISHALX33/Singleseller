// MongoDB connection helper using Mongoose
// Handles initial connection and graceful error reporting.
const mongoose = require('mongoose');

async function connectDB(uri) {
  if (!uri) {
    throw new Error('Missing MongoDB connection string (MONGO_URI).');
  }
  try {
    const conn = await mongoose.connect(uri, {
      // Mongoose 8 uses modern defaults; options kept minimal.
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Exit process if initial connection fails
    process.exit(1);
  }
}

module.exports = connectDB;

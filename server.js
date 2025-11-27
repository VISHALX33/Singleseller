/**
 * Server Entry Point
 * Loads environment variables and starts the Express server
 */

// Load environment variables from config.env
import dotenv from 'dotenv';
dotenv.config({ path: './config/config.env' });

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

/**
 * Start Server
 * Connects to MongoDB and then starts listening on the specified port
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════╗
║   🚀 Single Seller Ecommerce API Server Running     ║
║   📍 Port: ${PORT}
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}
║   🗄️  Database: Connected
╚═══════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();

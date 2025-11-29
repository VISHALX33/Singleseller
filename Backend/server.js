// Main server entry point. Loads environment variables, connects database, starts HTTP server.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config', 'config.env') });
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');

(async () => {
  // Connect to MongoDB before starting server
  await connectDB(process.env.MONGO_URI);

  const PORT = process.env.PORT || 5000;
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Graceful shutdown handlers
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Promise Rejection:', reason);
    server.close(() => process.exit(1));
  });

  process.on('SIGINT', () => {
    console.log('Received SIGINT. Shutting down gracefully...');
    server.close(() => process.exit(0));
  });
})();

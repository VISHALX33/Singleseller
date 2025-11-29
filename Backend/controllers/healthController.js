// Health controller returns basic uptime and environment info.
exports.getHealth = (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
};

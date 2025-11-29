// File helper utilities for deleting product images safely.
const fs = require('fs');
const path = require('path');

function deleteFileIfExists(relativePath) {
  if (!relativePath) return;
  // Prevent directory traversal
  if (relativePath.includes('..')) return;
  const fullPath = path.join(__dirname, '..', relativePath.replace(/^\/+/, ''));
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
    } catch (err) {
      console.error('Failed to delete file:', fullPath, err.message);
    }
  }
}

module.exports = { deleteFileIfExists };

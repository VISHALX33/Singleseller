// Multer configuration for product image uploads.
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ApiError = require('../utils/ApiError');

const uploadDir = path.join(__dirname, '..', 'uploads', 'products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]/gi, '');
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, base + '-' + unique + ext);
  }
});

function fileFilter(req, file, cb) {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    return cb(new ApiError('Only image files (jpg, jpeg, png, webp) allowed', 400));
  }
  cb(null, true);
}

const limits = { fileSize: 5 * 1024 * 1024 }; // 5MB per image

const uploadSingle = multer({ storage, fileFilter, limits }).single('thumbnail');
const uploadMultiple = multer({ storage, fileFilter, limits }).array('images', 6); // limit to 6 additional images

module.exports = { uploadSingle, uploadMultiple };

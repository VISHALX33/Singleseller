/**
 * File Helper Utilities - Functions for file management
 * Handles file deletion, cleanup, and path operations
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Delete a file from the uploads directory
 * @param {string} filePath - Relative path from uploads (e.g., '/uploads/products/filename.jpg')
 * @returns {boolean} - True if deleted successfully, false otherwise
 */
export const deleteFile = (filePath) => {
  try {
    if (!filePath) return false;

    // Construct absolute file path
    // Handle both absolute paths and relative paths with /uploads prefix
    let absolutePath;
    if (filePath.startsWith('/uploads/')) {
      absolutePath = path.join(__dirname, '../', filePath);
    } else if (filePath.startsWith('uploads/')) {
      absolutePath = path.join(__dirname, '../', filePath);
    } else {
      absolutePath = path.join(__dirname, '../uploads', filePath);
    }

    // Check if file exists
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log(`File deleted: ${absolutePath}`);
      return true;
    }

    console.warn(`File not found: ${absolutePath}`);
    return false;
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`);
    return false;
  }
};

/**
 * Delete multiple files
 * @param {string[]} filePaths - Array of file paths
 * @returns {object} - Object with success count and failed files
 */
export const deleteFiles = (filePaths) => {
  const result = {
    deleted: 0,
    failed: [],
  };

  if (!Array.isArray(filePaths)) {
    return result;
  }

  filePaths.forEach(filePath => {
    if (deleteFile(filePath)) {
      result.deleted++;
    } else {
      result.failed.push(filePath);
    }
  });

  return result;
};

/**
 * Get file extension
 * @param {string} filename - File name
 * @returns {string} - File extension (e.g., '.jpg')
 */
export const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

/**
 * Get file name without extension
 * @param {string} filename - File name
 * @returns {string} - File name without extension
 */
export const getFileBaseName = (filename) => {
  return path.basename(filename, path.extname(filename));
};

/**
 * Check if file exists
 * @param {string} filePath - Relative file path
 * @returns {boolean} - True if file exists
 */
export const fileExists = (filePath) => {
  try {
    let absolutePath;
    if (filePath.startsWith('/uploads/')) {
      absolutePath = path.join(__dirname, '../', filePath);
    } else if (filePath.startsWith('uploads/')) {
      absolutePath = path.join(__dirname, '../', filePath);
    } else {
      absolutePath = path.join(__dirname, '../uploads', filePath);
    }

    return fs.existsSync(absolutePath);
  } catch (error) {
    console.error(`Error checking file: ${error.message}`);
    return false;
  }
};

/**
 * Clean up old files from a directory
 * @param {string} directoryPath - Directory path relative to project root
 * @param {number} maxAgeInHours - Delete files older than this many hours
 * @returns {object} - Object with count of deleted files
 */
export const cleanupOldFiles = (directoryPath, maxAgeInHours = 24) => {
  try {
    const absolutePath = path.join(__dirname, '../', directoryPath);

    if (!fs.existsSync(absolutePath)) {
      return { deleted: 0, error: 'Directory not found' };
    }

    const now = Date.now();
    const maxAge = maxAgeInHours * 60 * 60 * 1000;
    let deletedCount = 0;

    const files = fs.readdirSync(absolutePath);

    files.forEach(file => {
      const filePath = path.join(absolutePath, file);
      const stats = fs.statSync(filePath);

      if (now - stats.mtimeMs > maxAge) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    });

    return { deleted: deletedCount };
  } catch (error) {
    console.error(`Error cleaning up files: ${error.message}`);
    return { deleted: 0, error: error.message };
  }
};

/**
 * Get file size in bytes
 * @param {string} filePath - File path
 * @returns {number} - File size in bytes, -1 if error
 */
export const getFileSize = (filePath) => {
  try {
    let absolutePath;
    if (filePath.startsWith('/uploads/')) {
      absolutePath = path.join(__dirname, '../', filePath);
    } else if (filePath.startsWith('uploads/')) {
      absolutePath = path.join(__dirname, '../', filePath);
    } else {
      absolutePath = path.join(__dirname, '../uploads', filePath);
    }

    const stats = fs.statSync(absolutePath);
    return stats.size;
  } catch (error) {
    console.error(`Error getting file size: ${error.message}`);
    return -1;
  }
};

/**
 * Format file size to human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size (e.g., '2.5 MB')
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Ensure directory exists, create if not
 * @param {string} directoryPath - Directory path
 * @returns {boolean} - True if directory exists or was created
 */
export const ensureDirectoryExists = (directoryPath) => {
  try {
    let absolutePath;
    if (directoryPath.startsWith('/')) {
      absolutePath = path.join(__dirname, '../', directoryPath);
    } else {
      absolutePath = path.join(__dirname, '../', directoryPath);
    }

    if (!fs.existsSync(absolutePath)) {
      fs.mkdirSync(absolutePath, { recursive: true });
    }

    return true;
  } catch (error) {
    console.error(`Error ensuring directory: ${error.message}`);
    return false;
  }
};

export default {
  deleteFile,
  deleteFiles,
  getFileExtension,
  getFileBaseName,
  fileExists,
  cleanupOldFiles,
  getFileSize,
  formatFileSize,
  ensureDirectoryExists,
};

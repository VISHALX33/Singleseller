# 🚀 DEVELOPMENT GUIDE - Single Seller Ecommerce Backend

## Welcome to Your Express Backend!

This guide will help you understand the structure and get started with development.

---

## 📖 Table of Contents

1. [Project Overview](#project-overview)
2. [Getting Started](#getting-started)
3. [File Structure Explanation](#file-structure-explanation)
4. [Common Development Tasks](#common-development-tasks)
5. [Adding New Features](#adding-new-features)
6. [Troubleshooting](#troubleshooting)

---

## Project Overview

### What You Have
- ✅ Express.js web server (Port 5000)
- ✅ MongoDB Atlas integration ready
- ✅ JWT authentication system
- ✅ File upload handling
- ✅ Global error handling
- ✅ Input validation
- ✅ Complete middleware stack

### Architecture
```
Client (Frontend)
       ↓ (API Requests)
    Routes (routes/)
       ↓
  Controllers (controllers/)
       ↓
  Services (services/)
       ↓
   Models (models/)
       ↓
  MongoDB Database
```

---

## Getting Started

### 1. Install & Run
```bash
# Navigate to project
cd Singleseller

# All dependencies already installed via npm install

# Update config/config.env with your MongoDB URI

# Start server
npm start

# You should see:
# 🚀 Single Seller Ecommerce API Server Running
# 📍 Port: 5000
```

### 2. Test the API
```bash
# In another terminal
curl http://localhost:5000/api/health

# Expected response:
# {"success":true,"message":"API is running","timestamp":"2024-11-27T..."}
```

### 3. View Welcome Page
```
http://localhost:5000
```

---

## File Structure Explanation

### Root Level Files

#### `server.js` - Entry Point
```javascript
// What it does:
// 1. Loads environment variables from config.env
// 2. Imports app.js
// 3. Connects to MongoDB
// 4. Starts Express server on port 5000
// 5. Handles unhandled errors

// NEVER modify the MongoDB connection logic without good reason
```

#### `app.js` - Express Configuration
```javascript
// What it does:
// 1. Creates Express application
// 2. Sets up middleware (CORS, JSON parsing, static files)
// 3. Defines API routes
// 4. Implements error handling

// Add new middlewares here if needed
// Add new route imports here
```

#### `package.json` - Dependencies
```javascript
// Contains:
// - Project metadata
// - All installed packages
// - npm scripts (start, dev)

// To add new package:
// npm install package-name
// Then require it where needed
```

### config/ - Configuration

#### `config.env` - Environment Variables
```env
# Database connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/singleseller

# Authentication
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development
```

⚠️ **Never commit config.env to git!** It's in .gitignore for security.

#### `config/db.js` - Database Connection
```javascript
// connectDB()
// - Connects to MongoDB
// - Returns connection promise
// - Handles connection errors

// Used by server.js during startup
```

### middlewares/ - Express Middlewares

#### `errorHandler.js` - Error Management
```javascript
// errorConverter - Converts errors to ApiError format
// errorHandler - Sends error response to client

// Automatically catches and formats errors
// Development mode: Shows full stack trace
// Production mode: Hides sensitive info
```

#### `auth.js` - Authentication
```javascript
// authenticate - Verifies JWT token
// authorize - Checks user role/permissions

// Usage: router.get('/admin', authenticate, authorize('admin'), handler)
```

#### `validation.js` - Input Validation
```javascript
// validateEmail, validatePassword, etc.
// handleValidationErrors - Processes validation results

// Usage: router.post('/register', validateEmail, validatePassword, handler)
```

#### `asyncHandler.js` - Error Wrapper
```javascript
// Wraps async route handlers
// Catches errors automatically
// Passes them to error handler

// Usage: const handler = asyncHandler(async (req, res) => {...})
```

### models/ - Database Schemas

#### `User.js` - User Schema
```javascript
Fields:
- name, email, password
- role (seller/admin)
- phone, avatar
- isActive, verifiedEmail
- timestamps (createdAt, updatedAt)

Methods:
- comparePassword(enteredPassword) - Check password hash
```

#### `Product.js` - Product Schema
```javascript
Fields:
- name, description, price
- stock, category
- images, rating
- reviews array
- timestamps
```

#### `Order.js` - Order Schema
```javascript
Fields:
- user reference
- items array (products)
- totalAmount
- status, paymentStatus
- shippingAddress
- timestamps
```

### controllers/ - Business Logic

#### `exampleController.js` - Template
```javascript
// Pattern to follow:
// 1. Use asyncHandler wrapper
// 2. Get data from request
// 3. Validate input
// 4. Call service/model
// 5. Handle errors
// 6. Return response

// Example:
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, data: user });
});
```

### services/ - Reusable Business Logic

#### `tokenService.js` - Token Management
```javascript
generateToken(payload, secret, expiresIn)
- Creates JWT token

verifyToken(token, secret)
- Verifies and decodes token

// Usage:
const token = generateToken({ id: userId, role: 'seller' });
```

### utils/ - Utilities

#### `ApiError.js` - Custom Error Class
```javascript
throw new ApiError(statusCode, message, isOperational);

// Examples:
throw new ApiError(400, 'Invalid email');
throw new ApiError(401, 'Unauthorized');
throw new ApiError(404, 'Not found');
throw new ApiError(500, 'Server error');
```

#### `helpers.js` - Common Functions
```javascript
- formatPrice(price)
- isValidEmail(email)
- getPagination(page, limit)
- generateRandomString(length)
```

#### `multerConfig.js` - File Upload
```javascript
const upload = require('./utils/multerConfig');

// Single file:
router.post('/upload', upload.single('image'), handler);

// Multiple files:
router.post('/upload-many', upload.array('images', 5), handler);
```

---

## Common Development Tasks

### Task 1: Create a New Route

#### Step 1: Create Controller
```javascript
// controllers/productController.js
const asyncHandler = require('../middlewares/asyncHandler');
const ApiError = require('../utils/ApiError');
const Product = require('../models/Product');

exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true });
  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  
  res.status(200).json({
    success: true,
    data: product,
  });
});
```

#### Step 2: Create Routes
```javascript
// routes/products.js
const express = require('express');
const { 
  getAllProducts, 
  getProductById 
} = require('../controllers/productController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);

module.exports = router;
```

#### Step 3: Import in app.js
```javascript
// app.js
const productRoutes = require('./routes/products');

app.use('/api/products', productRoutes);
```

### Task 2: Add Authentication to Route

```javascript
// Protect route - requires login
router.post('/order',
  authenticate,  // Must be logged in
  createOrder
);

// Protect by role - only admins
router.delete('/admin/products/:id',
  authenticate,
  authorize('admin'),  // Must be admin
  deleteProduct
);
```

### Task 3: Add Input Validation

```javascript
const { body, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../middlewares/validation');

router.post('/products',
  authenticate,
  authorize('seller'),
  body('name').notEmpty().withMessage('Name required'),
  body('price').isNumeric().withMessage('Price must be number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be positive'),
  handleValidationErrors,
  createProduct
);
```

### Task 4: Add File Upload

```javascript
const upload = require('../utils/multerConfig');

router.post('/products/upload-image',
  authenticate,
  authorize('seller'),
  upload.single('image'),  // Single image
  uploadProductImage
);

// Handler:
const uploadProductImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No image provided');
  }
  
  res.json({
    success: true,
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  });
});
```

### Task 5: Handle Errors

```javascript
const asyncHandler = require('../middlewares/asyncHandler');
const ApiError = require('../utils/ApiError');

const myHandler = asyncHandler(async (req, res) => {
  // Validation
  if (!req.body.name) {
    throw new ApiError(400, 'Name is required');
  }
  
  // Not found
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  
  // Unauthorized
  if (user.id !== req.user.id) {
    throw new ApiError(403, 'Not authorized');
  }
  
  // Success response
  res.json({
    success: true,
    data: user,
  });
  
  // Error caught automatically by errorHandler middleware
});
```

---

## Adding New Features

### Feature: User Authentication

```javascript
// controllers/authController.js
const User = require('../models/User');
const { generateToken } = require('../services/tokenService');
const ApiError = require('../utils/ApiError');

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if user exists
  let user = await User.findOne({ email });
  if (user) throw new ApiError(400, 'User already exists');
  
  // Create new user
  user = new User({ name, email, password, role: 'seller' });
  await user.save();
  
  // Generate token
  const token = generateToken({ id: user._id, role: user.role });
  
  res.status(201).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Find user and include password
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid credentials');
  
  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, 'Invalid credentials');
  
  // Generate token
  const token = generateToken({ id: user._id, role: user.role });
  
  res.json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
});
```

---

## Troubleshooting

### Issue: MongoDB Connection Failed
```
Error: MONGO_URI is not defined in environment variables
```
**Solution:** Edit config/config.env and add your MongoDB Atlas URI

### Issue: Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** 
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process or change port in config.env
```

### Issue: JWT Token Invalid
```
Error: Invalid token
```
**Solution:** 
- Check JWT_SECRET in config.env
- Verify token format: `Bearer <token>`
- Check token hasn't expired

### Issue: CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Verify CORS is enabled in app.js:
```javascript
app.use(cors({ origin: '*', credentials: true }));
```

### Issue: Multer - File Not Uploading
```
Error: File upload failed
```
**Solution:**
- Create `uploads/` folder
- Check file size (max 5MB)
- Check file type (images only)
- Verify write permissions

---

## Development Best Practices

### 1. Always Use asyncHandler
```javascript
// ✅ Good
const handler = asyncHandler(async (req, res) => {
  throw new Error('Something went wrong');
});

// ❌ Bad - error not caught
const handler = async (req, res) => {
  throw new Error('Something went wrong');
};
```

### 2. Use ApiError for Custom Errors
```javascript
// ✅ Good
throw new ApiError(404, 'User not found');

// ❌ Bad - generic Error
throw new Error('User not found');
```

### 3. Validate Input First
```javascript
// ✅ Good - validate before processing
if (!req.body.email) {
  throw new ApiError(400, 'Email required');
}

// ❌ Bad - process then fail
const user = User.findOne({ email: req.body.email });
```

### 4. Use Middleware for Cross-Cutting Concerns
```javascript
// ✅ Good - use middleware
router.get('/protected', authenticate, handler);

// ❌ Bad - duplicate auth check
const handler = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  // ... repeat in every handler
};
```

### 5. Separate Business Logic from Routes
```javascript
// ✅ Good - use services
const user = await userService.getUserById(id);

// ❌ Bad - logic in routes
router.get('/:id', async (req, res) => {
  const user = await User.findById(id);
  const posts = await Post.find({ userId: user.id });
  // ... too much logic
});
```

---

## Quick Reference

### Common HTTP Status Codes
- `200` - OK (Success)
- `201` - Created (Resource created)
- `400` - Bad Request (Invalid input)
- `401` - Unauthorized (Not authenticated)
- `403` - Forbidden (No permission)
- `404` - Not Found (Resource doesn't exist)
- `409` - Conflict (Duplicate)
- `500` - Server Error

### Response Format
```javascript
// Success response
{
  "success": true,
  "data": { /* your data */ },
  "message": "Operation successful"
}

// Error response
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid input"
}
```

### Environment Variables
```env
PORT=5000                     # Server port
NODE_ENV=development          # Environment
MONGO_URI=mongodb+srv://...   # Database URL
JWT_SECRET=your_secret_key    # Token secret
JWT_EXPIRE=7d                 # Token expiration
```

---

## 🎯 Next Development Steps

1. **User Module**
   - ✅ User model exists
   - Create auth routes
   - Implement registration/login
   - Add profile management

2. **Product Module**
   - ✅ Product model exists
   - Create product routes
   - Implement CRUD operations
   - Add image upload

3. **Order Module**
   - ✅ Order model exists
   - Create order routes
   - Track order status
   - Add payment integration

4. **Advanced Features**
   - Search and filtering
   - Pagination
   - Reviews and ratings
   - Cart management
   - Notifications

---

## 📚 Resources

- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)
- [JWT Authentication](https://jwt.io/introduction)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [REST API Best Practices](https://restfulapi.net/)

---

**Happy Development! 🚀**

Keep the code clean, test frequently, and commit often!

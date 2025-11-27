# Authentication System - Code Structure Overview

## Directory Structure

```
singleseller/
│
├── controllers/
│   ├── authController.js          ✅ NEW - 6 auth methods
│   └── exampleController.js
│
├── middlewares/
│   ├── auth.js                    ✅ UPDATED - 2 auth functions
│   ├── asyncHandler.js            ✅ UPDATED - Error wrapper
│   ├── errorHandler.js            ✅ UPDATED - Global error handler
│   ├── validation.js
│   └── validation/
│       └── authValidation.js      ✅ NEW - 4 validation sets
│
├── routes/
│   ├── authRoutes.js              ✅ NEW - 6 endpoints
│   ├── exampleRoutes.js
│   └── (other routes)
│
├── models/
│   ├── User.js                    (has auth methods)
│   ├── Product.js
│   ├── Order.js
│   ├── Cart.js
│   ├── Category.js
│   └── index.js                   ✅ NEW - model exports
│
├── utils/
│   ├── ApiError.js                ✅ UPDATED - ES6 export
│   ├── helpers.js
│   └── multerConfig.js
│
├── config/
│   ├── db.js                      ✅ UPDATED - ES6 import
│   └── config.env
│
├── app.js                         ✅ UPDATED - auth routes added
├── server.js                      ✅ UPDATED - ES6 modules
├── package.json
│
├── AUTHENTICATION_GUIDE.md        ✅ NEW
├── AUTHENTICATION_TESTING.md      ✅ NEW
├── AUTHENTICATION_SETUP_COMPLETE.md ✅ NEW
├── AUTHENTICATION_COMPLETE_SUMMARY.txt ✅ NEW
└── AUTHENTICATION_VISUAL_SUMMARY.txt ✅ NEW
```

## Code Components Detail

### 1. Auth Controller (`controllers/authController.js`)

```javascript
// 6 Main Methods:

export const register = asyncHandler(async (req, res) => {
  // 1. Validate input
  // 2. Check email uniqueness
  // 3. Create user (password hashed by pre-save hook)
  // 4. Generate JWT token
  // 5. Return user + token
});

export const login = asyncHandler(async (req, res) => {
  // 1. Validate input
  // 2. Find user by email
  // 3. Compare password (bcrypt)
  // 4. Generate JWT token
  // 5. Return user + token
});

export const logout = asyncHandler(async (req, res) => {
  // Client-side token removal notification
});

export const getProfile = asyncHandler(async (req, res) => {
  // 1. Get user from req.user.id (set by verifyToken)
  // 2. Return full user profile
});

export const updateProfile = asyncHandler(async (req, res) => {
  // 1. Get user by ID
  // 2. Update name, phone, avatar
  // 3. Save changes
  // 4. Return updated user
});

export const changePassword = asyncHandler(async (req, res) => {
  // 1. Get user by ID
  // 2. Verify old password
  // 3. Update to new password
  // 4. Save (pre-save hook hashes)
});
```

### 2. Auth Middleware (`middlewares/auth.js`)

```javascript
// Middleware 1: verifyToken
export const verifyToken = asyncHandler(async (req, res, next) => {
  // 1. Extract token from Authorization header (Bearer prefix)
  // 2. Verify JWT signature
  // 3. Attach decoded data to req.user
  // 4. Handle token expiration & invalid token errors
  // 5. Call next() if valid
});

// Middleware 2: isAdmin
export const isAdmin = asyncHandler(async (req, res, next) => {
  // 1. Check if req.user exists (requires verifyToken first)
  // 2. Check if req.user.role === 'admin'
  // 3. Return 403 Forbidden if not admin
  // 4. Call next() if admin
});
```

### 3. Auth Validation (`middlewares/validation/authValidation.js`)

```javascript
// Using express-validator:

// Set 1: validateRegister
// - name: trim, required, 2-50 chars, letters/spaces only
// - email: trim, required, valid format, normalized
// - password: required, 6+ chars, strong (uppercase, lowercase, number, special)
// - phone: optional, 10-digit Indian format

// Set 2: validateLogin
// - email: trim, required, valid format
// - password: required, 6+ chars

// Set 3: validateUpdateProfile
// - name: optional, 2-50 chars, letters/spaces
// - phone: optional, 10-digit Indian format
// - avatar: optional, valid URL

// Set 4: validateChangePassword
// - oldPassword: required, 6+ chars
// - newPassword: required, 6+ chars, strong requirements
// - confirmPassword: required, matches newPassword
```

### 4. Auth Routes (`routes/authRoutes.js`)

```javascript
// PUBLIC Routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/logout', authController.logout);

// PROTECTED Routes (require verifyToken middleware)
router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, validateUpdateProfile, authController.updateProfile);
router.put('/change-password', verifyToken, validateChangePassword, authController.changePassword);
```

### 5. App Integration (`app.js`)

```javascript
// ES6 imports
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

// Middleware setup
app.use(cors());
app.use(express.json());

// Auth routes registration
app.use('/api/auth', authRoutes);

// Error handling
app.use(errorConverter);
app.use(errorHandler);
```

### 6. User Model - Auth Methods

```javascript
// Pre-save hook
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  // Hash password with bcryptjs
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Instance method: Compare password
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Instance method: Generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};
```

## Data Flow

### Registration Flow
```
POST /api/auth/register
  ↓
validateRegister middleware (validates input)
  ↓
authController.register()
  • Check email uniqueness
  • Create User document
  • Pre-save hook hashes password
  • Generate JWT token
  ↓
Return: { success: true, user, token }
```

### Login Flow
```
POST /api/auth/login
  ↓
validateLogin middleware (validates input)
  ↓
authController.login()
  • Find user by email
  • Compare password (bcrypt)
  • Generate JWT token
  ↓
Return: { success: true, user, token }
```

### Protected Route Flow
```
GET /api/auth/profile
Header: Authorization: Bearer <token>
  ↓
verifyToken middleware
  • Extract token from header
  • Verify JWT signature
  • Attach req.user = { id, email, role }
  ↓
authController.getProfile()
  • Access req.user.id
  • Fetch user from database
  ↓
Return: { success: true, user }
```

## Error Handling Flow

```
Any error in route/controller
  ↓
If inside asyncHandler:
  • Catch promise rejection
  • Pass to next(error)
  ↓
errorConverter middleware
  • Convert to ApiError if needed
  • Pass to next(error)
  ↓
errorHandler middleware
  • Log error
  • Return proper HTTP status
  • Send JSON response to client
```

## Security Implementation

### Password Flow
```
User Input: "TestPass123!"
  ↓
Validation: Strength check (uppercase, lowercase, number, special char)
  ↓
User saved: Password hashing (bcryptjs, 10 salt rounds)
  ↓
Database: Stored as bcrypt hash (never plain text)
  ↓
Login: Compare input with hash using bcrypt.compare()
  ↓
Response: No password returned ever
```

### JWT Flow
```
Credentials verified
  ↓
Generate JWT:
  • Payload: { id, email, role }
  • Algorithm: HS256
  • Secret: JWT_SECRET from env
  • Expiration: 7 days
  ↓
Return token to client
  ↓
Client: Store in localStorage/sessionStorage
  ↓
Client: Send in Authorization header for protected routes
  ↓
Backend: Verify signature using JWT_SECRET
  ↓
Backend: Attach decoded data to req.user
```

## Environment Variables Needed

```env
# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/database

# JWT Secret (min 32 characters for security)
JWT_SECRET=your_secret_key_minimum_32_characters_long

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

## Testing Scenarios

### Test 1: Happy Path Registration
```
Input: Valid name, email, strong password, phone
Expected: 201 Created, user + token returned
```

### Test 2: Happy Path Login
```
Input: Valid email, correct password
Expected: 200 OK, user + token returned
```

### Test 3: Protected Route Access
```
Input: Valid JWT token in header
Expected: 200 OK, user profile returned
```

### Test 4: Weak Password
```
Input: Password without uppercase/lowercase/number/special
Expected: 400 Bad Request, validation error
```

### Test 5: Duplicate Email
```
Input: Email already registered
Expected: 409 Conflict, "Email already registered"
```

### Test 6: Invalid Token
```
Input: Invalid or expired JWT
Expected: 401 Unauthorized, "Invalid token"
```

### Test 7: Admin Check
```
Input: Token with role: 'customer' on admin route
Expected: 403 Forbidden, "Admin access required"
```

## Integration Checklist

- [x] Auth controller created with all 6 methods
- [x] Auth middleware created (verifyToken, isAdmin)
- [x] Input validation rules created
- [x] Auth routes created with endpoints
- [x] App.js updated with auth routes
- [x] All files converted to ES6 modules
- [x] Error handling implemented
- [x] Documentation created
- [x] Testing guide created
- [x] Security best practices applied

## Next Steps After Auth

1. **Product Management**
   - Create ProductController
   - Create ProductRoutes
   - Implement CRUD operations

2. **Shopping Cart**
   - Create CartController
   - Create CartRoutes
   - Implement cart operations

3. **Orders**
   - Create OrderController
   - Create OrderRoutes
   - Implement order management

4. **Admin Dashboard**
   - Create AdminController
   - Create AdminRoutes
   - Protect with isAdmin middleware

5. **Payments**
   - Integrate Razorpay/Stripe
   - Create PaymentController
   - Handle payment verification

---

## Quick Reference

### Import Auth Components
```javascript
import { verifyToken, isAdmin } from '../middlewares/auth.js';
import { validateRegister, validateLogin } from '../middlewares/validation/authValidation.js';
import * as authController from '../controllers/authController.js';
```

### Use Auth Middleware
```javascript
// Protect route
router.get('/data', verifyToken, controller.getData);

// Admin-only route
router.delete('/admin', verifyToken, isAdmin, controller.adminAction);
```

### Access User in Controller
```javascript
export const myController = asyncHandler(async (req, res) => {
  // req.user contains: { id, email, role }
  const userId = req.user.id;
  const userRole = req.user.role;
});
```

---

**All authentication system components are interconnected and ready for production use!**

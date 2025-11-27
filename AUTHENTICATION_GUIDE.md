# Authentication System Documentation

Complete JWT-based authentication system for the SingleSeller ecommerce platform.

## Overview

The authentication system provides:
- User registration with email validation and strong password requirements
- Secure login with JWT token generation
- Protected routes using JWT verification
- User profile management
- Password change functionality
- Role-based access control (Admin/Customer)

## Architecture

### Components

1. **Auth Controller** (`controllers/authController.js`)
   - Handles all authentication business logic
   - Manages user registration, login, profile operations
   - Implements comprehensive error handling

2. **Auth Middleware** (`middlewares/auth.js`)
   - `verifyToken`: Validates JWT and attaches user to request
   - `isAdmin`: Checks if user has admin role

3. **Auth Validation** (`middlewares/validation/authValidation.js`)
   - Input validation using express-validator
   - Strong password requirements
   - Email format validation
   - Phone number validation (Indian format)

4. **Auth Routes** (`routes/authRoutes.js`)
   - Public endpoints: register, login, logout
   - Protected endpoints: profile, update profile, change password

## API Endpoints

### Public Endpoints

#### 1. Register User
```
POST /api/auth/register
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "9876543210"  // optional
}

Response (201):
{
  "success": true,
  "message": "Registration successful. Welcome to SingleSeller!",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "customer",
      "avatar": null,
      "createdAt": "2025-11-27T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation Rules:**
- Name: 2-50 characters, letters and spaces only
- Email: Valid email format
- Password: Min 6 chars, contains uppercase, lowercase, number, special char (@$!%*?&)
- Phone: Optional, 10-digit Indian format (6-9 start)

**Error Responses:**
- 400: Validation failed
- 409: Email already registered

---

#### 2. Login User
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response (200):
{
  "success": true,
  "message": "Login successful. Welcome back!",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "customer",
      "avatar": null,
      "createdAt": "2025-11-27T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- 400: Validation failed
- 401: Invalid email or password

---

#### 3. Logout User
```
POST /api/auth/logout

Response (200):
{
  "success": true,
  "message": "Logout successful. Please remove token from client storage."
}
```

---

### Protected Endpoints

**Authorization Header Required:**
```
Authorization: Bearer <jwt_token>
```

#### 4. Get User Profile
```
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response (200):
{
  "success": true,
  "message": "Profile retrieved successfully.",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "customer",
      "avatar": "https://example.com/avatar.jpg",
      "addresses": [
        {
          "_id": "address_id",
          "street": "123 Main Street",
          "city": "Mumbai",
          "state": "Maharashtra",
          "pincode": "400001",
          "isDefault": true,
          "createdAt": "2025-11-27T10:30:00Z"
        }
      ],
      "isEmailVerified": false,
      "createdAt": "2025-11-27T10:30:00Z",
      "updatedAt": "2025-11-27T10:30:00Z"
    }
  }
}
```

**Error Responses:**
- 401: Token expired or invalid
- 404: User not found

---

#### 5. Update User Profile
```
PUT /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

Body:
{
  "name": "John Updated",
  "phone": "9876543210",
  "avatar": "https://example.com/new-avatar.jpg"
}

Response (200):
{
  "success": true,
  "message": "Profile updated successfully.",
  "data": {
    "user": { ... }
  }
}
```

**Validation Rules:**
- Name: 2-50 characters, letters and spaces only
- Phone: 10-digit Indian format (6-9 start)
- Avatar: Valid URL

**Error Responses:**
- 400: Validation failed
- 401: Token expired or invalid
- 404: User not found

---

#### 6. Change Password
```
PUT /api/auth/change-password
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

Body:
{
  "oldPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!",
  "confirmPassword": "NewSecurePass456!"
}

Response (200):
{
  "success": true,
  "message": "Password changed successfully. Please login with your new password."
}
```

**Validation Rules:**
- Old Password: Required
- New Password: Min 6 chars, uppercase, lowercase, number, special char
- Confirm Password: Must match new password
- New password must be different from old password

**Error Responses:**
- 400: Validation failed, passwords don't match
- 401: Current password is incorrect, token expired
- 404: User not found

---

## JWT Token Details

### Token Structure
```
Header: { "alg": "HS256", "typ": "JWT" }
Payload: {
  "id": "user_id",
  "email": "user@example.com",
  "role": "customer",
  "iat": 1732683000,
  "exp": 1733287800
}
Signature: HS256 signed with JWT_SECRET
```

### Token Expiration
- Default: 7 days (604800 seconds)
- Configurable via User model generateAuthToken method

### Using the Token
```javascript
// In request headers
fetch('/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

// In axios
axios.get('/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

---

## Security Features

### Password Security
- ✅ Bcrypt hashing with 10 salt rounds
- ✅ Strong password requirements (uppercase, lowercase, number, special char)
- ✅ Passwords never returned in API responses
- ✅ Old password verification before change

### Token Security
- ✅ JWT signed with environment variable JWT_SECRET
- ✅ Token expiration (7 days)
- ✅ Bearer token required in Authorization header
- ✅ Token validation on protected routes

### Data Protection
- ✅ Input validation on all endpoints
- ✅ Email normalization (lowercase)
- ✅ Duplicate email prevention
- ✅ Role-based access control (isAdmin middleware)

### Error Handling
- ✅ Comprehensive error messages
- ✅ Proper HTTP status codes
- ✅ Stack traces in development mode
- ✅ No sensitive info leakage in production

---

## Middleware Usage

### Protecting Routes
```javascript
import { verifyToken, isAdmin } from '../middlewares/auth.js';

// Protect route - requires valid JWT
router.get('/user-data', verifyToken, controller.getUserData);

// Admin-only route
router.delete('/admin/users/:id', verifyToken, isAdmin, controller.deleteUser);
```

### Error Handling
```javascript
import asyncHandler from '../middlewares/asyncHandler.js';

export const myController = asyncHandler(async (req, res) => {
  // Errors automatically caught and passed to error handler
  throw new ApiError(400, 'Custom error message');
});
```

---

## Environment Variables

Required in `.env` file:

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_characters

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

---

## Testing Authentication

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "phone": "9876543210"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'

# Get Profile (replace token with actual JWT)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Using Postman

1. Import the collection from `testingAPI/postmanCollection.js`
2. Set variables:
   - `base_url`: http://localhost:5000
   - `token`: (auto-set after login)
3. Test endpoints in order: register → login → profile → update → change-password

---

## Password Requirements

Passwords must contain:
- ✅ Minimum 6 characters, maximum 50
- ✅ At least 1 uppercase letter (A-Z)
- ✅ At least 1 lowercase letter (a-z)
- ✅ At least 1 number (0-9)
- ✅ At least 1 special character (@$!%*?&)

**Examples of valid passwords:**
- `SecurePass123!`
- `MyPass@2025`
- `StrongPwd#456`

**Examples of invalid passwords:**
- `password123` (no uppercase, no special char)
- `Pass12` (no special char, min length met but weak)
- `PASSWORD123!` (no lowercase)

---

## Error Codes Reference

| Status | Code | Meaning |
|--------|------|---------|
| 200 | OK | Successful request |
| 201 | Created | User registered successfully |
| 400 | Bad Request | Validation failed or invalid input |
| 401 | Unauthorized | Invalid credentials or token |
| 403 | Forbidden | Insufficient permissions (admin required) |
| 404 | Not Found | User not found |
| 409 | Conflict | Email already registered |
| 500 | Server Error | Internal server error |

---

## Integration Examples

### Frontend (React/Vue)
```javascript
// Store token in localStorage after login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const data = await response.json();
localStorage.setItem('token', data.data.token);

// Use token in subsequent requests
const profileResponse = await fetch('/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

### Backend (Node.js/Express)
```javascript
import { verifyToken } from './middlewares/auth.js';

// Protected route
router.get('/admin/users', verifyToken, isAdmin, (req, res) => {
  // req.user contains: { id, email, role }
  console.log(req.user); // { id: '...', email: '...', role: 'customer' }
});
```

---

## Best Practices

1. **Token Storage**
   - Client: Store in localStorage or sessionStorage
   - Server: Never store passwords
   - Don't expose token in URLs

2. **HTTPS/TLS**
   - Always use HTTPS in production
   - Tokens are sensitive data

3. **Token Refresh**
   - Implement token refresh logic if needed
   - Current: Simple 7-day expiration

4. **Admin Management**
   - Manually set role to 'admin' in database
   - Use isAdmin middleware for admin routes

5. **Password Reset**
   - Consider adding password reset via email
   - Use unique tokens with expiration

---

## Troubleshooting

### Token Validation Fails
- ✓ Check Authorization header format: `Bearer <token>`
- ✓ Verify JWT_SECRET matches between generation and validation
- ✓ Check token expiration date

### Login Always Fails
- ✓ Verify password contains uppercase, lowercase, number, special char
- ✓ Check email is lowercase in database
- ✓ Ensure user exists in database

### CORS Errors
- ✓ Set CORS_ORIGIN in .env file
- ✓ Check frontend URL matches CORS_ORIGIN
- ✓ Include credentials in fetch if needed

### Password Change Fails
- ✓ Verify old password is correct
- ✓ New password must be different from old
- ✓ New password must meet strength requirements

---

## Next Steps

After authentication setup:
1. Build product management endpoints
2. Implement shopping cart functionality
3. Create order management system
4. Add payment integration
5. Implement admin dashboard
6. Add email notifications
7. Set up password reset flow
8. Implement JWT refresh token strategy

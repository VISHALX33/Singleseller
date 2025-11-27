# AUTHENTICATION QUICK REFERENCE CARD

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start server
npm run dev          # Development
npm start           # Production
```

---

## 🔑 API Endpoints Cheat Sheet

### Public Endpoints

```bash
# Register
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "9876543210"
}

# Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

# Logout
POST /api/auth/logout
```

### Protected Endpoints (Add Header: `Authorization: Bearer <token>`)

```bash
# Get Profile
GET /api/auth/profile

# Update Profile
PUT /api/auth/profile
{
  "name": "Updated Name",
  "phone": "9876543211",
  "avatar": "https://example.com/avatar.jpg"
}

# Change Password
PUT /api/auth/change-password
{
  "oldPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!",
  "confirmPassword": "NewSecurePass456!"
}
```

---

## 📋 Validation Rules

| Field | Rules | Valid Example | Invalid |
|-------|-------|---|---|
| name | 2-50 chars, letters/spaces | "John Doe" | "J", "John123" |
| email | Valid format | "user@example.com" | "invalid-email" |
| password | 6+ chars, strong | "SecurePass123!" | "pass123" |
| phone | 10-digit, starts 6-9 | "9876543210" | "123456789" |

### Password Strength Requirements
- ✅ Minimum 6 characters
- ✅ At least 1 uppercase letter (A-Z)
- ✅ At least 1 lowercase letter (a-z)
- ✅ At least 1 number (0-9)
- ✅ At least 1 special character (@$!%*?&)

---

## 🔐 HTTP Status Codes

| Status | Meaning | When |
|--------|---------|------|
| 200 | Success | Login, profile retrieval |
| 201 | Created | Successful registration |
| 400 | Bad Request | Validation failed |
| 401 | Unauthorized | Invalid credentials, expired token |
| 403 | Forbidden | Admin access required |
| 404 | Not Found | User not found |
| 409 | Conflict | Email already registered |

---

## 🛡️ Security Checklist

✓ All passwords hashed with bcryptjs  
✓ JWT tokens signed with secret  
✓ Bearer token authentication  
✓ 7-day token expiration  
✓ Input validation on all endpoints  
✓ Role-based access control  
✓ CORS enabled  
✓ Error handling with safe messages  

---

## 🧪 Testing Commands

### cURL Examples
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"TestPass123!"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!"}'

# Protected endpoint (replace TOKEN)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman
1. Create collection "Auth API"
2. Add requests for each endpoint
3. Use environment variable `{{token}}`
4. In Tests tab: `pm.environment.set("token", pm.response.json().data.token)`

---

## 📁 File Structure

```
controllers/
  └─ authController.js          (6 methods)

middlewares/
  ├─ auth.js                    (2 middleware)
  └─ validation/
      └─ authValidation.js      (4 validation sets)

routes/
  └─ authRoutes.js              (6 endpoints)

models/
  ├─ User.js                    (pre-existing)
  └─ index.js                   (exports)
```

---

## 🔧 Environment Variables

```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your_secret_minimum_32_characters_long
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

---

## 💡 Common Tasks

### Using Auth in Another Route
```javascript
import { verifyToken, isAdmin } from '../middlewares/auth.js';

// Protect route
router.get('/data', verifyToken, controller.getData);

// Admin route
router.delete('/admin/users/:id', verifyToken, isAdmin, controller.deleteUser);
```

### Access User in Controller
```javascript
export const myController = asyncHandler(async (req, res) => {
  // req.user = { id, email, role }
  const userId = req.user.id;
  const user = await User.findById(userId);
});
```

### Generate Token Manually
```javascript
const user = await User.findById(userId);
const token = user.generateAuthToken();
```

---

## 🐛 Troubleshooting

### "Token not found"
→ Check Authorization header format: `Bearer <token>`

### "Invalid credentials"
→ Verify email and password are correct
→ Check password complexity (needs special char, number, etc.)

### "Email already registered"
→ Use different email or login with existing account

### "CORS error"
→ Check CORS_ORIGIN in .env
→ Frontend URL must match

### "Database connection failed"
→ Verify MONGO_URI is correct
→ Check MongoDB Atlas connection settings

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| AUTHENTICATION_GUIDE.md | Complete API reference |
| AUTHENTICATION_TESTING.md | Testing guide |
| AUTHENTICATION_CODE_STRUCTURE.md | Code architecture |
| AUTHENTICATION_SETUP_COMPLETE.md | Setup instructions |

---

## 🎯 Common Response Formats

### Success (200/201)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "user": { /* user object */ },
    "token": "eyJ..."
  }
}
```

### Error (400/401/403/404)
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Specific error message"
}
```

---

## 🚀 Deployment Notes

1. Change NODE_ENV to 'production'
2. Use strong JWT_SECRET (min 32 chars)
3. Enable HTTPS/TLS
4. Set specific CORS_ORIGIN
5. Configure database backups
6. Set up error monitoring
7. Enable rate limiting

---

## 📞 Key Methods

### In Controllers
- `register()` - Create new user
- `login()` - Verify credentials
- `logout()` - Logout notification
- `getProfile()` - Get user details
- `updateProfile()` - Update user info
- `changePassword()` - Change password

### In Middleware
- `verifyToken()` - JWT validation
- `isAdmin()` - Admin check

### In Models
- `comparePassword()` - Compare hashed passwords
- `generateAuthToken()` - Generate JWT token

---

## ⚡ Performance Tips

✓ JWT tokens are stateless (fast)  
✓ Use Redis for token blacklist (optional)  
✓ Enable database connection pooling  
✓ Use indexes on email field  
✓ Cache user data if needed  

---

## 🔗 Integration Examples

### React/Vue Frontend
```javascript
// Login & store token
const response = await fetch('/api/auth/login', { /* ... */ });
const data = await response.json();
localStorage.setItem('token', data.data.token);

// Use token in requests
fetch('/api/auth/profile', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
});
```

### Axios Setup
```javascript
const api = axios.create({
  baseURL: 'http://localhost:5000'
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 📊 Summary

| Feature | Status | Details |
|---------|--------|---------|
| Registration | ✅ | Email validation, password hashing |
| Login | ✅ | JWT token generation |
| Protected Routes | ✅ | Token verification |
| Profile Mgmt | ✅ | Get, update user |
| Password Change | ✅ | Old password verification |
| Admin Access | ✅ | Role-based control |
| Input Validation | ✅ | express-validator |
| Error Handling | ✅ | Comprehensive |
| Documentation | ✅ | 6 files |

---

**Print this card for quick reference during development!**

*For detailed information, see the full documentation files in the project.*

# Single Seller Ecommerce Platform - Backend

A complete Node.js Express backend for a single-seller ecommerce platform with MongoDB, JWT authentication, file uploads, and comprehensive error handling.

## 🚀 Features

- **Express.js** - Lightweight web framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT Authentication** - Secure token-based auth
- **Bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **Custom Error Handling** - Centralized error management
- **Environment Configuration** - dotenv support

## 📁 Project Structure

```
Singleseller/
├── config/
│   ├── config.env          # Environment variables
│   └── db.js               # MongoDB connection
├── controllers/            # Business logic
│   └── exampleController.js
├── middlewares/            # Express middlewares
│   ├── auth.js            # JWT authentication
│   ├── errorHandler.js    # Global error handler
│   ├── validation.js      # Input validation
│   └── asyncHandler.js    # Async error wrapper
├── models/                 # Mongoose schemas
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/                 # API routes
│   └── exampleRoutes.js
├── services/               # Reusable business logic
│   ├── exampleService.js
│   └── tokenService.js
├── utils/                  # Utility functions
│   ├── ApiError.js         # Custom error class
│   ├── helpers.js          # Helper functions
│   └── multerConfig.js     # File upload config
├── uploads/                # User uploaded files
├── public/                 # Static files
│   └── index.html          # Welcome page
├── testingAPI/             # API testing
│   ├── testAPI.js
│   └── postmanCollection.js
├── app.js                  # Express app config
├── server.js               # Server entry point
├── package.json            # Dependencies
├── .gitignore              # Git ignore rules
└── test-notifications.js   # Notification tests
```

## 🔧 Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account

### Steps

1. **Clone/Setup the project**
   ```bash
   cd Singleseller
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Edit `config/config.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/singleseller
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Health Check
```
GET /api/health
```
Response:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-11-27T12:00:00.000Z"
}
```

### API Documentation
```
GET /api
```

### Welcome
```
GET /
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Token Generation
```javascript
const { generateToken } = require('./services/tokenService');

const token = generateToken({
  id: userId,
  email: userEmail,
  role: userRole
});
```

### Using Token in Requests
```
Authorization: Bearer <your_jwt_token>
```

### Middleware Usage
```javascript
const { authenticate, authorize } = require('./middlewares/auth');

// Protect route
router.get('/protected', authenticate, (req, res) => {
  // req.user contains decoded token
});

// Protect with role check
router.delete('/admin/users/:id', authenticate, authorize('admin'), (req, res) => {
  // Only admins can access
});
```

## 📤 File Uploads

The project includes Multer configuration for handling file uploads.

### Configuration
```javascript
const upload = require('./utils/multerConfig');

// Single file upload
router.post('/upload', upload.single('avatar'), (req, res) => {
  // req.file contains file info
});

// Multiple files
router.post('/upload-multiple', upload.array('images', 5), (req, res) => {
  // req.files contains files array
});
```

## ✅ Input Validation

Use express-validator for input validation:

```javascript
const { validateEmail, validatePassword, handleValidationErrors } = require('./middlewares/validation');

router.post('/register',
  validateEmail,
  validatePassword,
  handleValidationErrors,
  (req, res) => {
    // Validated data
  }
);
```

## 🛡️ Error Handling

The application uses a custom `ApiError` class for consistent error handling:

```javascript
const ApiError = require('./utils/ApiError');

// Throw custom error
throw new ApiError(400, 'Invalid input');

// In async handlers
const asyncHandler = require('./middlewares/asyncHandler');

const myController = asyncHandler(async (req, res) => {
  throw new ApiError(404, 'User not found');
  // Error automatically caught and passed to error handler
});
```

## 📝 Models

### User Model
- name
- email (unique)
- password (hashed)
- role (seller/admin)
- phone
- avatar
- isActive
- verifiedEmail
- timestamps

### Product Model
- name
- description
- price
- costPrice
- stock
- category
- images
- rating
- reviews
- isFeatured
- isActive
- timestamps

### Order Model
- user (ref)
- items (products with quantity)
- totalAmount
- status (pending/confirmed/shipped/delivered/cancelled)
- paymentStatus
- shippingAddress
- notes
- timestamps

## 🧪 Testing

### Run API Tests
```bash
node testingAPI/testAPI.js
```

### Run Notification Tests
```bash
node test-notifications.js
```

### Postman Collection
Import the collection from `testingAPI/postmanCollection.js` into Postman for easy API testing.

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **dotenv**: Environment variables
- **cors**: CORS middleware
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **multer**: File uploads
- **express-validator**: Input validation

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRE=7d
```

### Build & Run
```bash
npm start
```

## 📋 Best Practices

1. **Always use async handlers** to catch errors
2. **Validate all user inputs** before processing
3. **Hash passwords** before storing
4. **Use environment variables** for secrets
5. **Implement proper error handling** with custom errors
6. **Add CORS** for frontend integration
7. **Use JWT** for authentication
8. **Validate file uploads** for security
9. **Log errors** for debugging
10. **Use git** and commit frequently

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check `MONGO_URI` in `config/config.env`
- Ensure MongoDB Atlas cluster is active
- Verify network access whitelist

### Port Already in Use
```bash
# Change PORT in config.env or
npm start -- --port 3000
```

### JWT Token Errors
- Verify `JWT_SECRET` is set in environment
- Check token format: `Bearer <token>`
- Ensure token hasn't expired

## 📞 Support

For issues or questions, refer to:
- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 📄 License

MIT License - feel free to use this template for your projects

## ✨ Next Steps

1. Implement authentication routes (register, login)
2. Create product management endpoints
3. Build order processing system
4. Add payment gateway integration
5. Implement email notifications
6. Add search and filtering
7. Create admin dashboard APIs
8. Implement review and rating system
9. Add inventory management
10. Set up CI/CD pipeline

---

**Happy Coding! 🚀**

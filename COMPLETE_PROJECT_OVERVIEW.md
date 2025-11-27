# 🛍️ SingleSeller - Complete Ecommerce Platform

**Setup Status**: ✅ Backend + Frontend Complete  
**Last Updated**: November 27, 2025  

---

## 📋 Project Overview

SingleSeller is a modern, full-stack single-seller ecommerce platform built with:

### 🖥️ Backend
- **Node.js + Express** - REST API server
- **MongoDB Atlas** - NoSQL database
- **JWT Authentication** - Secure token-based auth
- **Multer** - File upload handling

### 🎨 Frontend
- **React 19 + Vite** - Modern frontend framework
- **Tailwind CSS** - Utility-first styling
- **React Router v7** - Client-side routing
- **Axios** - HTTP client with interceptors

---

## 🚀 Quick Start

### Backend Setup
```bash
# Install dependencies
npm install

# Configure environment variables
# Edit config/config.env with:
PORT=5000
MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Start server
node server.js
```
**Server runs on**: `http://localhost:5000`

### Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Start development server
npm run dev
```
**Client runs on**: `http://localhost:5173`

---

## 📁 Project Structure

```
Singleseller/
│
├── Backend (Root Level)
│   ├── app.js                 - Express app configuration
│   ├── server.js              - Main entry point
│   ├── package.json           - Dependencies
│   │
│   ├── config/
│   │   ├── config.env         - Environment variables
│   │   └── db.js              - MongoDB connection
│   │
│   ├── controllers/
│   │   └── exampleController.js
│   │
│   ├── middlewares/
│   │   ├── auth.js            - Authentication middleware
│   │   ├── errorHandler.js    - Global error handling
│   │   ├── asyncHandler.js    - Async error wrapper
│   │   └── validation.js      - Input validation
│   │
│   ├── models/
│   │   ├── User.js            - User schema
│   │   ├── Product.js         - Product schema
│   │   └── Order.js           - Order schema
│   │
│   ├── routes/
│   │   └── exampleRoutes.js
│   │
│   ├── services/
│   │   └── tokenService.js    - JWT token service
│   │
│   ├── utils/
│   │   ├── ApiError.js        - Custom error class
│   │   ├── helpers.js         - Helper functions
│   │   └── multerConfig.js    - File upload config
│   │
│   ├── uploads/               - File uploads directory
│   ├── public/                - Static files
│   └── testingAPI/            - API testing scripts
│
├── Frontend (frontend/ folder)
│   ├── src/
│   │   ├── components/        - Reusable UI components (7 files)
│   │   ├── pages/             - Route pages (2 files)
│   │   ├── context/           - Global state (Auth, Cart)
│   │   ├── services/          - API services (4 files)
│   │   ├── utils/             - Helper functions
│   │   ├── assets/            - Images, icons
│   │   ├── App.jsx            - Main app component
│   │   ├── main.jsx           - Entry point
│   │   └── index.css          - Global styles
│   │
│   ├── public/                - Static files
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env
│
└── Documentation Files
    ├── README.md                    - This file
    ├── DEVELOPMENT_GUIDE.md         - Development guide
    ├── PROJECT_CHECKLIST.md         - Implementation checklist
    ├── README_BACKEND.md            - Backend documentation
    ├── FRONTEND_COMPLETE_SETUP.md   - Frontend summary
    ├── SETUP_COMPLETE.js            - Setup verification
    ├── SETUP_SUMMARY.md             - Setup overview
    ├── test-notifications.js        - Notification testing
    └── postman/                     - Postman collection
```

---

## 🎯 Architecture Overview

### Backend Architecture
```
Request → Middleware (Auth, Validation) → Route Handler → 
Controller (Business Logic) → Service (Database) → 
Response (with Error Handling)
```

### Frontend Architecture
```
UI Components → Pages → Routes → Context (State) → 
Services (API Calls) → Backend
```

---

## 💾 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: Object,
  role: enum(['user', 'admin']),
  createdAt: Date
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  stock: Number,
  image: String,
  category: String,
  seller: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  orderId: String (unique),
  user: ObjectId (ref: User),
  products: Array,
  totalAmount: Number,
  status: enum(['pending', 'confirmed', 'shipped', 'delivered']),
  shippingAddress: Object,
  createdAt: Date
}
```

---

## 🔑 Key Features Implemented

### ✅ Backend Features
- User authentication with JWT
- Product management (CRUD)
- Order management
- Error handling middleware
- Input validation
- File upload with Multer
- Custom error class
- Async error handling

### ✅ Frontend Features
- Authentication context (login/register/logout)
- Shopping cart context (add/remove/update)
- Product listing
- Responsive UI with Tailwind CSS
- API integration with Axios
- Toast notifications
- React Router v7
- Reusable components
- Global state management

---

## 🔒 Security Features

### Backend
- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ CORS configuration
- ✅ Express validator for input validation
- ✅ Error message sanitization
- ✅ HTTP headers security (in production)

### Frontend
- ✅ JWT token management
- ✅ Protected routes
- ✅ Secure token storage
- ✅ Request/response interceptors
- ✅ Input validation
- ✅ XSS protection with React

---

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
PUT    /api/auth/profile         - Update profile
```

### Products
```
GET    /api/products             - Get all products
GET    /api/products/:id         - Get product by ID
POST   /api/products             - Create product (admin)
PUT    /api/products/:id         - Update product (admin)
DELETE /api/products/:id         - Delete product (admin)
GET    /api/products/search      - Search products
```

### Orders
```
GET    /api/orders               - Get all orders (admin)
GET    /api/orders/my-orders     - Get user's orders
GET    /api/orders/:id           - Get order by ID
POST   /api/orders               - Create order
PUT    /api/orders/:id/status    - Update order status (admin)
PUT    /api/orders/:id/cancel    - Cancel order
```

---

## 🎨 Color Scheme

```
Primary Color (Teal):     #21808d
Background Color (Cream): #fcfcf9
Text Color (Slate):       #134252

Variants:
- Primary 500: #21808d (main)
- Primary 600: #1a6471 (hover)
- Primary 700: #144855 (active)
```

---

## 🛠️ Technology Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 16+ | Runtime |
| Express | Latest | Web framework |
| MongoDB | Cloud | Database |
| Mongoose | Latest | ODM |
| JWT | Latest | Authentication |
| bcryptjs | Latest | Password hashing |
| Multer | Latest | File upload |
| Dotenv | Latest | Environment vars |
| Cors | Latest | Cross-origin |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.0 | UI library |
| Vite | 5.x | Build tool |
| React Router | 7.9.6 | Routing |
| Axios | 1.13.2 | HTTP client |
| Tailwind CSS | 4.1.17 | Styling |
| React Hot Toast | 2.6.0 | Notifications |
| PostCSS | 8.5.6 | CSS processing |

---

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/singleseller
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 Testing

### API Testing
- Postman collection included
- Test scripts in `testingAPI/`
- Notification testing: `test-notifications.js`

### Frontend Testing
- Manual browser testing
- React DevTools for debugging
- Network tab for API calls

---

## 📖 Documentation

### Backend
- `README_BACKEND.md` - Backend setup and API details
- `DEVELOPMENT_GUIDE.md` - Development guidelines

### Frontend
- `FRONTEND_COMPLETE_SETUP.md` - Frontend setup summary
- `frontend/QUICK_START.md` - Quick start guide
- `frontend/FRONTEND_SETUP.md` - Detailed frontend docs

### Project
- `PROJECT_CHECKLIST.md` - Implementation checklist
- `SETUP_SUMMARY.md` - Setup overview
- `DEVELOPMENT_GUIDE.md` - Complete development guide

---

## 🚀 Running the Application

### Option 1: Separate Terminals

**Terminal 1 - Backend**
```bash
# In root directory
node server.js
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend**
```bash
cd frontend
npm run dev
# Client runs on http://localhost:5173
```

### Option 2: Using npm scripts

```bash
# In root (if scripts added)
npm run dev:all
```

---

## 🔄 Development Workflow

1. **Backend Development**
   - Create models in `models/`
   - Create controllers in `controllers/`
   - Create routes in `routes/`
   - Test with Postman

2. **Frontend Development**
   - Create components in `src/components/`
   - Create pages in `src/pages/`
   - Add services in `src/services/`
   - Use Tailwind for styling

3. **Integration**
   - Update API URLs
   - Test authentication flow
   - Test shopping cart
   - Manual testing

---

## 📦 Build & Deployment

### Backend Deployment
```bash
# Prepare for production
npm install --production

# Run with production settings
NODE_ENV=production node server.js
```

### Frontend Deployment
```bash
# Build
npm run build

# Output in dist/
# Deploy dist/ folder to hosting (Vercel, Netlify, etc.)
```

---

## 🎓 Learning Resources

### Backend
- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Frontend
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)
- [React Router](https://reactrouter.com)

---

## ✅ Completed Tasks

- ✅ Backend setup with Express and MongoDB
- ✅ Authentication system with JWT
- ✅ Product management system
- ✅ Order management system
- ✅ Error handling middleware
- ✅ Input validation
- ✅ File upload configuration
- ✅ Frontend React project with Vite
- ✅ Tailwind CSS configuration
- ✅ Authentication context and services
- ✅ Shopping cart context
- ✅ API integration with axios
- ✅ Reusable UI components
- ✅ Page routing
- ✅ Comprehensive documentation

---

## 📋 Next Steps

### Short Term
- [ ] Create login/register pages
- [ ] Create user profile page
- [ ] Create shopping cart page
- [ ] Create checkout flow
- [ ] Test authentication flow
- [ ] Test product listing
- [ ] Test shopping cart functionality

### Medium Term
- [ ] Add search and filters
- [ ] Add product reviews/ratings
- [ ] Add wishlist feature
- [ ] Add order history
- [ ] Add admin dashboard
- [ ] Add payment integration

### Long Term
- [ ] Add notifications system
- [ ] Add email notifications
- [ ] Add social media integration
- [ ] Add analytics
- [ ] Add performance optimization
- [ ] Add unit tests
- [ ] Add E2E tests

---

## 🐛 Troubleshooting

### Backend Issues
1. **MongoDB Connection Failed**
   - Check MONGO_URI in .env
   - Ensure MongoDB Atlas IP whitelist

2. **Port 5000 in Use**
   - Change PORT in config.env
   - Or kill process: `lsof -ti:5000 | xargs kill -9`

3. **JWT Errors**
   - Check JWT_SECRET is set
   - Check token format in headers

### Frontend Issues
1. **Port 5173 in Use**
   - Use `npm run dev -- --port 3000`
   - Or kill process

2. **API Connection Failed**
   - Check VITE_API_URL in .env
   - Ensure backend is running
   - Check CORS configuration

3. **Styling Issues**
   - Check Tailwind class names
   - Clear cache and rebuild
   - Check tailwind.config.js

---

## 💬 Support & Help

- Check documentation files
- Review code comments
- Check error messages in console
- Review API responses
- Test with Postman

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👨‍💼 Author & Contributors

**Created**: November 27, 2025  
**Version**: 1.0.0  

---

## 🎉 Ready to Build!

Your complete ecommerce platform is ready for development. Start with the quick start guide above and happy coding!

**Questions?** Check the documentation files or review the code comments.

---

**Last Updated**: November 27, 2025 ✅

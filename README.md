# 🛒 Singleseller - Complete E-Commerce Platform

**A full-stack single-seller e-commerce solution with admin dashboard, shopping cart, and order management.**

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Installation](#installation)
5. [Quick Start](#quick-start)
6. [Configuration](#configuration)
7. [Running the Application](#running-the-application)
8. [API Documentation](#api-documentation)
9. [Features](#features)
10. [Development Guide](#development-guide)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**Singleseller** is a complete e-commerce platform built with:
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Features**: User authentication, product management, shopping cart, checkout, admin dashboard, order management

### Key Highlights
✅ Complete shopping cart and checkout system  
✅ Admin dashboard with role-based access  
✅ Product and category management  
✅ Order tracking with status updates  
✅ User authentication with JWT  
✅ Responsive design (mobile, tablet, desktop)  
✅ Production-ready code with error handling  

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool (lightning-fast bundling)
- **React Router v7** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **MongoDB 9** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

---

## 📁 Project Structure

```
singleseller/
├── frontend/                      # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminLayout.jsx
│   │   │   │   ├── AdminSidebar.jsx
│   │   │   │   ├── StatsCard.jsx
│   │   │   │   ├── DataTable.jsx
│   │   │   │   ├── ImageUploadPreview.jsx
│   │   │   │   └── ProductForm.jsx
│   │   │   └── [Cart, Order, Payment components]
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Products.jsx
│   │   │   │   ├── Orders.jsx
│   │   │   │   └── Categories.jsx
│   │   │   └── [Cart, Checkout, Order pages]
│   │   ├── services/
│   │   │   ├── adminService.js
│   │   │   ├── cartService.js
│   │   │   └── [Auth, Product, Order services]
│   │   └── App.jsx
│   └── package.json
│
├── config/
│   ├── db.js                      # MongoDB connection
│   └── config.env
│
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── orderController.js
│   └── categoryController.js
│
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   ├── Order.js
│   └── Category.js
│
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   └── categoryRoutes.js
│
├── server.js                      # Backend entry point
├── app.js                         # Express setup
├── package.json                   # Scripts updated
├── .env.example                   # Environment template
└── test-notifications.js          # Test suite
```

---

## 🚀 Installation

### Prerequisites
- Node.js v18.0.0 or higher
- MongoDB (local or Atlas cloud)
- npm or yarn

### Quick Install

```bash
# Backend dependencies
npm install

# Frontend dependencies
cd frontend
npm install
cd ..
```

---

## 🏃 Quick Start

### 1. Configure Environment

**Backend (.env):**
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_here_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env.local):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_ENV=development
```

### 2. Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGO_URI with your Atlas connection string
```

### 3. Run Backend
```bash
npm run dev
# Backend running on http://localhost:5000
```

### 4. Run Frontend (New Terminal)
```bash
cd frontend
npm run dev
# Frontend running on http://localhost:5173
```

### 5. Access Application
```
http://localhost:5173
```

---

## ⚙️ Configuration

### Backend Scripts (package.json)
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "node test-notifications.js"
  }
}
```

### Frontend Scripts (frontend/package.json)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Environment Files

**Create `.env` from `.env.example`:**
```bash
cp .env.example .env
```

**Create `.env.local` from template:**
```bash
cd frontend
cp .env.example .env.local
cd ..
```

---

## 📚 API Documentation

### Authentication
```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
POST /api/auth/logout
```

### Products
```
GET /api/products
GET /api/products/:id
POST /api/products (Admin)
PUT /api/products/:id (Admin)
DELETE /api/products/:id (Admin)
```

### Cart
```
GET /api/cart
POST /api/cart/add
PUT /api/cart/update/:itemId
DELETE /api/cart/remove/:itemId
DELETE /api/cart/clear
```

### Orders
```
GET /api/orders
GET /api/orders/:id
POST /api/orders
PUT /api/orders/:id/status (Admin)
```

### Admin
```
GET /api/admin/dashboard/stats
GET /api/admin/products
GET /api/admin/orders
GET /api/admin/categories
```

---

## ✨ Features

### User Features
✅ User registration and login  
✅ Browse and search products  
✅ Shopping cart management  
✅ Checkout with shipping and payment  
✅ Order history and tracking  
✅ Order cancellation  

### Admin Features
✅ Dashboard with statistics  
✅ Product management (CRUD)  
✅ Category management (CRUD)  
✅ Order management and status updates  
✅ Revenue analytics  
✅ Inventory tracking  

### Technical Features
✅ JWT authentication  
✅ Password hashing (bcrypt)  
✅ Image upload and processing  
✅ Input validation  
✅ Error handling  
✅ CORS support  
✅ Responsive design  
✅ Toast notifications  

---

## 🧪 Testing

### Run Notification Tests
```bash
npm test
```

This tests:
- Order status transitions
- Email notifications (console mock)
- Valid/invalid transitions
- Order cancellation
- Order details logging

---

## 🏗️ Development

### Running Backend Only
```bash
npm run dev
# http://localhost:5000
```

### Running Frontend Only
```bash
cd frontend
npm run dev
# http://localhost:5173
```

### Building for Production
```bash
cd frontend
npm run build
# Outputs to frontend/dist
```

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel
```

### Backend (Heroku)
```bash
heroku create singleseller-api
git push heroku main
```

---

## 🔧 Troubleshooting

**Cannot find module:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Verify MONGO_URI in .env
- Check MongoDB Atlas IP whitelist

**CORS Errors:**
- Verify FRONTEND_URL in .env
- Ensure frontend and backend URLs match

**Port Already in Use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 📖 Documentation

- **Backend**: See `README_BACKEND.md`
- **Frontend**: See `frontend/README.md`
- **Admin Dashboard**: See `ADMIN_DASHBOARD_QUICK_REFERENCE.md`
- **Shopping Cart**: See `SHOPPING_CART_QUICK_REFERENCE.md`

---

## 🎉 Commands Reference

```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..

# Run development
npm run dev                    # Backend
cd frontend && npm run dev     # Frontend

# Run tests
npm test

# Build production
cd frontend && npm run build

# Access URLs
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
# API: http://localhost:5000/api
```

---

**Happy coding! 🚀**

*Last Updated: November 28, 2025*  
*Version: 1.0.0*

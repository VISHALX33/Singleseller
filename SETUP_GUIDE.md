# 🚀 COMPLETE SETUP GUIDE - Singleseller E-Commerce Platform

**Everything you need to get Singleseller running locally and in production**

---

## ⚡ Quick Start (5 Minutes)

### For Windows Users (Recommended)

**Step 1: Prerequisites**
```bash
# Check Node.js version
node --version    # Should be v18.0.0 or higher

# Check npm version
npm --version
```

**Step 2: Install Backend Dependencies**
```bash
cd c:\Users\shalini\Desktop\Singleseller
npm install
```

**Step 3: Install Frontend Dependencies**
```bash
cd frontend
npm install
cd ..
```

**Step 4: Create .env Files**
```bash
# Copy backend template
copy .env.example .env

# Copy frontend template
cd frontend
copy .env.example .env.local
cd ..
```

**Step 5: Edit .env file**
```env
# .env file
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_here_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

**Step 6: Edit frontend/.env.local**
```env
# frontend/.env.local
VITE_API_URL=http://localhost:5000/api
VITE_ENV=development
```

**Step 7: Start MongoDB (Terminal 1)**
```bash
# Start MongoDB service
# Go to MongoDB installation directory and run:
mongod

# Or if you installed with Homebrew:
brew services start mongodb-community
```

**Step 8: Start Backend (Terminal 2)**
```bash
npm run dev
# Expected output:
# Server is running on port 5000
# MongoDB connected successfully
```

**Step 9: Start Frontend (Terminal 3)**
```bash
cd frontend
npm run dev

# Expected output:
# ➜  local:   http://localhost:5173/
# ➜  press h to show help
```

**Step 10: Open Browser**
```
http://localhost:5173
```

✅ **You're Done!** Your application is now running.

---

## 📋 Detailed Installation

### Prerequisites Installation

#### Windows

**Option 1: Using Chocolatey (Recommended)**
```bash
# Install Chocolatey first if not installed
# Then run:
choco install nodejs mongodb-community

# Verify installation
node --version
npm --version
mongod --version
```

**Option 2: Manual Installation**
1. Download Node.js from https://nodejs.org (LTS version)
2. Download MongoDB Community from https://www.mongodb.com/try/download/community
3. Follow installation wizards
4. Add to PATH if needed

#### macOS

```bash
# Using Homebrew
brew install node
brew install mongodb-community

# Verify installation
node --version
npm --version
mongod --version
```

#### Linux (Ubuntu/Debian)

```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# MongoDB
sudo apt-get install -y mongodb

# Verify
node --version
npm --version
mongod --version
```

---

## 🗄️ Database Setup

### Option 1: Local MongoDB

**Windows:**
```bash
# MongoDB is installed as a service
# Start it:
net start MongoDB

# Or manually:
mongod
```

**macOS:**
```bash
# Using Homebrew
brew services start mongodb-community

# Or manually
mongod
```

**Linux:**
```bash
# Start MongoDB
sudo systemctl start mongod

# Enable auto-start
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

### Option 2: MongoDB Atlas (Cloud)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Click "Register"
   - Complete sign-up

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Free" tier
   - Select your region
   - Click "Create Cluster"
   - Wait 2-5 minutes for cluster to be ready

3. **Create Database User**
   - Click "Database Access"
   - Click "Add New Database User"
   - Username: `admin`
   - Password: Generate secure password
   - Click "Add User"

4. **Get Connection String**
   - Click "Clusters"
   - Click "Connect"
   - Choose "Drivers"
   - Copy connection string
   - Replace `<password>` with your password

5. **Update .env**
   ```env
   MONGO_URI=mongodb+srv://admin:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

6. **IP Whitelist** (if needed)
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Add Current IP Address"
   - Click "Confirm"

---

## 📦 Dependencies Overview

### Backend Dependencies (installed with npm install)

```json
{
  "express": "^5.1.0",              // Web framework
  "mongoose": "^9.0.0",             // MongoDB ODM
  "jsonwebtoken": "^9.0.2",         // JWT authentication
  "bcryptjs": "^3.0.3",             // Password hashing
  "cors": "^2.8.5",                 // Cross-origin requests
  "multer": "^2.0.2",               // File upload
  "dotenv": "^17.2.3",              // Environment variables
  "express-validator": "^7.3.1"     // Input validation
}
```

### Frontend Dependencies (installed with npm install)

```json
{
  "react": "^19.2.0",               // UI framework
  "react-dom": "^19.2.0",           // DOM rendering
  "react-router-dom": "^7.9.6",     // Routing
  "axios": "^1.13.2",               // HTTP client
  "react-hot-toast": "^2.6.0",      // Toast notifications
  "tailwindcss": "^4.1.17",         // CSS framework
  "lucide-react": "^latest"         // Icons
}
```

---

## 🎯 Configuration Files Explained

### Backend .env File

```env
# Application Mode
NODE_ENV=development          # development, staging, production

# Server Configuration
PORT=5000                     # Port where server runs

# Database Configuration
MONGO_URI=mongodb://...       # Local: mongodb://localhost:27017/ecommerce
                              # Atlas: mongodb+srv://user:pass@cluster.net/db

# JWT Configuration
JWT_SECRET=your_secret_key    # Secret key for signing tokens
JWT_EXPIRE=7d                 # Token expiration time (7 days)

# CORS Configuration
FRONTEND_URL=http://...       # Frontend URL for CORS

# Optional: Email Service
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=app-password

# Optional: Payment Gateway
# STRIPE_API_KEY=sk_test_...
# RAZORPAY_KEY=rzp_test_...

# Optional: AWS S3 for image uploads
# AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
# AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
# AWS_BUCKET_NAME=singleseller-images
```

### Frontend .env.local File

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Environment
VITE_ENV=development

# Optional: Analytics
# VITE_SENTRY_DSN=https://key@sentry.io/project
# VITE_GA_ID=G-XXXXXXXXXX
```

---

## 🏃 Running the Application

### Development Mode (Best for Development)

**Terminal 1 - Backend:**
```bash
npm run dev
```

Output:
```
Server is running on port 5000
Connected to MongoDB
Nodemon is watching for changes...
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Output:
```
VITE v7.0.0  ready in 500 ms

➜  local:   http://localhost:5173/
➜  press h to show help
```

**Terminal 3 - Tests (Optional):**
```bash
npm test
```

### Production Mode

**Build Frontend:**
```bash
cd frontend
npm run build
# Creates optimized build in 'dist' folder
```

**Run Backend:**
```bash
npm start
```

---

## 🧪 Testing the Application

### Run Notification Tests

```bash
npm test
```

**What it tests:**
1. Order status transitions (pending → confirmed → processing → shipped → delivered)
2. Invalid status transitions (should fail gracefully)
3. Order cancellation
4. Email notification formatting (mock)
5. Order details logging

**Expected Output:**
```
╔════════════════════════════════════════════════════════════════╗
║       SINGLESELLER - ORDER NOTIFICATIONS TEST SUITE             ║
╚════════════════════════════════════════════════════════════════╝

🧪 TEST SCENARIO 1: Order Status Transitions

--- Test 1.1: Pending → Confirmed ---

✅ Order Status Updated
   Order ID: ORD-001
   Status: pending → confirmed

📧 EMAIL NOTIFICATION
   To: customer1@example.com
   Subject: Order Confirmed - ORD-001
   Data: {...}

... more tests ...

✅ Test Suite Completed Successfully!
```

### Manual Testing

**Using Browser:**
1. Open http://localhost:5173
2. Register new account
3. Browse products
4. Add items to cart
5. Proceed to checkout
6. Place order
7. View order in history

**Using Postman/Insomnia:**
```bash
# Import API collection from testingAPI/ folder
# Or create requests manually:

POST http://localhost:5000/api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

GET http://localhost:5000/api/products
Authorization: Bearer <token>
```

---

## 📊 npm Scripts Reference

### Backend Scripts

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start

# Run tests
npm test

# Check Node version
node --version

# List installed packages
npm list
```

### Frontend Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🔍 Troubleshooting

### Issue: "Cannot find module 'express'"

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: MongoDB Connection Failed

**Solutions:**
1. Check MongoDB is running:
   ```bash
   # Windows
   sc query MongoDB
   
   # macOS
   brew services list | grep mongo
   
   # Linux
   sudo systemctl status mongod
   ```

2. Verify connection string in .env:
   ```env
   # Local
   MONGO_URI=mongodb://localhost:27017/ecommerce
   
   # Or Atlas
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/ecommerce
   ```

3. Check MongoDB is listening on port 27017:
   ```bash
   mongosh  # Connect to MongoDB shell
   ```

### Issue: Port 5000 Already in Use

**Windows:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Find process
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Issue: Frontend Can't Connect to Backend

**Solutions:**
1. Verify backend is running on port 5000
2. Check VITE_API_URL in frontend/.env.local:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Check CORS is enabled in backend
4. Restart both servers

### Issue: CORS Errors

**Check backend app.js:**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

**Verify .env:**
```env
FRONTEND_URL=http://localhost:5173
```

### Issue: "nodemon not found"

**Solution:**
```bash
npm install --save-dev nodemon
npm run dev
```

### Issue: JWT Token Errors

**Solutions:**
1. Verify JWT_SECRET in .env is set
2. Check Authorization header format:
   ```
   Authorization: Bearer <token>
   ```
3. Verify token hasn't expired (JWT_EXPIRE=7d)

---

## 🚢 Deployment Guide

### Frontend Deployment (Vercel)

**Step 1: Build**
```bash
cd frontend
npm run build
```

**Step 2: Deploy**
```bash
npm install -g vercel
vercel
```

**Step 3: Environment Variables**
```
VITE_API_URL=https://api.yourdomain.com/api
```

### Backend Deployment (Heroku)

**Step 1: Create Heroku Account**
- Go to https://www.heroku.com
- Sign up for free account

**Step 2: Install Heroku CLI**
```bash
# Windows
choco install heroku-cli

# macOS
brew tap heroku/brew && brew install heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

**Step 3: Create App**
```bash
heroku login
heroku create singleseller-api
```

**Step 4: Set Environment Variables**
```bash
heroku config:set PORT=5000
heroku config:set MONGO_URI=<your_atlas_uri>
heroku config:set JWT_SECRET=<your_secure_secret>
heroku config:set JWT_EXPIRE=7d
heroku config:set FRONTEND_URL=https://yourdomain.com
heroku config:set NODE_ENV=production
```

**Step 5: Deploy**
```bash
git push heroku main
```

**Step 6: View Logs**
```bash
heroku logs --tail
```

---

## 📱 Mobile Testing

### Using Local Network

**Get Computer IP:**
```bash
# Windows
ipconfig | findstr "IPv4"

# macOS/Linux
ifconfig | grep "inet "
```

**Update Frontend Config:**
```env
VITE_API_URL=http://<your-ip>:5000/api
```

**On Mobile:**
```
http://<your-ip>:5173
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to strong random string
- [ ] Use HTTPS (not HTTP)
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas (not local)
- [ ] Add IP whitelist to MongoDB Atlas
- [ ] Use strong database password
- [ ] Enable CORS only for your frontend URL
- [ ] Set secure session cookies
- [ ] Add rate limiting
- [ ] Add input validation
- [ ] Add HTTPS certificate
- [ ] Set secure headers

---

## 📚 Learning Resources

| Topic | Resource |
|-------|----------|
| Node.js | https://nodejs.org/docs |
| Express | https://expressjs.com |
| MongoDB | https://docs.mongodb.com |
| React | https://react.dev |
| Vite | https://vitejs.dev |
| Tailwind CSS | https://tailwindcss.com |

---

## 🎯 Next Steps

1. **Test locally** - Run through the quick start
2. **Explore code** - Read through the documentation files
3. **Try features** - Test shopping cart, checkout, admin panel
4. **Customize** - Add your branding and features
5. **Deploy** - Follow deployment guide
6. **Monitor** - Check logs and performance

---

## 📞 Quick Help

| Issue | Command |
|-------|---------|
| Reinstall deps | `npm install` |
| Clear cache | `rm -rf node_modules` |
| Check logs | `heroku logs --tail` |
| Test APIs | `npm test` |
| Build frontend | `cd frontend && npm run build` |
| Start backend | `npm run dev` |
| Start frontend | `cd frontend && npm run dev` |

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] MongoDB connected
- [ ] Can register new user
- [ ] Can login to application
- [ ] Can browse products
- [ ] Can add items to cart
- [ ] Can proceed to checkout
- [ ] Can place order
- [ ] Admin panel accessible (/admin/dashboard)
- [ ] Can view orders in admin panel

---

**You're all set! Happy coding! 🚀**

---

*Last Updated: November 28, 2025*  
*Version: 1.0.0*

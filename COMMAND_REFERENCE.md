# 🚀 SingleSeller - Command Reference & Quick Setup

**Last Updated**: November 27, 2025

---

## ⚡ Quick Commands

### 🖥️ Backend Commands

```bash
# Install dependencies
npm install

# Start development server
node server.js

# Start with nodemon (auto-reload)
npm run dev  # if script configured

# View logs
node server.js 2>&1 | tee app.log
```

### 🎨 Frontend Commands

```bash
# Navigate to frontend
cd frontend

# Install dependencies (already done)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 📝 Configuration Files

### Backend Configuration

**File**: `config/config.env`
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/singleseller
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

**File**: `config/db.js` - MongoDB connection (already created)

### Frontend Configuration

**File**: `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
```

**File**: `frontend/tailwind.config.js` - Tailwind CSS (already configured)

---

## 🎯 First-Time Setup Checklist

### 1️⃣ Backend Setup
```bash
# 1. Check Node.js version
node --version  # Should be 16+
npm --version   # Should be 8+

# 2. Install backend dependencies
npm install

# 3. Create/verify config/config.env with:
# - PORT=5000
# - MONGO_URI=your_mongodb_url
# - JWT_SECRET=your_secret
# - JWT_EXPIRE=7d
# - CORS_ORIGIN=http://localhost:5173

# 4. Start backend server
node server.js
# ✅ Should see: "Database connected" + "Server running on port 5000"
```

### 2️⃣ Frontend Setup
```bash
# 1. Navigate to frontend folder
cd frontend

# 2. Dependencies already installed
# Verify: npm ls react react-router-dom axios

# 3. Verify .env file exists with:
# VITE_API_URL=http://localhost:5000/api

# 4. Start development server
npm run dev
# ✅ Should see: "Local: http://localhost:5173/"
```

### 3️⃣ Verification
```bash
# 1. Backend Check
# Open: http://localhost:5000
# Should respond (may show 404 for root)

# 2. Frontend Check
# Open: http://localhost:5173
# Should show SingleSeller landing page

# 3. Console Check
# Open browser DevTools (F12)
# Check Console tab for errors
# Check Network tab for API calls
```

---

## 🔗 URLs & Ports

| Service | URL | Port | Status |
|---------|-----|------|--------|
| Backend API | `http://localhost:5000/api` | 5000 | ✅ |
| Frontend Dev | `http://localhost:5173` | 5173 | ✅ |
| Frontend Build | `dist/index.html` | Varies | After build |

---

## 📂 File Structure Quick Reference

### Backend Main Files
```
server.js          → Entry point (run this)
app.js             → Express app configuration
config/config.env  → Environment variables
config/db.js       → MongoDB connection
```

### Frontend Main Files
```
src/main.jsx       → Entry point (via Vite)
src/App.jsx        → Main app component
src/index.css      → Global styles
tailwind.config.js → Tailwind configuration
```

---

## 🔧 Common Tasks

### Task: Add New Backend Route

1. Create controller: `controllers/yourController.js`
2. Create route: `routes/yourRoutes.js`
3. Add route to `app.js`: `app.use('/api/your-path', yourRoutes)`
4. Test with Postman

### Task: Add New Frontend Page

1. Create component: `src/pages/YourPage.jsx`
2. Add route in `src/App.jsx`:
```jsx
<Route path="/your-path" element={<YourPage />} />
```
3. Add link in Header or navigation

### Task: Add New UI Component

1. Create: `src/components/YourComponent.jsx`
2. Export and use in pages
3. Style with Tailwind CSS classes

### Task: Add New API Service

1. Create: `src/services/yourService.js`
2. Use existing patterns from other services
3. Import and use in components

---

## 🐛 Debugging Tips

### Backend Debugging
```bash
# 1. Check if MongoDB is connected
# Look for: "Database connected successfully"

# 2. Check if server is running
# Look for: "Server running on port 5000"

# 3. Test API endpoint
curl http://localhost:5000/api/products

# 4. Check logs
# Look in console for errors

# 5. Use Postman to test endpoints
# Create collection and test routes
```

### Frontend Debugging
```bash
# 1. Open Developer Tools (F12)
# 2. Check Console for errors
# 3. Check Network tab for API calls
# 4. Use React DevTools extension
# 5. Check Application > LocalStorage for tokens
```

---

## 📋 API Testing Checklist

### Health Checks
```bash
# Backend health
curl http://localhost:5000

# Frontend running
open http://localhost:5173
```

### Test Authentication
```bash
# Register user (POST to /api/auth/register)
{
  "name": "John",
  "email": "john@example.com",
  "password": "password123"
}

# Login (POST to /api/auth/login)
{
  "email": "john@example.com",
  "password": "password123"
}
# Returns: token and user info
```

### Test Products
```bash
# Get all products (GET /api/products)
# Should return array of products

# Get single product (GET /api/products/:id)
# Should return product details

# Create product (POST /api/products) - Admin only
{
  "name": "Product Name",
  "description": "Description",
  "price": 99.99,
  "stock": 10
}
```

---

## 🚀 Production Deployment

### Backend Deployment
```bash
# 1. Set production environment
export NODE_ENV=production

# 2. Install production dependencies
npm install --production

# 3. Start server
node server.js

# Or use PM2 for process management
npm install -g pm2
pm2 start server.js --name "singleseller-api"
```

### Frontend Deployment
```bash
# 1. Build
npm run build

# 2. Output created in dist/
# 3. Deploy dist/ folder to:
#    - Vercel: `vercel deploy`
#    - Netlify: drag & drop dist/
#    - AWS S3 + CloudFront
#    - Your own server

# 4. Update VITE_API_URL to production backend
```

---

## 📊 Project Statistics

### Backend
- **Dependencies**: ~15 packages
- **Main files**: 5 (app.js, server.js, config files)
- **Models**: 3 (User, Product, Order)
- **Routes**: Ready for implementation
- **Middleware**: 4 (auth, error, validation, async)

### Frontend
- **Dependencies**: ~5 key packages
- **Components**: 7 reusable components
- **Pages**: 2 main pages
- **Services**: 4 API service files
- **Total files**: 20+ (including configs)

---

## 🔐 Security Checklist

- ✅ Password hashing with bcryptjs
- ✅ JWT authentication configured
- ✅ CORS enabled
- ✅ Input validation setup
- ✅ Environment variables configured
- ✅ Error handling implemented
- ✅ Token interceptors in frontend
- ✅ .gitignore configured
- ⚠️ **Before Production**:
  - [ ] Update JWT_SECRET to strong key
  - [ ] Enable HTTPS
  - [ ] Configure CORS properly
  - [ ] Set NODE_ENV=production
  - [ ] Add rate limiting
  - [ ] Add request validation

---

## 🆘 Troubleshooting Quick Guide

### "Cannot find module 'mongoose'"
```bash
npm install mongoose
```

### "PORT 5000 already in use"
```bash
# Kill process on port 5000
# Windows: netstat -ano | findstr :5000, then taskkill /PID <PID> /F
# Mac/Linux: lsof -ti:5000 | xargs kill -9
# Or change port in config/config.env
```

### "CORS error"
```bash
# Make sure backend CORS_ORIGIN matches frontend URL
# Check config.env: CORS_ORIGIN=http://localhost:5173
```

### "Cannot GET /"
```bash
# This is normal! Root route not defined
# Try: http://localhost:5000/api/products
```

### "Tailwind styles not showing"
```bash
# Rebuild with: npm run build
# Or restart dev server: npm run dev
```

### "Token not working"
```bash
# 1. Check token is in localStorage
# 2. Check token format in headers
# 3. Check JWT_SECRET in backend matches
# 4. Check JWT_EXPIRE is set correctly
```

---

## 📞 Quick Support

### Check Logs
```bash
# Backend logs
tail -f server.log

# Frontend console
Open DevTools (F12) > Console tab
```

### Verify Setup
```bash
# Backend
curl -I http://localhost:5000

# Frontend  
open http://localhost:5173

# API
curl http://localhost:5000/api/products
```

### Reset Everything
```bash
# Backend
rm -rf node_modules package-lock.json
npm install
node server.js

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📚 Documentation Map

| Document | Purpose | Read First? |
|----------|---------|-------------|
| README.md (root) | Project overview | ✅ Yes |
| COMPLETE_PROJECT_OVERVIEW.md | Full architecture | ✅ Yes |
| README_BACKEND.md | Backend details | If developing backend |
| FRONTEND_COMPLETE_SETUP.md | Frontend details | If developing frontend |
| QUICK_START.md | Quick start | ✅ Yes |
| PROJECT_CHECKLIST.md | Implementation checklist | As reference |
| DEVELOPMENT_GUIDE.md | Development tips | As needed |

---

## 🎓 Learning Path

1. **Day 1**: Setup backend and frontend
2. **Day 2**: Understand folder structure
3. **Day 3**: Create authentication pages
4. **Day 4**: Create product pages
5. **Day 5**: Create shopping cart flow
6. **Week 2**: Admin dashboard
7. **Week 3**: Payment integration
8. **Week 4**: Testing and optimization

---

## ⏱️ Estimated Development Time

| Task | Time |
|------|------|
| Setup | 1 hour |
| Auth pages | 2 hours |
| Product pages | 2 hours |
| Cart & checkout | 3 hours |
| Admin panel | 4 hours |
| Testing | 2 hours |
| Deployment | 1 hour |
| **Total** | **~15 hours** |

---

## 💡 Pro Tips

1. **Use Postman** - Test backend APIs before frontend
2. **DevTools** - Use browser DevTools for debugging
3. **Hot Reload** - Both Vite and Express support it
4. **React DevTools** - Install browser extension for debugging
5. **MongoDB Compass** - Visual database management tool
6. **Git** - Commit frequently during development
7. **Comments** - Document complex logic
8. **Tests** - Write tests as you build

---

## 🚦 Status Indicators

✅ **Green** - Ready to use  
🟡 **Yellow** - Needs configuration  
🔴 **Red** - Not set up  

### Current Status
- ✅ Backend structure
- ✅ Frontend structure
- ✅ Database models
- ✅ Authentication setup
- ✅ API services
- ✅ UI components
- 🟡 Pages (partially done)
- 🟡 Integration testing
- 🔴 Deployment

---

## 📞 Need Help?

1. Check documentation files
2. Review code comments
3. Check error messages
4. Google the error
5. Check Stack Overflow
6. Ask in communities

---

**Setup Complete! Happy Coding! 🎉**

Last verified: November 27, 2025

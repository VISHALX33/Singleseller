# 🚀 Frontend Quick Start Guide

## Initial Setup (Already Completed ✓)

The frontend has been fully set up with all necessary dependencies and configurations:

### ✅ Installed Dependencies
- React 19
- React Router DOM v7
- Axios (HTTP client)
- React Hot Toast (notifications)
- Tailwind CSS v4
- PostCSS & Autoprefixer

### ✅ Created Folder Structure
```
src/
├── components/   (7 reusable components)
├── pages/        (2 page components)
├── context/      (Auth & Cart contexts)
├── services/     (API service layer)
├── utils/        (Helper functions)
└── assets/       (Images, icons)
```

### ✅ Configured Files
- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS setup with custom colors
- `postcss.config.js` - PostCSS plugins
- `.env` - Environment variables
- `.gitignore` - Git ignore rules

---

## 🏃 Running the Frontend

### Start Development Server
```bash
cd frontend
npm run dev
```
✅ Server runs on: `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Run Linter
```bash
npm run lint
```

---

## 📁 Component Overview

### Available Components

| Component | Purpose | Usage |
|-----------|---------|-------|
| **Button** | Reusable button with variants | Primary, secondary, outline, danger |
| **Input** | Form input with error handling | Text, email, password, etc. |
| **ProductCard** | Display product information | Show in grid on Products page |
| **LoadingSpinner** | Loading indicator | Show during API calls |
| **Alert** | Show alert messages | Success, error, warning, info |
| **Header** | Navigation header | Logo, links, cart, auth |
| **Footer** | Footer section | Links, newsletter, social |

### Available Pages

| Page | Route | Purpose |
|------|-------|---------|
| **HomePage** | `/` | Landing page with hero section |
| **ProductsPage** | `/products` | Display all products |

---

## 🎨 Styling with Tailwind CSS

### Color Palette

**Primary Colors:**
- Primary: `#21808d` (Teal) - Use class `text-primary-500`, `bg-primary-500`
- Cream: `#fcfcf9` - Use class `bg-background-light`
- Slate: `#134252` - Use class `text-slate`

### Common Tailwind Classes

```jsx
// Text
<p className="text-primary-500">Primary text</p>
<p className="text-slate">Main text</p>

// Background
<div className="bg-background-light">Light background</div>
<div className="bg-primary-500">Primary background</div>

// Spacing
<div className="p-4">Padding</div>
<div className="m-4">Margin</div>

// Layout
<div className="flex items-center justify-between">Flexbox</div>
<div className="grid grid-cols-3">Grid</div>

// Responsive
<div className="hidden md:block">Hidden on mobile, visible on desktop</div>
```

---

## 🔗 API Integration

### Backend URL Configuration
Environment variable in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Making API Calls

**Example - Get Products:**
```jsx
import productService from '../services/productService';

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data.data);
    } catch (error) {
      console.error(error);
    }
  };
  fetchProducts();
}, []);
```

### Available Services

1. **authService** - Login, register, logout, profile
2. **productService** - Get/create/update/delete products
3. **orderService** - Manage orders

---

## 🔐 Authentication

### Using Auth Context

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return <div>Welcome, {user.name}</div>;
}
```

---

## 🛒 Shopping Cart

### Using Cart Context

```jsx
import { useCart } from '../context/CartContext';

function ProductCard() {
  const { addToCart, cartItems, cartTotal } = useCart();

  return (
    <button onClick={() => addToCart(product)}>
      Add to Cart
    </button>
  );
}
```

**Available Methods:**
- `addToCart(product, quantity)` - Add item to cart
- `removeFromCart(productId)` - Remove item
- `updateQuantity(productId, quantity)` - Update quantity
- `clearCart()` - Clear entire cart
- `cartItems` - Array of cart items
- `cartTotal` - Total price
- `itemCount` - Number of items

---

## 📝 Adding New Features

### 1. Create a New Page

Create `src/pages/MyPage.jsx`:
```jsx
function MyPage() {
  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Your content */}
      </div>
    </div>
  );
}

export default MyPage;
```

Add route in `App.jsx`:
```jsx
<Route path="/my-page" element={<MyPage />} />
```

### 2. Create a New Component

Create `src/components/MyComponent.jsx`:
```jsx
function MyComponent({ prop1, prop2 }) {
  return (
    <div className="bg-white rounded-lg p-4">
      {/* Your component */}
    </div>
  );
}

export default MyComponent;
```

### 3. Create a New API Service

Create `src/services/myService.js`:
```jsx
import api from './api';

const myService = {
  getAll: async () => {
    const response = await api.get('/endpoint');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/endpoint', data);
    return response.data;
  },
};

export default myService;
```

### 4. Add Helper Functions

Add to `src/utils/helpers.js`:
```jsx
export const myHelperFunction = (input) => {
  // Your logic
  return output;
};
```

---

## 🧪 Testing Components

### Using React Developer Tools
- Install [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/) extension
- Inspect components, check props, state

### Testing API Calls
- Check Network tab in DevTools
- Verify API response format
- Check localStorage for tokens

---

## 🐛 Common Issues & Solutions

### Issue: Port 5173 Already in Use
**Solution:**
```bash
npm run dev -- --port 3000
```

### Issue: Changes Not Reflecting
**Solution:**
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Restart dev server

### Issue: Import Errors
**Solution:**
- Check file paths are correct
- Ensure files exist in correct directories
- Use relative paths from current file

### Issue: Tailwind Classes Not Working
**Solution:**
- Ensure class name is spelled correctly
- Check Tailwind documentation for available classes
- Rebuild styles if needed

---

## 📚 File Templates

### Page Template
```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function PageName() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch data
  }, []);

  return (
    <div className="min-h-screen bg-background-light py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Your content */}
      </div>
    </div>
  );
}

export default PageName;
```

### Component Template
```jsx
import PropTypes from 'prop-types';

function ComponentName({ prop1, prop2 }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Your component */}
    </div>
  );
}

ComponentName.propTypes = {
  prop1: PropTypes.string,
  prop2: PropTypes.number,
};

export default ComponentName;
```

---

## 🔗 Useful Resources

- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **React Router**: https://reactrouter.com
- **Axios**: https://axios-http.com
- **Vite**: https://vitejs.dev

---

## ✅ Next Steps

1. **Start the backend server** (port 5000)
2. **Start the frontend dev server** (port 5173)
3. **Create more pages** as needed
4. **Add authentication pages** (login, register, profile)
5. **Build shopping flow** (cart, checkout)
6. **Add admin dashboard** for product management

---

**Happy coding! 🎉**

# SingleSeller Frontend - React.js + Vite + Tailwind CSS

A modern, responsive React.js frontend for a single-seller ecommerce platform built with Vite and styled with Tailwind CSS.

## Features

✅ **Fast Development** - Vite for lightning-fast HMR  
✅ **Modern UI** - Tailwind CSS for utility-first styling  
✅ **State Management** - React Context API for global state  
✅ **Routing** - React Router v6 for navigation  
✅ **API Integration** - Axios with interceptors for API calls  
✅ **Notifications** - React Hot Toast for user feedback  
✅ **Responsive Design** - Mobile-first approach  
✅ **Authentication** - JWT token management  
✅ **Shopping Cart** - Context-based cart management  

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Alert.jsx
│   ├── Button.jsx
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── Input.jsx
│   ├── LoadingSpinner.jsx
│   └── ProductCard.jsx
├── pages/            # Route pages
│   ├── HomePage.jsx
│   └── ProductsPage.jsx
├── context/          # React Context providers
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── services/         # API services
│   ├── api.js        # Axios instance with interceptors
│   ├── authService.js
│   ├── orderService.js
│   └── productService.js
├── utils/            # Helper functions
│   └── helpers.js
├── assets/           # Images, icons, etc.
├── App.jsx           # Main app component
├── App.css           # App styles
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup Steps

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies** (already done if using this project)
```bash
npm install
```

3. **Configure environment variables**
Create `.env` file with:
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start development server**
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

## Available Scripts

### `npm run dev`
Starts the development server with hot reload

### `npm run build`
Builds the project for production

### `npm run preview`
Preview the production build locally

### `npm run lint`
Run ESLint to check code quality

## Color Scheme

The application uses a professional teal and slate color palette:

- **Primary Teal**: `#21808d` - Main brand color
- **Cream Background**: `#fcfcf9` - Light, warm background
- **Slate Text**: `#134252` - Primary text color
- **Gray Scale**: For secondary elements and borders

## Key Configurations

### Tailwind CSS (`tailwind.config.js`)
- Extended color palette with primary color variants
- Configured content paths for purging
- Custom font family settings

### PostCSS (`postcss.config.js`)
- Tailwind CSS integration
- Autoprefixer for vendor prefixes

### Vite (`vite.config.js`)
- React plugin configured
- Fast refresh enabled

## API Integration

The frontend uses Axios for API communication with the backend:

### Features:
- **Base URL**: Configured from `VITE_API_URL` environment variable
- **Request Interceptor**: Automatically adds JWT token to headers
- **Response Interceptor**: Handles 401/403/500 errors
- **Token Management**: Stored in localStorage

### Service Files:
- `authService.js` - Authentication endpoints
- `productService.js` - Product CRUD operations
- `orderService.js` - Order management
- `api.js` - Axios instance and interceptors

## State Management

### AuthContext
Manages user authentication state globally:
```javascript
const { user, isAuthenticated, login, logout } = useAuth();
```

### CartContext
Manages shopping cart state with localStorage persistence:
```javascript
const { cartItems, addToCart, removeFromCart } = useCart();
```

## Component Examples

### Button Component
```jsx
<Button variant="primary" size="md" loading={false}>
  Click Me
</Button>
```
Variants: `primary`, `secondary`, `outline`, `danger`  
Sizes: `sm`, `md`, `lg`

### Input Component
```jsx
<Input 
  label="Email" 
  type="email"
  placeholder="Enter email"
  error={error}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Product Card Component
```jsx
<ProductCard product={product} />
```

## Utility Functions

Helper functions for common operations in `utils/helpers.js`:
- `formatCurrency()` - Format numbers as currency
- `formatDate()` - Format dates
- `validateEmail()` - Email validation
- `debounce()` - Debounce function calls
- `truncateText()` - Truncate long strings

## Development Workflow

1. **Create components** in `src/components/`
2. **Create pages** in `src/pages/`
3. **Add API services** in `src/services/`
4. **Create contexts** in `src/context/` for global state
5. **Use utilities** from `utils/helpers.js`

## Best Practices

✅ Use Context API for global state instead of prop drilling  
✅ Create reusable components in `components/` directory  
✅ Keep API calls in service files  
✅ Use descriptive component and file names  
✅ Add proper error handling  
✅ Use Tailwind CSS utilities for styling  
✅ Implement responsive design from mobile-first  

## Performance Optimization

- Code splitting with React Router
- Lazy loading for components
- Image optimization
- CSS purging with Tailwind

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port 5173 already in use
```bash
npm run dev -- --port 3000
```

### Clear cache and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
npm run lint  # Check for linting issues
npm run build # Try building again
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

## Contributing

When adding new features:
1. Follow the existing folder structure
2. Create reusable components
3. Add proper error handling
4. Write clear comments
5. Test responsiveness

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)

## License

MIT License - See LICENSE file for details

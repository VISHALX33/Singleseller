import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Orders from './pages/Orders.jsx';
import OrderDetail from './pages/OrderDetail.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import AdminProducts from './pages/admin/Products.jsx';
import AddProduct from './pages/admin/AddProduct.jsx';
import EditProduct from './pages/admin/EditProduct.jsx';
import AdminOrders from './pages/admin/Orders.jsx';
import AdminOrderDetail from './pages/admin/OrderDetail.jsx';
import AdminCategories from './pages/admin/Categories.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Profile from './pages/auth/Profile.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AppProvider } from './context/AppContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProductProvider } from './context/ProductContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import CategoryProducts from './pages/CategoryProducts.jsx';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
        <AppProvider>
        <BrowserRouter>
          <Navbar />
          <main className="max-w-6xl mx-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
              <Route path="/category/:id" element={<CategoryProducts />} />
              <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
              <Route path="/admin/products/add" element={<AdminRoute><AddProduct /></AdminRoute>} />
              <Route path="/admin/products/edit/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetail /></AdminRoute>} />
              <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </main>
          <Toaster position="top-right" />
        </BrowserRouter>
        </AppProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;

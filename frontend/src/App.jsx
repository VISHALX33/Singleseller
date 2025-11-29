/**
 * App.jsx - Main Application Component
 * Sets up routing and global providers
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import AdminRoute from './components/AdminRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryProductsPage from './pages/CategoryProductsPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';
// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminAddProduct from './pages/admin/AddProduct';
import AdminEditProduct from './pages/admin/EditProduct';
import AdminOrders from './pages/admin/Orders';
import AdminOrderDetail from './pages/admin/OrderDetail';
import AdminCategories from './pages/admin/Categories';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            <div className="flex flex-col min-h-screen bg-background-light">
              {/* Header - Hidden on Admin Pages */}
              <Header />

              {/* Main Content */}
              <main className="grow">
                <Routes>
                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />

                  {/* Customer Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:slug" element={<ProductDetailPage />} />
                  <Route path="/categories/:slug/products" element={<CategoryProductsPage />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/:id" element={<OrderDetail />} />

                  {/* Admin Routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <AdminRoute>
                        <AdminProducts />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/products/add"
                    element={
                      <AdminRoute>
                        <AdminAddProduct />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/products/edit/:id"
                    element={
                      <AdminRoute>
                        <AdminEditProduct />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <AdminRoute>
                        <AdminOrders />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/orders/:id"
                    element={
                      <AdminRoute>
                        <AdminOrderDetail />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/categories"
                    element={
                      <AdminRoute>
                        <AdminCategories />
                      </AdminRoute>
                    }
                  />
                </Routes>
              </main>

              {/* Footer */}
              <Footer />

              {/* Toast Notifications */}
              <Toaster
                position="bottom-right"
                reverseOrder={false}
                gutter={8}
                toastOptions={{
                  duration: 4000,
                }}
              />
            </div>
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;


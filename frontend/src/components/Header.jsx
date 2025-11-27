/**
 * Navigation Header Component
 */
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from './Button';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-primary-500">SingleSeller</div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/products"
            className="text-slate hover:text-primary-500 transition-colors"
          >
            Products
          </Link>
          <Link
            to="/about"
            className="text-slate hover:text-primary-500 transition-colors"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-slate hover:text-primary-500 transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Cart Link */}
          <Link
            to="/cart"
            className="relative text-slate hover:text-primary-500 transition-colors"
          >
            <span className="text-2xl">🛒</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-slate">Welcome, {user?.name}</span>
              <Link to="/profile">
                <Button variant="secondary" size="sm">
                  Profile
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="secondary" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

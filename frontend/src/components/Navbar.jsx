import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import UserMenu from './UserMenu.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  return (
    <header className="bg-white border-b border-slate/10 sticky top-0 z-10">
      <nav className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-xl font-semibold text-primary">SingleSeller</Link>
        <div className="flex items-center gap-4">
          <NavLink className={({isActive}) => isActive ? 'text-primary font-medium' : 'text-slate'} to="/products">Products</NavLink>
          <NavLink className={({isActive}) => isActive ? 'text-primary font-medium' : 'text-slate'} to="/cart">Cart ({itemCount})</NavLink>
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <>
              <NavLink className={({isActive}) => isActive ? 'text-primary font-medium' : 'text-slate'} to="/login">Login</NavLink>
              <NavLink className={({isActive}) => isActive ? 'text-primary font-medium' : 'text-slate'} to="/register">Register</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

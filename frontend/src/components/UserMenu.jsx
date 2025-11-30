import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-2 px-3 py-2 rounded border border-primary text-primary hover:bg-primary hover:text-white transition">
        {user?.avatar ? <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" /> : <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{user?.name?.[0] || 'U'}</span>}
        <span className="hidden sm:inline">{user?.name}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate/10 rounded shadow z-20">
          <Link to="/profile" className="block px-4 py-2 hover:bg-primary/10">Profile</Link>
          <Link to="/orders" className="block px-4 py-2 hover:bg-primary/10">Orders</Link>
          <button onClick={() => { logout(); setOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-primary/10">Logout</button>
        </div>
      )}
    </div>
  );
}

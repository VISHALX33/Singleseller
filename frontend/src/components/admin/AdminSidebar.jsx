import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/categories', label: 'Categories' }
];

export default function AdminSidebar() {
  return (
    <aside className='bg-white border-r hidden md:flex flex-col p-4 gap-4'>
      <div className='text-lg font-semibold text-primary'>Admin</div>
      <nav className='flex flex-col gap-2'>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} className={({isActive}) => `px-3 py-2 rounded text-sm ${isActive? 'bg-primary text-white':'hover:bg-slate-100 text-slate-700'}`}>{l.label}</NavLink>
        ))}
      </nav>
    </aside>
  );
}

import AdminSidebar from './AdminSidebar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLayout({ children }) {
  const { user } = useAuth();
  return (
    <div className='min-h-screen grid md:grid-cols-[220px_1fr]'>
      <AdminSidebar />
      <div className='bg-slate-50 flex flex-col'>
        <header className='flex justify-between items-center px-6 py-4 bg-white border-b'>
          <h1 className='text-xl font-semibold text-primary'>Admin Dashboard</h1>
          <div className='text-sm text-slate-600'>Logged in as <span className='font-medium'>{user?.name} ({user?.role})</span></div>
        </header>
        <main className='p-6 flex-1'>{children}</main>
      </div>
    </div>
  );
}

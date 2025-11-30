import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { adminListCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '../../services/adminService.js';
import toast from 'react-hot-toast';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [parent, setParent] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const list = await adminListCategories(); setCategories(list); } catch {} finally { setLoading(false); }
  };
  useEffect(()=>{ load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    try { const c = await adminCreateCategory({ name, parent: parent||null }); toast.success('Category created'); setName(''); setParent(''); load(); } catch {}
  };

  const update = async (id) => {
    const newName = prompt('New name?');
    if (!newName) return;
    try { await adminUpdateCategory(id, { name: newName }); toast.success('Updated'); load(); } catch {}
  };

  const remove = async (id) => {
    if (!confirm('Delete category?')) return;
    try { await adminDeleteCategory(id); toast.success('Deleted'); load(); } catch {}
  };

  return (
    <AdminLayout>
      <h2 className='text-xl font-semibold text-primary mb-4'>Categories</h2>
      <form onSubmit={create} className='flex gap-2 mb-6'>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder='Name' className='border rounded px-3 py-2 text-sm' required />
        <select value={parent} onChange={e=>setParent(e.target.value)} className='border rounded px-3 py-2 text-sm w-48'>
          <option value=''>No Parent</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <button className='btn-primary text-sm'>Add</button>
      </form>
      {loading && <p className='text-slate'>Loading...</p>}
      <ul className='space-y-2'>
        {categories.map(c => (
          <li key={c._id} className='flex justify-between items-center border rounded p-3 bg-white'>
            <div className='flex flex-col'>
              <span className='font-medium'>{c.name}</span>
              {c.parent && <span className='text-xs text-slate-500'>Parent: {c.parent.name || c.parent}</span>}
            </div>
            <div className='flex gap-3 text-xs'>
              <button onClick={()=>update(c._id)} className='text-primary'>Edit</button>
              <button onClick={()=>remove(c._id)} className='text-red-600'>Delete</button>
            </div>
          </li>
        ))}
        {categories.length===0 && !loading && <li className='text-slate-500'>No categories.</li>}
      </ul>
    </AdminLayout>
  );
}

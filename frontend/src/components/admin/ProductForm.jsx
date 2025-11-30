import { useState, useEffect } from 'react';
import ImageUploadPreview from './ImageUploadPreview.jsx';

export default function ProductForm({ initial={}, onSubmit, submitting }) {
  const [form, setForm] = useState({ title:'', price:'', stock:'', description:'', status:'active', ...initial });
  const [images, setImages] = useState([]);

  useEffect(()=>{ setForm(f=>({ ...f, ...initial })); }, [initial]);

  const change = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    const out = { ...form, price: Number(form.price), stock: Number(form.stock), images };
    onSubmit(out);
  };

  return (
    <form onSubmit={submit} className='space-y-4'>
      <div className='grid md:grid-cols-2 gap-4'>
        <div className='flex flex-col'>
          <label className='text-xs font-medium mb-1'>Title</label>
          <input name='title' value={form.title} onChange={change} className='border rounded px-3 py-2' required />
        </div>
        <div className='flex flex-col'>
          <label className='text-xs font-medium mb-1'>Price</label>
          <input name='price' type='number' value={form.price} onChange={change} className='border rounded px-3 py-2' required />
        </div>
        <div className='flex flex-col'>
          <label className='text-xs font-medium mb-1'>Stock</label>
          <input name='stock' type='number' value={form.stock} onChange={change} className='border rounded px-3 py-2' required />
        </div>
        <div className='flex flex-col'>
          <label className='text-xs font-medium mb-1'>Status</label>
          <select name='status' value={form.status} onChange={change} className='border rounded px-3 py-2'>
            <option value='active'>Active</option>
            <option value='inactive'>Inactive</option>
          </select>
        </div>
        <div className='md:col-span-2 flex flex-col'>
          <label className='text-xs font-medium mb-1'>Description</label>
          <textarea name='description' value={form.description} onChange={change} rows={4} className='border rounded px-3 py-2' />
        </div>
        <div className='md:col-span-2'>
          <label className='text-xs font-medium mb-1 block'>Images</label>
          <ImageUploadPreview onChange={setImages} />
        </div>
      </div>
      <button disabled={submitting} className='btn-primary disabled:opacity-50'>{submitting? 'Saving...':'Save Product'}</button>
    </form>
  );
}

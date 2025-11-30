import { useState } from 'react';

export default function ImageUploadPreview({ onChange }) {
  const [files, setFiles] = useState([]);

  const handle = e => {
    const selected = Array.from(e.target.files || []);
    const next = [...files, ...selected];
    setFiles(next);
    onChange(next);
  };

  const remove = (idx) => {
    const next = files.filter((_,i)=>i!==idx);
    setFiles(next);
    onChange(next);
  };

  return (
    <div className='space-y-2'>
      <input type='file' multiple accept='image/*' onChange={handle} />
      <div className='flex gap-2 flex-wrap'>
        {files.map((f,i)=>(
          <div key={i} className='relative'>
            <img src={URL.createObjectURL(f)} alt='' className='h-20 w-20 object-cover rounded border' />
            <button type='button' onClick={()=>remove(i)} className='absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5'>×</button>
          </div>
        ))}
        {files.length===0 && <p className='text-xs text-slate-500'>No images selected.</p>}
      </div>
    </div>
  );
}

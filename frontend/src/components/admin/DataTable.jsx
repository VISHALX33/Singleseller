import { useState, useMemo } from 'react';

export default function DataTable({ columns, data, pageSize=10 }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(data.length / pageSize) || 1;
  const slice = useMemo(()=> data.slice((page-1)*pageSize, page*pageSize), [data, page, pageSize]);
  return (
    <div className='space-y-4'>
      <div className='overflow-auto border rounded bg-white'>
        <table className='min-w-full text-sm'>
          <thead className='bg-slate-100 text-slate-600'>
            <tr>{columns.map(c => <th key={c.key} className='text-left p-2 font-medium'>{c.label}</th>)}</tr>
          </thead>
          <tbody>
            {slice.map((row,i)=>(
              <tr key={i} className='border-t hover:bg-slate-50'>
                {columns.map(c => <td key={c.key} className='p-2'>{c.render? c.render(row): row[c.key]}</td>)}
              </tr>
            ))}
            {slice.length===0 && <tr><td colSpan={columns.length} className='p-4 text-center text-slate-500'>No data</td></tr>}
          </tbody>
        </table>
      </div>
      <div className='flex justify-between items-center text-xs'>
        <span>Page {page} / {totalPages}</span>
        <div className='flex gap-2'>
          <button disabled={page===1} onClick={()=>setPage(p=>p-1)} className='px-2 py-1 border rounded disabled:opacity-40'>Prev</button>
          <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)} className='px-2 py-1 border rounded disabled:opacity-40'>Next</button>
        </div>
      </div>
    </div>
  );
}

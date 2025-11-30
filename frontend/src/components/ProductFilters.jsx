import { useProducts } from '../context/ProductContext.jsx';
import { useEffect, useState } from 'react';

export default function ProductFilters() {
  const { categories, filters, updateFilter } = useProducts();
  const [price, setPrice] = useState({ min: filters.minPrice || '', max: filters.maxPrice || '' });

  function applyPrice() {
    updateFilter('minPrice', price.min);
    updateFilter('maxPrice', price.max);
  }

  useEffect(() => {
    // reset local when filters changed externally
    setPrice({ min: filters.minPrice || '', max: filters.maxPrice || '' });
  }, [filters.minPrice, filters.maxPrice]);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2 text-slate">Category</h4>
        <select
          value={filters.category}
          onChange={e => updateFilter('category', e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">All</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <h4 className="font-semibold mb-2 text-slate">Price Range</h4>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={price.min} onChange={e => setPrice(p => ({ ...p, min: e.target.value }))} className="w-1/2 border rounded px-2 py-2" />
          <input type="number" placeholder="Max" value={price.max} onChange={e => setPrice(p => ({ ...p, max: e.target.value }))} className="w-1/2 border rounded px-2 py-2" />
        </div>
        <button onClick={applyPrice} className="mt-2 btn-primary w-full">Apply</button>
      </div>
      <div>
        <h4 className="font-semibold mb-2 text-slate">Stock</h4>
        <select
          value={filters.status}
          onChange={e => updateFilter('status', e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>
      <button
        onClick={() => {
          updateFilter('category', '');
          updateFilter('minPrice', '');
          updateFilter('maxPrice', '');
          updateFilter('status', '');
          updateFilter('q', '');
        }}
        className="text-xs text-primary underline"
      >Clear Filters</button>
    </div>
  );
}

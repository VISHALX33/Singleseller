import { useEffect, useState } from 'react';
import { useProducts } from '../context/ProductContext.jsx';

export default function SearchBar() {
  const { updateFilter, filters } = useProducts();
  const [localQ, setLocalQ] = useState(filters.q || '');

  useEffect(() => {
    const id = setTimeout(() => {
      if (localQ !== filters.q) {
        updateFilter('q', localQ);
      }
    }, 400);
    return () => clearTimeout(id);
  }, [localQ]);

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search products..."
        value={localQ}
        onChange={e => setLocalQ(e.target.value)}
        className="w-full border rounded px-3 py-2 focus:outline-primary"
      />
    </div>
  );
}

import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useProducts } from '../context/ProductContext.jsx';
import ProductGrid from '../components/ProductGrid.jsx';

export default function CategoryProducts() {
  const { id } = useParams();
  const { updateFilter, filters, categories } = useProducts();

  useEffect(() => {
    // Set category filter to id
    if (id !== filters.category) {
      updateFilter('category', id);
    }
  }, [id]);

  const cat = categories.find(c => c._id === id);

  return (
    <div className="space-y-6 py-6">
      <h2 className="text-2xl font-semibold text-primary">{cat ? cat.name : 'Category'}</h2>
      <ProductGrid />
    </div>
  );
}

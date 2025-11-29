import SearchBar from '../components/SearchBar.jsx';
import ProductFilters from '../components/ProductFilters.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import { useProducts } from '../context/ProductContext.jsx';

export default function Products() {
  const { pagination, setPage } = useProducts();
  const totalPages = Math.ceil((pagination.total || 0) / pagination.limit) || 1;
  return (
    <div className="md:grid md:grid-cols-4 gap-8">
      <aside className="md:col-span-1 mb-6 md:mb-0">
        <ProductFilters />
      </aside>
      <div className="md:col-span-3 space-y-4">
        <SearchBar />
        <ProductGrid />
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded border ${pagination.page === i + 1 ? 'bg-primary text-white border-primary' : 'border-slate/20 hover:bg-primary/10'}`}
            >{i + 1}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

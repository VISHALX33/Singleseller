import ProductCard from './ProductCard.jsx';
import Loader from './Loader.jsx';
import { useProducts } from '../context/ProductContext.jsx';

function Skeleton() {
  return (
    <div className="card animate-pulse h-64" />
  );
}

export default function ProductGrid() {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)}
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return <p className="text-slate">No products match your criteria.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {products.map(p => <ProductCard key={p._id} product={p} />)}
    </div>
  );
}

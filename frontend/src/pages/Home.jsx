import { useProducts } from '../../src/context/ProductContext.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import CategoryGrid from '../components/CategoryGrid.jsx';

export default function Home() {
  const { products } = useProducts();
  const featured = products.slice(0, 6);
  return (
    <div className="space-y-10 py-6">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">SingleSeller Store</h1>
        <p className="text-slate max-w-xl mx-auto">Discover quality products from a single trusted seller. Fast shipping, secure checkout, and responsive support.</p>
        <div className="flex justify-center gap-3">
          <a href="/products" className="btn-primary">Shop Products</a>
          <a href="#categories" className="px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition">Categories</a>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-primary mb-4">Featured Products</h2>
        {featured.length ? <div className="grid gap-4 md:grid-cols-3">{featured.map(p => <ProductGrid key={p._id} product={p} />)}</div> : <p className="text-slate">No featured products available.</p>}
      </section>
      <section id="categories">
        <h2 className="text-2xl font-semibold text-primary mb-4">Browse Categories</h2>
        <CategoryGrid />
      </section>
    </div>
  );
}

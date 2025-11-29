import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProductById, getAllProducts } from '../services/productService.js';
import formatPrice from '../utils/formatPrice.js';
import Loader from '../components/Loader.jsx';
import ProductImageGallery from '../components/ProductImageGallery.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart, cartItems } = useCart();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data.product || data.data || data); // flexible backend shape
        // Similar products fetch (same category) limited
        if (data.product?.category) {
          const similarRes = await getAllProducts({ category: data.product.category, limit: 4 });
          setSimilar((similarRes.products || []).filter(p => p._id !== id));
        }
      } catch (e) {
        // handled globally by interceptor
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return <p className="text-slate">Product not found.</p>;
  const inCart = cartItems.find(i => i.product?._id === product._id);

  return (
    <div className="space-y-10">
      <article className="grid md:grid-cols-2 gap-8">
        <ProductImageGallery product={product} />
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-primary">{product.title || product.name}</h2>
          <div className="flex items-center gap-3">
            <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
            {product.discountPercent ? <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">-{product.discountPercent}%</span> : null}
          </div>
          <p className="text-slate whitespace-pre-line">{product.description || 'No description.'}</p>
          {product.stock === 0 && <p className="text-red-600 font-medium">Out of Stock</p>}
          <button disabled={product.stock === 0} onClick={() => addToCart(product._id, 1)} className="btn-primary w-fit disabled:opacity-50">
            {product.stock === 0 ? 'Out of Stock' : inCart ? `In Cart (${inCart.quantity})` : 'Add to Cart'}
          </button>
        </div>
      </article>
      {similar.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold text-primary mb-4">Similar Products</h3>
          <div className="grid gap-4 md:grid-cols-4">
            {similar.map(sp => <ProductCard key={sp._id} product={sp} />)}
          </div>
        </section>
      )}
    </div>
  );
}

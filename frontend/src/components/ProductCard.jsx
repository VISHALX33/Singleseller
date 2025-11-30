import { Link } from 'react-router-dom';
import formatPrice from '../utils/formatPrice.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart();
  const inCart = cartItems.find(i => i.product?._id === product._id);
  const localAsset = product.slug ? `/assets/${product.slug}.svg` : '/placeholder.svg';
  return (
    <div className="card flex flex-col gap-2">
      <img src={product.thumbnail || product.image || localAsset} alt={product.title || product.name} className="h-40 object-cover rounded" />
      <h3 className="font-medium text-slate">{product.title || product.name}</h3>
      <p className="text-primary font-semibold">{formatPrice(product.price)}</p>
      <div className="flex gap-2 mt-auto">
        <button disabled={product.stock===0} onClick={() => addToCart(product._id, 1)} className="btn-primary flex-1 disabled:opacity-50">
          {product.stock===0 ? 'Out' : inCart ? `In Cart (${inCart.quantity})` : 'Add'}
        </button>
        <Link to={`/products/${product._id}`} className="px-3 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition">View</Link>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';

export default function EmptyCart() {
  return (
    <div className="card text-center py-10">
      <p className="text-slate mb-4">Your cart is empty.</p>
      <Link to="/products" className="btn-primary inline-block">Continue Shopping</Link>
    </div>
  );
}

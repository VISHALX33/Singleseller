import { useCart } from '../context/CartContext.jsx';
import CartItem from '../components/CartItem.jsx';
import CartSummary from '../components/CartSummary.jsx';
import EmptyCart from '../components/EmptyCart.jsx';

export default function Cart() {
  const { cartItems, loading } = useCart();
  if (loading) return <p className='text-slate'>Loading cart...</p>;
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary">Your Cart</h2>
      {cartItems.length === 0 ? <EmptyCart /> : (
        <div className='grid md:grid-cols-3 gap-8'>
          <div className='md:col-span-2'>
            <div className='hidden md:grid grid-cols-12 gap-4 text-xs font-medium uppercase tracking-wide text-slate-500 border-b pb-2'>
              <span className='col-span-2'>Image</span>
              <span className='col-span-4'>Product</span>
              <span className='col-span-2'>Price</span>
              <span className='col-span-2'>Qty</span>
              <span className='col-span-1'>Subtotal</span>
              <span className='col-span-1'>Remove</span>
            </div>
            {cartItems.map(it => <CartItem key={it.itemId} item={it} />)}
          </div>
          <CartSummary />
        </div>
      )}
    </section>
  );
}

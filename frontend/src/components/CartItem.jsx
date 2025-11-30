import formatPrice from '../utils/formatPrice.js';
import { useCart } from '../context/CartContext.jsx';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();
  const p = item.product || {};
  return (
    <div className="grid grid-cols-12 gap-4 items-center border-b py-3">
      <div className="col-span-2">
        <img src={p.thumbnail || '/placeholder.svg'} alt={p.title || p.name} className="h-16 w-16 object-cover rounded" />
      </div>
      <div className="col-span-4 flex flex-col">
        <span className="font-medium text-slate-800">{p.title || p.name || 'Product'}</span>
        <span className="text-xs text-slate-500">Stock: {p.stock ?? '-'}</span>
      </div>
      <div className="col-span-2 text-sm font-semibold text-primary">{formatPrice(item.unitPrice || 0)}</div>
      <div className="col-span-2 flex items-center gap-2">
        <input type="number" min={1} value={item.quantity} onChange={e => updateQuantity(item.itemId, parseInt(e.target.value)||1)} className="w-16 px-2 py-1 border rounded" />
      </div>
      <div className="col-span-1 font-semibold">{formatPrice(item.lineSubtotal)}</div>
      <div className="col-span-1">
        <button onClick={() => removeItem(item.itemId)} className="text-red-600 hover:text-red-800" aria-label="Remove">✕</button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartItem({ item, isDesktop }) {
  const { updateQuantity, removeItem } = useCart();
  const [updating, setUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(true);
    try {
      await updateQuantity(item._id, newQuantity);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (window.confirm('Remove this item from cart?')) {
      setUpdating(true);
      try {
        await removeItem(item._id);
      } finally {
        setUpdating(false);
      }
    }
  };

  const total = (item.price * item.quantity).toFixed(2);

  if (isDesktop) {
    // Desktop table row view
    return (
      <tr className="hover:bg-gray-50">
        {/* Product Info */}
        <td className="px-6 py-4">
          <div className="flex gap-4">
            <img
              src={item.thumbnail || 'https://via.placeholder.com/80'}
              alt={item.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.category}</p>
            </div>
          </div>
        </td>

        {/* Price */}
        <td className="px-6 py-4">
          <p className="font-medium text-gray-900">₹{item.price.toFixed(2)}</p>
        </td>

        {/* Quantity */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={updating || item.quantity <= 1}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={updating}
              className="p-1 rounded hover:bg-gray-200"
            >
              <Plus size={16} />
            </button>
          </div>
        </td>

        {/* Total */}
        <td className="px-6 py-4">
          <p className="font-semibold text-gray-900">₹{total}</p>
        </td>

        {/* Action */}
        <td className="px-6 py-4 text-center">
          <button
            onClick={handleRemove}
            disabled={updating}
            className="text-red-600 hover:text-red-700 disabled:opacity-50 p-2"
          >
            <Trash2 size={18} />
          </button>
        </td>
      </tr>
    );
  }

  // Mobile card view
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex gap-3">
        <img
          src={item.thumbnail || 'https://via.placeholder.com/80'}
          alt={item.title}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{item.title}</h3>
          <p className="text-sm text-gray-600">{item.category}</p>
          <p className="font-semibold text-gray-900 mt-1">₹{item.price.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={updating || item.quantity <= 1}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={updating}
            className="p-1 rounded hover:bg-gray-200"
          >
            <Plus size={16} />
          </button>
        </div>
        <p className="font-semibold text-gray-900">₹{total}</p>
        <button
          onClick={handleRemove}
          disabled={updating}
          className="text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

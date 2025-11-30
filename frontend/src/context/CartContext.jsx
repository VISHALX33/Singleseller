import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getCart, addCartItem, updateCartItem, removeCartItem, clearCartApi } from '../services/cartService.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState([]); // {itemId, product, quantity, lineSubtotal}
  const [itemCount, setItemCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const mapCart = (cart) => {
    if (!cart) return [];
    return (cart.items || []).map(i => ({
      itemId: i._id,
      product: i.product,
      quantity: i.quantity,
      lineSubtotal: i.price * i.quantity,
      unitPrice: i.price
    }));
  };

  const recalcDerived = (items) => {
    setItemCount(items.reduce((s, it) => s + it.quantity, 0));
    setSubtotal(items.reduce((s, it) => s + it.lineSubtotal, 0));
  };

  const fetchCart = useCallback(async () => {
    if (!token) return; // only when logged in
    setLoading(true);
    try {
      const cart = await getCart();
      const mapped = mapCart(cart);
      setCartItems(mapped);
      recalcDerived(mapped);
    } catch (e) {
      // handled by interceptor
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!token) { toast.error('Please login to add to cart'); return; }
    // optimistic
    setCartItems(prev => {
      const existing = prev.find(p => p.product?._id === productId);
      let next;
      if (existing) {
        next = prev.map(p => p.product?._id === productId ? { ...p, quantity: p.quantity + quantity, lineSubtotal: (p.quantity + quantity) * p.unitPrice } : p);
      } else {
        next = [...prev, { itemId: 'temp-' + productId, product: { _id: productId }, quantity, lineSubtotal: 0, unitPrice: 0 }];
      }
      recalcDerived(next);
      return next;
    });
    try {
      const cart = await addCartItem(productId, quantity);
      const mapped = mapCart(cart);
      setCartItems(mapped);
      recalcDerived(mapped);
      toast.success('Added to cart');
    } catch (e) {
      fetchCart();
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    setCartItems(prev => {
      const next = prev.map(i => i.itemId === itemId ? { ...i, quantity, lineSubtotal: i.unitPrice * quantity } : i);
      recalcDerived(next);
      return next;
    });
    try {
      const cart = await updateCartItem(itemId, quantity);
      const mapped = mapCart(cart);
      setCartItems(mapped);
      recalcDerived(mapped);
    } catch (e) { fetchCart(); }
  };

  const removeItem = async (itemId) => {
    setCartItems(prev => {
      const next = prev.filter(i => i.itemId !== itemId);
      recalcDerived(next);
      return next;
    });
    try {
      const cart = await removeCartItem(itemId);
      const mapped = mapCart(cart);
      setCartItems(mapped);
      recalcDerived(mapped);
      toast.success('Removed');
    } catch (e) { fetchCart(); }
  };

  const clearCart = async () => {
    const backup = cartItems;
    setCartItems([]); setItemCount(0); setSubtotal(0);
    try {
      const cart = await clearCartApi();
      const mapped = mapCart(cart);
      setCartItems(mapped);
      recalcDerived(mapped);
      toast.success('Cart cleared');
    } catch (e) {
      setCartItems(backup); recalcDerived(backup);
    }
  };

  const value = {
    cartItems, itemCount, subtotal, loading,
    fetchCart, addToCart, updateQuantity, removeItem, clearCart
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { return useContext(CartContext); }

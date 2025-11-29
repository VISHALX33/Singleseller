import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchProducts } from '../services/products.js';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchProducts();
        setProducts(data || []);
      } catch (e) {
        // errors already toasted in service layer
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function addToCart(item) {
    setCart(prev => {
      const existing = prev.find(p => p._id === item._id);
      if (existing) {
        return prev.map(p => p._id === item._id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(p => p._id !== id));
  }

  const value = { products, cart, addToCart, removeFromCart, loading };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getAllProducts } from '../services/productService.js';
import { getCategories } from '../services/categoryService.js';
import toast from 'react-hot-toast';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0 });
  const [filters, setFilters] = useState({ q: '', category: '', minPrice: '', maxPrice: '', status: '', sort: '' });

  // Fetch categories once
  useEffect(() => {
    (async () => {
      try { setCategories(await getCategories()); } catch { /* ignore */ }
    })();
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await getAllProducts({
        page: pagination.page,
        limit: pagination.limit,
        q: filters.q,
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        status: filters.status
      });
      setProducts(data.products || []);
      setPagination(prev => ({ ...prev, total: data.total }));
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  function updateFilter(name, value) {
    setPagination(p => ({ ...p, page: 1 })); // reset page on filter change
    setFilters(f => ({ ...f, [name]: value }));
  }

  function setPage(page) { setPagination(p => ({ ...p, page })); }

  const value = {
    products,
    categories,
    loading,
    error,
    filters,
    pagination,
    updateFilter,
    setPage,
    refresh: fetchProducts
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() { return useContext(ProductContext); }

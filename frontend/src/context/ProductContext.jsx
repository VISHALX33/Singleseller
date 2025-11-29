/**
 * Product Context - Global product state management
 * Handles filters, search, pagination, and products list
 */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as productService from '../services/productService.js';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: Infinity,
    stock: '',
    sort: '-createdAt',
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  });

  // Categories
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  /**
   * Fetch products based on current filters
   */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: filters.page,
        limit: filters.limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.minPrice > 0 && { minPrice: filters.minPrice }),
        ...(filters.maxPrice !== Infinity && { maxPrice: filters.maxPrice }),
        ...(filters.stock && { stock: filters.stock }),
        ...(filters.sort && { sort: filters.sort }),
      };

      const response = await productService.getAllProducts(params);

      if (response.success) {
        setProducts(response.data);
        setPagination(response.pagination);
      } else {
        setError(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      console.error('Fetch products error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Fetch categories
   */
  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);

    try {
      const response = await productService.getAllCategories();

      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Fetch categories error:', err);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /**
   * Update filters
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to page 1 when filters change
    }));
  }, []);

  /**
   * Set search query
   */
  const setSearchQuery = useCallback((query) => {
    updateFilters({ search: query });
  }, [updateFilters]);

  /**
   * Set category filter
   */
  const setCategoryFilter = useCallback((categoryId) => {
    updateFilters({ category: categoryId });
  }, [updateFilters]);

  /**
   * Set price range
   */
  const setPriceRange = useCallback((minPrice, maxPrice) => {
    updateFilters({ minPrice, maxPrice });
  }, [updateFilters]);

  /**
   * Set stock filter
   */
  const setStockFilter = useCallback((stock) => {
    updateFilters({ stock });
  }, [updateFilters]);

  /**
   * Set sort
   */
  const setSortBy = useCallback((sort) => {
    updateFilters({ sort });
  }, [updateFilters]);

  /**
   * Go to page
   */
  const goToPage = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 12,
      search: '',
      category: '',
      minPrice: 0,
      maxPrice: Infinity,
      stock: '',
      sort: '-createdAt',
    });
  }, []);

  /**
   * Get featured products
   */
  const getFeatured = useCallback(async (limit = 8) => {
    try {
      const response = await productService.getFeaturedProducts(limit);
      return response.data || [];
    } catch (err) {
      console.error('Get featured error:', err);
      return [];
    }
  }, []);

  /**
   * Get product by ID
   */
  const getProductById = useCallback(async (productId) => {
    try {
      const response = await productService.getProductById(productId);
      return response.data;
    } catch (err) {
      throw err;
    }
  }, []);

  /**
   * Get product by slug
   */
  const getProductBySlug = useCallback(async (slug) => {
    try {
      const response = await productService.getProductBySlug(slug);
      return response.data;
    } catch (err) {
      throw err;
    }
  }, []);

  /**
   * Get category products
   */
  const getCategoryProducts = useCallback(async (categoryId, page = 1) => {
    try {
      const response = await productService.getProductsByCategory(categoryId, page, 12);
      return response;
    } catch (err) {
      throw err;
    }
  }, []);

  /**
   * Search products
   */
  const searchProducts = useCallback(async (query, limit = 5) => {
    try {
      const response = await productService.getAllProducts({
        search: query,
        limit: limit,
      });
      return {
        success: true,
        data: response.data || [],
      };
    } catch (err) {
      return {
        success: false,
        data: [],
        error: err.message,
      };
    }
  }, []);

  const value = {
    // Products
    products,
    loading,
    error,

    // Pagination
    pagination,

    // Categories
    categories,
    categoriesLoading,

    // Filters
    filters,
    updateFilters,
    setSearchQuery,
    setCategoryFilter,
    setPriceRange,
    setStockFilter,
    setSortBy,
    goToPage,
    clearFilters,

    // Methods
    fetchProducts,
    fetchCategories,
    getFeatured,
    getProductById,
    getProductBySlug,
    getCategoryProducts,
    searchProducts,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export default ProductContext;

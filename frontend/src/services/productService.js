/**
 * Product Service - API calls for product data
 * Handles getAllProducts, getProductById, search, filters, pagination
 */
import api from './api.js';

/**
 * Get all products with filters, search, and pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 12)
 * @param {string} params.search - Search query
 * @param {string} params.category - Category ID
 * @param {number} params.minPrice - Minimum price
 * @param {number} params.maxPrice - Maximum price
 * @param {string} params.stock - Stock status (in_stock, out_of_stock)
 * @param {string} params.sort - Sort field (default: -createdAt)
 * @returns {Promise} Products and pagination data
 */
export const getAllProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice);
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
    if (params.stock) queryParams.append('stock', params.stock);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.isFeatured) queryParams.append('isFeatured', params.isFeatured);

    const { data } = await api.get(`/products?${queryParams.toString()}`);
    return data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch products' };
  }
};

/**
 * Get single product by ID
 * @param {string} productId - Product ID
 * @returns {Promise} Product details
 */
export const getProductById = async (productId) => {
  try {
    const { data } = await api.get(`/products/${productId}`);
    return data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Product not found' };
  }
};

/**
 * Get product by slug (SEO-friendly URL)
 * @param {string} slug - Product slug
 * @returns {Promise} Product details
 */
export const getProductBySlug = async (slug) => {
  try {
    const { data } = await api.get(`/products/slug/${slug}`);
    return data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Product not found' };
  }
};

/**
 * Search products by query
 * @param {string} query - Search query (min 2 characters)
 * @param {number} limit - Results limit (default: 10)
 * @returns {Promise} Matching products
 */
export const searchProducts = async (query, limit = 10) => {
  try {
    if (!query || query.length < 2) {
      return { success: true, data: [] };
    }

    const { data } = await api.get(`/products/search/query`, {
      params: { q: query, limit },
    });
    return data;
  } catch (error) {
    console.error('Search error:', error.message);
    return { success: true, data: [] };
  }
};

/**
 * Get featured products
 * @param {number} limit - Number of products to fetch
 * @returns {Promise} Featured products
 */
export const getFeaturedProducts = async (limit = 8) => {
  try {
    const { data } = await api.get(`/products/featured?limit=${limit}`);
    return data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch featured products' };
  }
};

/**
 * Get products by category
 * @param {string} categoryId - Category ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} Category products
 */
export const getProductsByCategory = async (categoryId, page = 1, limit = 12) => {
  try {
    const { data } = await api.get(`/products/category/${categoryId}`, {
      params: { page, limit },
    });
    return data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch category products' };
  }
};

/**
 * Get all categories
 * @returns {Promise} All categories
 */
export const getAllCategories = async () => {
  try {
    const { data } = await api.get('/categories?active=true');
    return data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch categories' };
  }
};

/**
 * Get category by ID
 * @param {string} categoryId - Category ID
 * @returns {Promise} Category details
 */
export const getCategoryById = async (categoryId) => {
  try {
    const { data } = await api.get(`/categories/${categoryId}`);
    return data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Category not found' };
  }
};

/**
 * Get category by slug
 * @param {string} slug - Category slug
 * @returns {Promise} Category details
 */
export const getCategoryBySlug = async (slug) => {
  try {
    const { data } = await api.get(`/categories/slug/${slug}`);
    return data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Category not found' };
  }
};

export default {
  getAllProducts,
  getProductById,
  getProductBySlug,
  searchProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
};

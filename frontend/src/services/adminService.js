import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper to get auth token
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

/**
 * Admin Service - API calls for admin dashboard
 */

// ============ DASHBOARD ============
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_BASE}/admin/dashboard/stats`, {
      headers: getAuthHeader(),
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard stats');
  }
};

// ============ PRODUCTS ============
export const getProducts = async (page = 1, limit = 10, search = '', category = '') => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (search) params.append('search', search);
    if (category) params.append('category', category);

    const response = await axios.get(`${API_BASE}/admin/products?${params}`, {
      headers: getAuthHeader(),
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

export const createProduct = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE}/admin/products`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create product');
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/admin/products/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product');
  }
};

export const updateProduct = async (id, formData) => {
  try {
    const response = await axios.put(`${API_BASE}/admin/products/${id}`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update product');
  }
};

export const deleteProduct = async (id) => {
  try {
    await axios.delete(`${API_BASE}/admin/products/${id}`, {
      headers: getAuthHeader(),
    });
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete product');
  }
};

// ============ ORDERS ============
export const getOrders = async (page = 1, limit = 10, status = '', search = '') => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const response = await axios.get(`${API_BASE}/admin/orders?${params}`, {
      headers: getAuthHeader(),
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch orders');
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/admin/orders/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch order');
  }
};

export const updateOrderStatus = async (id, status, comment = '') => {
  try {
    const response = await axios.put(
      `${API_BASE}/admin/orders/${id}/status`,
      { status, comment },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update order status');
  }
};

// ============ CATEGORIES ============
export const getCategories = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `${API_BASE}/admin/categories?page=${page}&limit=${limit}`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch categories');
  }
};

export const createCategory = async (name, description = '') => {
  try {
    const response = await axios.post(
      `${API_BASE}/admin/categories`,
      { name, description },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create category');
  }
};

export const updateCategory = async (id, name, description = '') => {
  try {
    const response = await axios.put(
      `${API_BASE}/admin/categories/${id}`,
      { name, description },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update category');
  }
};

export const deleteCategory = async (id) => {
  try {
    await axios.delete(`${API_BASE}/admin/categories/${id}`, {
      headers: getAuthHeader(),
    });
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete category');
  }
};

export default {
  getDashboardStats,
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

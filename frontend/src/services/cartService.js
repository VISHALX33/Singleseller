import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const cartService = {
  // Get user's cart
  getCart: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch cart');
    }
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/cart`,
        { productId, quantity },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add item to cart');
    }
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/cart/${itemId}`,
        { quantity },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update quantity');
    }
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/cart/${itemId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove item');
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/cart`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to clear cart');
    }
  },
};

export default cartService;

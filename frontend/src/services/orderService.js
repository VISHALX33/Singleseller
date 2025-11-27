/**
 * Order Service - API calls for order-related endpoints
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const orderService = {
  // Create new order from cart
  createOrder: async (shippingAddress, paymentMethod, transactionId = null) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/orders`,
        { shippingAddress, paymentMethod, transactionId },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create order');
    }
  },

  // Get user's orders (paginated)
  getOrders: async (page = 1, limit = 10, status = null) => {
    try {
      const params = new URLSearchParams({ page, limit });
      if (status) params.append('status', status);

      const response = await axios.get(
        `${API_BASE_URL}/orders?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  },

  // Get order details by ID
  getOrderById: async (orderId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/${orderId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order');
    }
  },

  // Update order status (admin only)
  updateOrderStatus: async (orderId, status, comment = '') => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/orders/${orderId}/status`,
        { status, comment },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update order status');
    }
  },

  // Cancel order
  cancelOrder: async (orderId, reason = '') => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/orders/${orderId}/cancel`,
        { reason },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel order');
    }
  },
};

export default orderService;

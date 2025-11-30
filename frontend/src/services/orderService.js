import api from './api.js';

export async function placeOrder(payload) {
  const { data } = await api.post('/orders', payload);
  return data.order;
}

export async function getOrders(params = {}) {
  const query = new URLSearchParams(params).toString();
  const { data } = await api.get(`/orders${query ? '?' + query : ''}`);
  return data.orders || [];
}

export async function getOrderById(id) {
  const { data } = await api.get(`/orders/${id}`);
  return data.order;
}

export async function updateOrderStatus(id, orderStatus) {
  const { data } = await api.put(`/orders/${id}/status`, { orderStatus });
  return data.order;
}

export async function cancelOrder(id) {
  const { data } = await api.put(`/orders/${id}/cancel`);
  return data.order;
}

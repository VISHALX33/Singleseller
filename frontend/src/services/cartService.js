import api from './api.js';

export async function getCart() {
  const { data } = await api.get('/cart');
  return data.cart;
}

export async function addCartItem(productId, quantity = 1) {
  const { data } = await api.post('/cart/add', { productId, quantity });
  return data.cart;
}

export async function updateCartItem(itemId, quantity) {
  const { data } = await api.put(`/cart/item/${itemId}`, { quantity });
  return data.cart;
}

export async function removeCartItem(itemId) {
  const { data } = await api.delete(`/cart/item/${itemId}`);
  return data.cart;
}

export async function clearCartApi() {
  const { data } = await api.delete('/cart/clear');
  return data.cart;
}

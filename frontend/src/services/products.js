import api from './api.js';

export async function fetchProducts() {
  try {
    const res = await api.get('/products');
    return res.data?.data || res.data?.products || [];
  } catch (e) {
    return [];
  }
}

export async function fetchProduct(id) {
  const res = await api.get(`/products/${id}`);
  return res.data?.data || res.data?.product;
}

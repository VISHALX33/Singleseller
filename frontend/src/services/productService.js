import api from './api.js';

export async function getAllProducts(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.append(k, v);
  });
  const res = await api.get(`/products?${query.toString()}`);
  return res.data;
}

export async function getProductById(id) {
  const res = await api.get(`/products/${id}`);
  return res.data;
}

export async function getProductBySlug(slug) {
  const res = await api.get(`/products/slug/${slug}`);
  return res.data;
}

export async function searchProducts(queryParams) {
  return getAllProducts(queryParams);
}

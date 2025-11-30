import api from './api.js';

// Dashboard stats
export async function getAdminStats() {
  const { data } = await api.get('/admin/stats');
  return data.stats;
}

// Products
export async function adminListProducts(params={}) {
  const query = new URLSearchParams(params).toString();
  const { data } = await api.get(`/products${query?`?${query}`:''}`);
  return data.products || [];
}

export async function adminCreateProduct(form) {
  const fd = new FormData();
  Object.entries(form).forEach(([k,v]) => {
    if (k === 'images' && Array.isArray(v)) v.forEach(img => fd.append('images', img));
    else if (v !== undefined && v !== null) fd.append(k, v);
  });
  const { data } = await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data.product;
}

export async function adminUpdateProduct(id, form) {
  const { data } = await api.put(`/products/${id}`, form);
  return data.product;
}

export async function adminDeleteProduct(id) {
  await api.delete(`/products/${id}`);
}

// Orders
export async function adminListOrders(params={}) {
  const query = new URLSearchParams(params).toString();
  const { data } = await api.get(`/orders${query?`?${query}`:''}`);
  return data.orders || [];
}

export async function adminGetOrder(id) {
  const { data } = await api.get(`/orders/${id}`);
  return data.order;
}

export async function adminUpdateOrderStatus(id, orderStatus) {
  const { data } = await api.put(`/orders/${id}/status`, { orderStatus });
  return data.order;
}

// Categories
export async function adminListCategories() {
  const { data } = await api.get('/categories');
  return data.categories || [];
}

export async function adminCreateCategory(form) {
  const { data } = await api.post('/categories', form);
  return data.category;
}

export async function adminUpdateCategory(id, form) {
  const { data } = await api.put(`/categories/${id}`, form);
  return data.category;
}

export async function adminDeleteCategory(id) {
  await api.delete(`/categories/${id}`);
}

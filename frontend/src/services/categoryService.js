import api from './api.js';

export async function getCategories() {
  const res = await api.get('/categories');
  return res.data?.categories || [];
}

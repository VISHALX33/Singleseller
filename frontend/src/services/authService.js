import api from './api.js';

export async function registerUser(payload) {
  const res = await api.post('/auth/register', payload);
  return res.data;
}

export async function loginUser(payload) {
  const res = await api.post('/auth/login', payload);
  return res.data;
}

export async function fetchProfile() {
  const res = await api.get('/auth/profile');
  return res.data;
}

export async function updateProfileApi(payload) {
  const res = await api.put('/auth/profile', payload);
  return res.data;
}

export async function changePasswordApi(payload) {
  const res = await api.put('/auth/change-password', payload);
  return res.data;
}

import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({ baseURL: API_BASE });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('moodfoam_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function imageUrl(filename) {
  if (!filename) return null;
  if (filename.startsWith('http')) return filename;
  return `${API_BASE}/uploads/${filename}`;
}

// ---------- Public ----------
export const getCategories = () => client.get('/api/categories').then((r) => r.data);
export const getCategory = (slug) => client.get(`/api/categories/${slug}`).then((r) => r.data);
export const getProducts = (params = {}) => client.get('/api/products', { params }).then((r) => r.data);
export const getProduct = (slug) => client.get(`/api/products/${slug}`).then((r) => r.data);
export const getConfig = () => client.get('/api/config').then((r) => r.data);
export const sendContactMessage = (payload) => client.post('/api/contact', payload).then((r) => r.data);

// ---------- Auth ----------
export const login = (username, password) =>
  client.post('/api/auth/login', { username, password }).then((r) => r.data);
export const getMe = () => client.get('/api/auth/me').then((r) => r.data);

// ---------- Admin: categories ----------
export const createCategory = (payload) => client.post('/api/categories', payload).then((r) => r.data);
export const updateCategory = (id, payload) => client.put(`/api/categories/${id}`, payload).then((r) => r.data);
export const deleteCategory = (id) => client.delete(`/api/categories/${id}`).then((r) => r.data);

// ---------- Admin: products ----------
export const createProduct = (payload) => client.post('/api/products', payload).then((r) => r.data);
export const updateProduct = (id, payload) => client.put(`/api/products/${id}`, payload).then((r) => r.data);
export const deleteProduct = (id) => client.delete(`/api/products/${id}`).then((r) => r.data);

// ---------- Admin: uploads ----------
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return client
    .post('/api/uploads/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data);
};
export const deleteImage = (filename) => client.delete(`/api/uploads/image/${filename}`).then((r) => r.data);

// ---------- Admin: contact messages ----------
export const getContactMessages = () => client.get('/api/contact').then((r) => r.data);
export const markMessageRead = (id) => client.put(`/api/contact/${id}/read`).then((r) => r.data);
export const deleteContactMessage = (id) => client.delete(`/api/contact/${id}`).then((r) => r.data);

export default client;

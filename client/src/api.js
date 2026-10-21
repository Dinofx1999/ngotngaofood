// Gọi API tới server Node.js (Vite proxy /api -> http://localhost:5050)
const BASE = '/api';

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  // Với FormData (tải ảnh) để trình duyệt tự đặt Content-Type
  if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';

  const res = await fetch(BASE + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Có lỗi xảy ra, vui lòng thử lại');
  return data;
}

const adminHeaders = (key) => ({ 'x-admin-key': key });

export const api = {
  getCategories: () => request('/categories'),
  getSettings: () => request('/settings'),
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request('/products' + (query ? `?${query}` : ''));
  },
  getProduct: (id) => request(`/products/${id}`),
  createOrder: (order) => request('/orders', { method: 'POST', body: JSON.stringify(order) }),
  getOrder: (code) => request(`/orders/${encodeURIComponent(code)}`),

  // Quản trị: đơn hàng
  adminGetOrders: (key) => request('/orders', { headers: adminHeaders(key) }),
  adminUpdateStatus: (key, id, status) =>
    request(`/orders/${id}/status`, { method: 'PATCH', headers: adminHeaders(key), body: JSON.stringify({ status }) }),

  // Quản trị: thông tin cửa hàng
  adminUpdateSettings: (key, data) =>
    request('/settings', { method: 'PUT', headers: adminHeaders(key), body: JSON.stringify(data) }),

  // Quản trị: danh mục
  adminCreateCategory: (key, data) =>
    request('/categories', { method: 'POST', headers: adminHeaders(key), body: JSON.stringify(data) }),
  adminUpdateCategory: (key, id, data) =>
    request(`/categories/${id}`, { method: 'PUT', headers: adminHeaders(key), body: JSON.stringify(data) }),
  adminDeleteCategory: (key, id) => request(`/categories/${id}`, { method: 'DELETE', headers: adminHeaders(key) }),
  adminReorderCategories: (key, ids) =>
    request('/categories/order', { method: 'PUT', headers: adminHeaders(key), body: JSON.stringify({ ids }) }),

  // Quản trị: sản phẩm
  adminCreateProduct: (key, data) =>
    request('/products', { method: 'POST', headers: adminHeaders(key), body: JSON.stringify(data) }),
  adminUpdateProduct: (key, id, data) =>
    request(`/products/${id}`, { method: 'PUT', headers: adminHeaders(key), body: JSON.stringify(data) }),
  adminDeleteProduct: (key, id) => request(`/products/${id}`, { method: 'DELETE', headers: adminHeaders(key) }),
  adminReorderProducts: (key, ids) =>
    request('/products/order', { method: 'PUT', headers: adminHeaders(key), body: JSON.stringify({ ids }) }),
  adminUploadImage: (key, file) => {
    const form = new FormData();
    form.append('image', file);
    return request('/products/upload', { method: 'POST', headers: adminHeaders(key), body: form });
  },
};

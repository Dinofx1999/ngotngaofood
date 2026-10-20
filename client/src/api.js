// Gọi API tới server Node.js (Vite proxy /api -> http://localhost:5050)
const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Có lỗi xảy ra, vui lòng thử lại');
  return data;
}

export const api = {
  getCategories: () => request('/categories'),
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request('/products' + (query ? `?${query}` : ''));
  },
  getProduct: (id) => request(`/products/${id}`),
  createOrder: (order) => request('/orders', { method: 'POST', body: JSON.stringify(order) }),
  getOrder: (code) => request(`/orders/${encodeURIComponent(code)}`),
  adminGetOrders: (key) => request('/orders', { headers: { 'x-admin-key': key } }),
  adminUpdateStatus: (key, id, status) =>
    request(`/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'x-admin-key': key },
      body: JSON.stringify({ status }),
    }),
};

import { AdminSettings, DashboardStats, Order, Product } from '../types';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(payload.error || 'Request failed');
  }

  return response.json();
}

export const api = {
  getStoreProducts: () => request<{ products: Product[] }>('/api/store/products'),
  createOrder: (body: { customerEmail: string; productId: string; paymentMethod: string }) =>
    request<{ order: Order }>('/api/orders/create', { method: 'POST', body: JSON.stringify(body) }),
  confirmPayment: (orderId: string) =>
    request<{ order: Order }>(`/api/orders/${orderId}/simulate-payment`, { method: 'POST' }),
  adminLogin: (body: { email: string; password: string }) =>
    request<{ token: string; admin: { email: string } }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(body)
    }),
  getAdminProducts: (token: string) =>
    request<{ products: Product[] }>('/api/admin/products', {
      headers: { Authorization: `Bearer ${token}` }
    }),
  createProduct: (token: string, payload: Record<string, unknown>) =>
    request<{ product: Product }>('/api/admin/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    }),
  updateProduct: (token: string, productId: string, payload: Record<string, unknown>) =>
    request<{ product: Product }>(`/api/admin/products/${productId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    }),
  deleteProduct: (token: string, productId: string) =>
    request<{ ok: boolean }>(`/api/admin/products/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }),
  addInventory: (token: string, productId: string, payload: Record<string, unknown>) =>
    request<{ ok: boolean }>(`/api/admin/products/${productId}/inventory`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    }),
  getOrders: (token: string) =>
    request<{ orders: Order[] }>('/api/admin/orders', {
      headers: { Authorization: `Bearer ${token}` }
    }),
  getStats: (token: string) =>
    request<{ stats: DashboardStats }>('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    }),
  getSettings: (token: string) =>
    request<{ settings: AdminSettings }>('/api/admin/settings', {
      headers: { Authorization: `Bearer ${token}` }
    }),
  updateSettings: (token: string, payload: AdminSettings) =>
    request<{ settings: AdminSettings }>('/api/admin/settings', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    })
};

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json().catch(() => ({})) : null;
  if (!res.ok) {
    const msg = (data && (data.detail || data.error)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  login: (username: string, password: string) =>
    request('/auth/login/', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => request('/auth/logout/', { method: 'POST' }),
  me: () => request('/auth/me/'),
  clients: {
    list: () => request('/clients/'),
    create: (payload: { name: string; email?: string; address?: string; billing_details?: string; notes?: string }) =>
      request('/clients/', { method: 'POST', body: JSON.stringify(payload) }),
  },
  invoices: {
    list: () => request('/invoices/'),
    create: (payload: any) =>
      request('/invoices/', { method: 'POST', body: JSON.stringify(payload) }),
  },
};

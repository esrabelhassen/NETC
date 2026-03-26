const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const entityPath = {
  Service: 'services',
  Category: 'categories',
  SiteContent: 'contents',
  Lead: 'leads',
  Order: 'orders',
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const error = new Error(payload.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = payload;
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
};

const toQueryString = (params) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  });
  return search.toString();
};

const entityApi = (name) => {
  const basePath = `/${entityPath[name]}`;
  return {
    list: async (sort = '', limit) => {
      const query = toQueryString({ sort, limit });
      return request(`${basePath}${query ? `?${query}` : ''}`);
    },
    filter: async (filters = {}, sort = '', limit) => {
      const query = toQueryString({ sort, limit, q: JSON.stringify(filters) });
      return request(`${basePath}${query ? `?${query}` : ''}`);
    },
    create: async (payload) => request(basePath, { method: 'POST', body: JSON.stringify(payload) }),
    update: async (id, payload) => request(`${basePath}/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    delete: async (id) => request(`${basePath}/${id}`, { method: 'DELETE' }),
  };
};

export const base44 = {
  entities: {
    Service: entityApi('Service'),
    Category: entityApi('Category'),
    SiteContent: entityApi('SiteContent'),
    Lead: entityApi('Lead'),
    Order: entityApi('Order'),
  },
  auth: {
    me: async () => {
      const token = localStorage.getItem('mock_access_token');
      if (!token) {
        const error = new Error('Authentication required');
        error.status = 401;
        throw error;
      }
      return { id: 'local-admin', role: 'admin', email: 'admin@local.dev' };
    },
    logout: () => localStorage.removeItem('mock_access_token'),
    redirectToLogin: () => {
      localStorage.setItem('mock_access_token', 'dev-token');
      window.location.reload();
    },
  },
};

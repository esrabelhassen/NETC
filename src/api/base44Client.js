const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const ADMIN_SESSION_TOKEN_KEY = 'netc-admin-session-token';
const ADMIN_CLIENT_ID_KEY = 'netc-admin-client-id';
const ADMIN_SESSION_ENDPOINT = `${API_BASE}/admin/session`;

const entityPath = {
  Service: 'services',
  Category: 'categories',
  SiteContent: 'contents',
  Lead: 'leads',
  Order: 'orders',
  Video: 'videos',
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

const parseJsonResponse = async (response) => {
  const text = await response.text().catch(() => '');
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
};

const getSessionToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_SESSION_TOKEN_KEY);
};

const setSessionToken = (token) => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(ADMIN_SESSION_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ADMIN_SESSION_TOKEN_KEY);
  }
};

const getAdminClientId = () => {
  if (typeof window === 'undefined') return '';
  let clientId = localStorage.getItem(ADMIN_CLIENT_ID_KEY);
  if (!clientId) {
    const randomId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `client-${Math.random().toString(36).slice(2)}`;
    clientId = randomId;
    localStorage.setItem(ADMIN_CLIENT_ID_KEY, clientId);
  }
  return clientId;
};

export const base44 = {
  entities: {
    Service: entityApi('Service'),
    Category: entityApi('Category'),
    SiteContent: entityApi('SiteContent'),
    Lead: entityApi('Lead'),
    Order: entityApi('Order'),
    Video: entityApi('Video'),
    videos: entityApi('Video'),
  },
  auth: {
    me: async () => {
      const headers = { 'x-admin-client-id': getAdminClientId() };
      const token = getSessionToken();
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await fetch(ADMIN_SESSION_ENDPOINT, { method: 'GET', headers });
      const payload = await parseJsonResponse(response);
      if (!response.ok) {
        const error = new Error(payload.message || 'Authentication required');
        error.status = response.status;
        error.data = payload;
        throw error;
      }
      if (payload.token && payload.token !== token) {
        setSessionToken(payload.token);
      }
      return payload.user || { role: 'admin' };
    },
    loginWithPasscode: async (passcode) => {
      const headers = {
        'Content-Type': 'application/json',
        'x-admin-client-id': getAdminClientId(),
      };
      const response = await fetch(ADMIN_SESSION_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify({ passcode }),
      });
      const payload = await parseJsonResponse(response);
      if (!response.ok) {
        const error = new Error(payload.message || 'Invalid passcode');
        error.status = response.status;
        error.data = payload;
        throw error;
      }
      if (payload.token) {
        setSessionToken(payload.token);
      }
      return payload;
    },
    logout: async () => {
      const headers = { 'x-admin-client-id': getAdminClientId() };
      const token = getSessionToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      setSessionToken(null);
      await fetch(ADMIN_SESSION_ENDPOINT, { method: 'DELETE', headers });
    },
    redirectToLogin: () => {
      setSessionToken(null);
      window.location.reload();
    },
  },
};

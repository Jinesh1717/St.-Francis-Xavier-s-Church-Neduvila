import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
  },
});

// Helper to get cookie value by name
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Request interceptor to attach CSRF token to state-changing requests
api.interceptors.request.use(async (config) => {
  const method = config.method ? config.method.toUpperCase() : 'GET';
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    let token = getCookie('XSRF-TOKEN');
    if (!token) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || '/api'}/csrf-token`, {
          withCredentials: true,
        });
        token = res.data?.csrfToken;
      } catch (err) {
        console.warn('Could not refresh CSRF token:', err.message);
      }
    }
    if (token) {
      config.headers['X-CSRF-Token'] = token;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;


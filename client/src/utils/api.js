// client/src/utils/api.js
import axios from 'axios';

// Create an Axios instance with base URL
const api = axios.create({
  baseURL: '/api'
});


// Attach the Authorization header on every request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;

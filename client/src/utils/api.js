// client/src/utils/api.js
import axios from 'axios';

// Dynamically choose the base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || 'https://fitnesslogapp-github-io.onrender.com/api'

});

// Attach the Authorization header on every reques
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

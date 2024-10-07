import axios from 'axios';

// Create an Axios instance for the API
const api = axios.create({
  baseURL: 'http://localhost:5000/api',  // Replace with your actual backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to attach the JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

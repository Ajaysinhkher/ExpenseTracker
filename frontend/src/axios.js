// src/axios.js
import axios from 'axios';

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Your base URL
});

// Add an interceptor to add the token to the request headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage or your state management (e.g., Redux, context)
    const token = localStorage.getItem('token');
    
    // If a token exists, add it to the headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

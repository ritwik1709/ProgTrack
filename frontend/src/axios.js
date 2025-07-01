import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:9000',
});

// Add a request interceptor to attach the token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance; 
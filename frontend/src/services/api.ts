import axios from 'axios';

// API基础URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// 创建axios实例
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：添加认证令牌
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['x-access-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理常见错误
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 处理未认证错误（401）
    if (error.response && error.response.status === 401) {
      // 清除本地存储的令牌
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      // 可以添加重定向到登录页面
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 
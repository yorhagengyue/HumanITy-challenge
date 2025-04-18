import axios from 'axios';
import { getToken } from './auth.service';

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
    const token = getToken();
    if (token) {
      // 使用与auth.service相同的两种头部格式
      config.headers['Authorization'] = `Bearer ${token}`;
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
      // 重定向到登录页面
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
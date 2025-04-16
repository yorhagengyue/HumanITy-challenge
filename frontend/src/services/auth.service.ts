import axios from 'axios';

// API Base URL
const API_URL = 'http://localhost:8000/api/auth';

// User Interface
export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  accessToken?: string;
  refreshToken?: string;
}

// 添加离线模式的登录选项
const OFFLINE_MODE = true; // Enable offline mode for testing

// 模拟用户数据（仅用于离线模式）
const MOCK_USERS = [
  {
    id: "1",
    username: "demo",
    email: "demo@example.com",
    roles: ["user"],
    accessToken: "mock-token-12345",
  },
  {
    id: "2",
    username: "user",
    email: "user@example.com",
    roles: ["user"],
    accessToken: "mock-token-user",
  },
  {
    id: "3",
    username: "admin",
    email: "admin@example.com",
    roles: ["admin", "user"],
    accessToken: "mock-token-admin",
  },
  // Accept any email with simple password validation
  {
    id: "4",
    username: "any-user",
    email: "any",
    roles: ["user"],
    accessToken: "mock-token-any-user",
  }
];

// Login Method
export const login = async (email: string, password: string): Promise<User> => {
  try {
    console.log('Login attempt for user:', email);
    
    // If offline mode is enabled, use mock data
    if (OFFLINE_MODE) {
      console.log('Using offline mode for login');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Basic password validation - require at least 4 characters
      if (!password || password.length < 4) {
        console.error('Invalid password in offline mode');
        throw new Error('Password must be at least 4 characters');
      }
      
      // Find matching user or use the "any" user
      let user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      // If no exact match, use the "any" user
      if (!user) {
        user = {
          id: "999",
          username: email.split('@')[0] || "user",
          email: email,
          roles: ["user"],
          accessToken: "mock-token-" + Date.now(),
        };
      }
      
      // Store user information
      localStorage.setItem('user', JSON.stringify(user));
      console.log('Mock user data saved to localStorage:', user);
      
      // Dispatch auth-change event
      window.dispatchEvent(new Event('auth-change'));
      
      return user;
    }
    
    // Normal API login flow
    const response = await axios.post(`${API_URL}/signin`, {
      email,
      password,
    });
    
    console.log('Login response:', response.data);
    
    if (response.data.accessToken) {
      // Store user information in localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      console.log('User data saved to localStorage');
      
      // Dispatch auth-change event
      window.dispatchEvent(new Event('auth-change'));
    } else {
      console.warn('No access token in login response');
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Registration Method
export const register = async (username: string, email: string, password: string): Promise<any> => {
  try {
    return await axios.post(`${API_URL}/signup`, {
      username,
      email,
      password,
    });
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Logout Method
export const logout = (): void => {
  localStorage.removeItem('user');
  
  // Dispatch auth-change event
  window.dispatchEvent(new Event('auth-change'));
};

// Get Current User Information
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Check if User is Logged In
export const isLoggedIn = (): boolean => {
  return getCurrentUser() !== null;
};

// Set Authorization Token in Request Headers
export const authHeader = (): { Authorization?: string } => {
  const user = getCurrentUser();
  
  if (user && user.accessToken) {
    return { Authorization: 'Bearer ' + user.accessToken };
  } else {
    return {};
  }
};

// Get Current User Token
export const getToken = (): string | null => {
  const user = getCurrentUser();
  return user?.accessToken || null;
};

// Check if User is Authenticated (Same function as isLoggedIn, but kept for compatibility)
export const isAuthenticated = (): boolean => {
  return !!getCurrentUser();
};

// Check if User Has Specific Role
export const hasRole = (requiredRole: string): boolean => {
  const user = getCurrentUser();
  if (!user || !user.roles) {
    return false;
  }
  return user.roles.includes(requiredRole);
};

// Refresh Token
export const refreshToken = async (): Promise<void> => {
  try {
    const user = getCurrentUser();
    if (!user) return;
    
    const response = await axios.post(`${API_URL}/refreshtoken`, {
      refreshToken: user.refreshToken
    });
    
    if (response.data.accessToken) {
      // Update token in localStorage
      localStorage.setItem('user', JSON.stringify({
        ...user,
        accessToken: response.data.accessToken
      }));
    }
  } catch (error) {
    logout();
    throw error;
  }
};

// Create Axios Instance with Authorization Headers
export const authAxios = axios.create();

// Request Interceptor to Add Token to Requests
authAxios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // Set both header formats to ensure compatibility
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['x-access-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to Handle 401 Errors
authAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // 只有在真正的 401 未授权错误时才清除用户信息和重定向到登录页面
    // 健康数据访问错误不应导致登出
    if (
      error.response && 
      error.response.status === 401 && 
      !error.config.url.includes('/health') && 
      !error.config.url.includes('/health-calendar')
    ) {
      console.log('401 error, logging out:', error.config.url);
      // Clear user from localStorage
      logout();
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
); 
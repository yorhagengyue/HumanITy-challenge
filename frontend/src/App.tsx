import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import CalendarCategories from './pages/CalendarCategories';
import EmotionalSupport from './pages/EmotionalSupport';
import Tasks from './pages/Tasks';
import HealthData from './pages/HealthData';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import AOS from 'aos';
import 'aos/dist/aos.css';
import AnimatedBackground from './components/AnimatedBackground';
import './styles/animations.css'; // We'll create this CSS file for animations
import { isLoggedIn } from './services/auth.service';

// Create a custom theme with enhanced UI settings
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f7',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 40px -12px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
        },
        contained: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// 添加深色主题定义
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
    },
    secondary: {
      main: '#f48fb1',
      light: '#f8bbd0',
      dark: '#c2185b',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  typography: theme.typography,
  shape: theme.shape,
  components: {
    ...theme.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#121212',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#121212',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 12,
        },
      },
    },
  },
});

// Simple PageLayout component with CSS animations
const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box 
      className="page-transition"
      sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '0',
        position: 'relative', 
        overflow: 'hidden',
        animation: 'fadeIn 0.4s ease-out forwards'
      }}
    >
      {children}
    </Box>
  );
};

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Check if user is logged in
  const authenticated = isLoggedIn();
  
  // If not authenticated, redirect to login
  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Public Route component (accessible only when NOT logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  // Check if user is logged in
  const authenticated = isLoggedIn();
  
  // If authenticated, redirect to dashboard
  if (authenticated) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

function App() {
  // Add state to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn());
  // 添加状态来追踪私密模式
  const [isPrivateMode, setIsPrivateMode] = useState(() => {
    return localStorage.getItem('calendar_private_mode') === 'true';
  });
  
  // Initialize AOS animation library
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: false,
    });
  }, []);

  // Setup listener for auth changes
  useEffect(() => {
    // Check authentication status initially
    setIsAuthenticated(isLoggedIn());
    
    // Create a function to listen for localStorage changes
    const handleStorageChange = () => {
      setIsAuthenticated(isLoggedIn());
    };
    
    // Listen for storage events to detect login/logout
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for auth changes within the same window
    const handleAuthChange = () => {
      setIsAuthenticated(isLoggedIn());
    };
    
    window.addEventListener('auth-change', handleAuthChange);
    
    // Cleanup event listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  // 添加私密模式监听
  useEffect(() => {
    const handlePrivateModeChange = () => {
      const privateMode = localStorage.getItem('calendar_private_mode') === 'true';
      setIsPrivateMode(privateMode);
    };
    
    // 监听localStorage变化
    window.addEventListener('storage', handlePrivateModeChange);
    
    // 额外创建自定义事件用于同一窗口通信
    window.addEventListener('private-mode-change', handlePrivateModeChange);
    
    // 创建intervalId每秒检查localStorage中的私密模式状态
    const intervalId = setInterval(() => {
      const currentPrivateMode = localStorage.getItem('calendar_private_mode') === 'true';
      if (currentPrivateMode !== isPrivateMode) {
        setIsPrivateMode(currentPrivateMode);
      }
    }, 1000);
    
    // 清理事件监听器
    return () => {
      window.removeEventListener('storage', handlePrivateModeChange);
      window.removeEventListener('private-mode-change', handlePrivateModeChange);
      clearInterval(intervalId);
    };
  }, [isPrivateMode]);

  return (
    <ThemeProvider theme={isPrivateMode ? darkTheme : theme}>
      <CssBaseline />
      <AnimatedBackground />
      <Router>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
          transition: 'background-color 0.3s ease, color 0.3s ease'
        }}>
          {/* Use the state variable instead of calling isLoggedIn() directly */}
          {isAuthenticated && <Navbar />}
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              flexDirection: 'column',
              position: 'relative',
              zIndex: 1,
              bgcolor: 'background.default',
              color: 'text.primary',
              transition: 'background-color 0.3s ease, color 0.3s ease'
            }}
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              
              {/* Protected Routes */}
              <Route path="/" element={<ProtectedRoute><PageLayout><Dashboard /></PageLayout></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><PageLayout><Dashboard /></PageLayout></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><PageLayout><Calendar /></PageLayout></ProtectedRoute>} />
              <Route path="/calendar/categories" element={<ProtectedRoute><PageLayout><CalendarCategories /></PageLayout></ProtectedRoute>} />
              <Route path="/emotional-support" element={<ProtectedRoute><PageLayout><EmotionalSupport /></PageLayout></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><PageLayout><Tasks /></PageLayout></ProtectedRoute>} />
              <Route path="/health-data" element={<ProtectedRoute><PageLayout><HealthData /></PageLayout></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><PageLayout><Profile /></PageLayout></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><PageLayout><Settings /></PageLayout></ProtectedRoute>} />
              
              {/* Redirect to login for any other route */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;

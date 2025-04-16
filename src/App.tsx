import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import EmotionalSupport from './pages/EmotionalSupport';
import Tasks from './pages/Tasks';
import HealthData from './pages/HealthData';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';
import AOS from 'aos';
import 'aos/dist/aos.css';
import AnimatedBackground from './components/AnimatedBackground';
import './styles/animations.css'; // We'll create this CSS file for animations

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

function App() {
  // Initialize AOS animation library
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: false,
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AnimatedBackground />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              flexDirection: 'column',
              position: 'relative',
              zIndex: 1,
              backgroundColor: 'background.default',
            }}
          >
            <Routes>
              <Route path="/" element={<PageLayout><Dashboard /></PageLayout>} />
              <Route path="/calendar" element={<PageLayout><Calendar /></PageLayout>} />
              <Route path="/emotional-support" element={<PageLayout><EmotionalSupport /></PageLayout>} />
              <Route path="/tasks" element={<PageLayout><Tasks /></PageLayout>} />
              <Route path="/health-data" element={<PageLayout><HealthData /></PageLayout>} />
              <Route path="/profile" element={<PageLayout><Profile /></PageLayout>} />
              <Route path="/settings" element={<PageLayout><Settings /></PageLayout>} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;

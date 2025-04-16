import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Alert, 
  CircularProgress,
  IconButton,
  InputAdornment,
  Divider,
  Link
} from '@mui/material';
import { 
  Login as LoginIcon, 
  Visibility, 
  VisibilityOff, 
  Email 
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { login, getCurrentUser } from '../services/auth.service';

const initialFormState = {
  email: '',
  password: ''
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState(initialFormState);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error message
    if (error) setError('');
  };
  
  // Handle password visibility toggle
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Call login API
      const data = await login(formData.email, formData.password);
      console.log('Login successful, response:', data);
      
      // Verify token is stored
      const user = getCurrentUser();
      console.log('User from localStorage:', user);
      console.log('Access token available:', !!user?.accessToken);
      
      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle error messages
      if (err.code === 'ERR_NETWORK') {
        setError('Network connection error. Please check if the server is running');
      } else if (err.response) {
        setError(err.response.data.message || 'Login failed. Please check your email and password');
      } else if (err.message) {
        setError(err.message); // Display the error message directly if available
      } else {
        setError('Login failed. Please try again later');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 450,
          p: 4,
          borderRadius: 2
        }}
      >
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <Box mb={4} display="flex" flexDirection="column" alignItems="center">
            <LoginIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography component="h1" variant="h4" fontWeight="bold" textAlign="center">
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" mt={1}>
              Sign in to your MyLife account to continue
            </Typography>
          </Box>

          {/* Error message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Email field */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Password field */}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {/* Login button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ 
              py: 1.5, 
              mb: 2,
              position: 'relative' 
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ position: 'absolute' }} />
            ) : (
              'Login'
            )}
          </Button>
          
          {/* Divider */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              or
            </Typography>
          </Divider>
          
          {/* Register link */}
          <Box textAlign="center">
            <Typography variant="body2" display="inline">
              Don't have an account? 
            </Typography>
            <Link 
              component={RouterLink} 
              to="/register" 
              variant="body2" 
              fontWeight="bold"
              sx={{ ml: 1 }}
            >
              Sign up now
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login; 
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
  Link,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { 
  PersonAdd as RegisterIcon, 
  Visibility, 
  VisibilityOff, 
  Email,
  Person
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { register } from '../services/auth.service';

const Register: React.FC = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
    
    // Form validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password should be at least 6 characters long');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Call register API
      await register(formData.username, formData.email, formData.password);
      
      // Registration successful
      setSuccess('Registration successful! Please login to your account');
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      console.error('Registration error:', err);
      
      // Handle error messages
      if (err.code === 'ERR_NETWORK') {
        setError('Network connection error. Please check if the server is running');
      } else if (err.response) {
        setError(err.response.data.message || 'Registration failed. Please try again later');
      } else {
        setError('Registration failed. Please try again later');
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
            <RegisterIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography component="h1" variant="h4" fontWeight="bold" textAlign="center">
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" mt={1}>
              Start your MyLife journey
            </Typography>
          </Box>

          {/* Error or success message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {/* Username field */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          
          {/* Email field */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
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
            autoComplete="new-password"
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
            sx={{ mb: 2 }}
          />
          
          {/* Confirm Password field */}
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
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
            sx={{ mb: 2 }}
          />
          
          {/* Terms agreement checkbox */}
          <FormControlLabel
            control={
              <Checkbox 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box component="span" fontSize="0.875rem">
                I agree to the
                <Link 
                  href="#" 
                  sx={{ mx: 0.5 }}
                  onClick={(e) => e.preventDefault()}
                >
                  Terms of Service
                </Link>
                and
                <Link 
                  href="#" 
                  sx={{ ml: 0.5 }}
                  onClick={(e) => e.preventDefault()}
                >
                  Privacy Policy
                </Link>
              </Box>
            }
            sx={{ mb: 2 }}
          />

          {/* Register button */}
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
              'Create Account'
            )}
          </Button>
          
          {/* Divider */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              or
            </Typography>
          </Divider>
          
          {/* Login link */}
          <Box textAlign="center">
            <Typography variant="body2" display="inline">
              Already have an account? 
            </Typography>
            <Link 
              component={RouterLink} 
              to="/login" 
              variant="body2" 
              fontWeight="bold"
              sx={{ ml: 1 }}
            >
              Sign in now
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register; 
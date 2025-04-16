import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Card, 
  Button,
  IconButton,
  Avatar,
  LinearProgress,
  Divider,
  Stack,
  useTheme,
  alpha,
  Chip,
  Badge,
} from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip as ChartTooltip, Legend, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import MoodIcon from '@mui/icons-material/Mood';
import SchoolIcon from '@mui/icons-material/School';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

// Sample data for charts
const moodData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Mood Index',
      data: [65, 72, 68, 83, 75, 90, 85],
      fill: true,
      backgroundColor: alpha('#2196f3', 0.1),
      borderColor: '#2196f3',
      tension: 0.4,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#2196f3',
      pointBorderWidth: 2,
      pointRadius: 4,
    },
  ],
};

const screenTimeData = {
  labels: ['Study Apps', 'Social Media', 'Entertainment', 'Others'],
  datasets: [
    {
      label: 'Screen Time Distribution',
      data: [45, 25, 20, 10],
      backgroundColor: [
        '#4caf50',
        '#f44336',
        '#ff9800',
        '#9e9e9e',
      ],
      borderColor: [
        '#4caf50',
        '#f44336',
        '#ff9800',
        '#9e9e9e',
      ],
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        boxWidth: 12,
        padding: 15,
      },
    },
    tooltip: {
      backgroundColor: alpha('#000000', 0.8),
      titleFont: {
        size: 14,
      },
      bodyFont: {
        size: 13,
      },
      padding: 12,
      cornerRadius: 8,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: alpha('#000000', 0.05),
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        boxWidth: 12,
        padding: 15,
      },
    },
  },
  cutout: '70%',
};

// Get time of day for greeting
const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
};

// Get current time
const getCurrentTime = () => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [activePeriod, setActivePeriod] = useState<'Day' | 'Week' | 'Month'>('Week');
  const timeOfDay = getTimeOfDay();
  const userName = "Alex"; // Ideally this would come from a user context

  const handlePeriodChange = (period: 'Day' | 'Week' | 'Month') => {
    setActivePeriod(period);
  };

  return (
    <Container maxWidth="xl" sx={{ pb: 5 }}>
      {/* Hero Section with Welcome Message */}
      <Paper 
        elevation={0}
        sx={{
          mt: { xs: 2, md: 3 },
          mb: 4,
          p: { xs: 2, md: 3 },
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
        className="fade-in"
      >
        {/* Decorative elements */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: -15, 
            right: -15, 
            width: 120, 
            height: 120, 
            borderRadius: '50%', 
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0)} 70%)`,
            zIndex: 0,
          }}
        />
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: -20, 
            left: '45%', 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0)} 70%)`,
            zIndex: 0,
          }}
        />

        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 2, 
            position: 'relative', 
            zIndex: 1 
          }}
        >
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 60%' } }}>
            <Box display="flex" alignItems="center" mb={1}>
              {timeOfDay === 'Morning' ? 
                <WbSunnyIcon sx={{ color: theme.palette.warning.main, mr: 1 }} /> : 
                timeOfDay === 'Afternoon' ? 
                <WbSunnyIcon sx={{ color: theme.palette.warning.main, mr: 1 }} /> : 
                <NightsStayIcon sx={{ color: theme.palette.info.dark, mr: 1 }} />
              }
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  letterSpacing: '-0.5px',
                }}
              >
                Good {timeOfDay}, {userName}!
              </Typography>
            </Box>
            
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
              Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
              <Chip 
                icon={<AccessTimeIcon />} 
                label={`Current time: ${getCurrentTime()}`} 
                variant="outlined" 
                size="small"
                sx={{ bgcolor: alpha(theme.palette.background.paper, 0.6) }}
              />
              <Chip 
                icon={<CheckCircleIcon />} 
                label="5/8 Tasks completed" 
                variant="outlined" 
                color="success" 
                size="small" 
                sx={{ bgcolor: alpha(theme.palette.background.paper, 0.6) }}
              />
              <Chip 
                icon={<TrendingUpIcon />} 
                label="+10% mood improvement" 
                variant="outlined" 
                color="primary" 
                size="small"
                sx={{ bgcolor: alpha(theme.palette.background.paper, 0.6) }}
              />
            </Box>
          </Box>

          <Box sx={{ 
            flex: { xs: '1 1 100%', md: '1 1 calc(40% - 16px)' },
            display: 'flex',
            justifyContent: { xs: 'flex-start', md: 'flex-end' },
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mt: { xs: 2, md: 0 },
          }}>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              className="button-hover"
              sx={{ 
                borderRadius: 2,
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                px: 3,
                py: 1,
              }}
            >
              Add New Record
            </Button>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                color="primary"
                sx={{ 
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
                className="hover-rotate"
              >
                <RefreshIcon />
              </IconButton>
              
              <Badge color="error" badgeContent={3} overlap="circular" variant="dot">
                <IconButton
                  sx={{ 
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.warning.main, 0.2),
                    }
                  }}
                >
                  <NotificationsIcon />
                </IconButton>
              </Badge>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Dashboard Summary Banner */}
      <Paper
        elevation={0}
        sx={{ 
          p: 2, 
          mb: 4,
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 0 } }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33.33%' } }}>
            <Box display="flex" alignItems="center">
              <StarRoundedIcon 
                sx={{ 
                  color: theme.palette.warning.main, 
                  mr: 1.5, 
                  fontSize: 40,
                  filter: `drop-shadow(0 2px 4px ${alpha(theme.palette.warning.main, 0.4)})`,
                }} 
              />
              <Box>
                <Typography variant="overline" color="text.secondary">
                  DAILY STREAK
                </Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ lineHeight: 1.1 }}>
                  7 Days
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ 
            flex: { xs: '1 1 calc(50% - 8px)', md: '1 1 33.33%' },
            borderLeft: { xs: 'none', md: `1px solid ${alpha(theme.palette.divider, 0.2)}` },
            pl: { xs: 0, md: 2 }
          }}>
            <Box display="flex" alignItems="center" justifyContent={{ xs: 'flex-start', md: 'center' }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: { xs: 'flex-start', md: 'center' } 
                }}
              >
                <Typography variant="overline" color="text.secondary">
                  CURRENT FOCUS
                </Typography>
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  sx={{ 
                    color: theme.palette.secondary.main,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <SchoolIcon sx={{ mr: 0.5, fontSize: 20 }} />
                  Final Exam Prep
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ 
            flex: { xs: '1 1 calc(50% - 8px)', md: '1 1 33.33%' },
            borderLeft: { xs: 'none', md: `1px solid ${alpha(theme.palette.divider, 0.2)}` },
            pl: { xs: 0, md: 2 }
          }}>
            <Box display="flex" alignItems="center" justifyContent={{ xs: 'flex-end', md: 'center' }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: { xs: 'flex-end', md: 'center' } 
                }}
              >
                <Typography variant="overline" color="text.secondary">
                  WEEKLY AVERAGE
                </Typography>
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  sx={{ 
                    color: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <TrendingUpIcon sx={{ mr: 0.5, fontSize: 20 }} />
                  Mood Score: 85/100
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Main content - Keep remaining content */}
      <Typography 
        variant="h5" 
        className="fade-in" 
        sx={{ 
          mb: 2, 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            width: 4,
            height: 24,
            backgroundColor: theme.palette.primary.main,
            display: 'inline-block',
            borderRadius: 4,
            mr: 1.5,
          }
        }}
      >
        Quick Overview
      </Typography>

      {/* Quick overview card row - Keep existing cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }} className="fade-in">
        {/* Today's tasks card */}
        <Box sx={{ width: { xs: '100%', md: '48%', lg: '23%' } }} className="stagger-item-1">
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              borderRadius: 3, 
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: `0 8px 25px -15px ${alpha(theme.palette.primary.main, 0.5)}`,
                transform: 'translateY(-5px)',
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main }}>
                  <CheckCircleIcon />
                </Avatar>
                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                  Today's Tasks
                </Typography>
              </Box>
              <Typography variant="subtitle2" color="text.secondary">
                5/8 Completed
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={62.5} 
              sx={{ 
                height: 8, 
                borderRadius: 4, 
                bgcolor: alpha(theme.palette.success.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  bgcolor: theme.palette.success.main,
                }
              }} 
            />
            <Box sx={{ mt: 2 }}>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    textDecoration: 'line-through',
                    color: 'text.disabled'
                  }}>
                    <CheckCircleIcon fontSize="small" sx={{ mr: 1, color: theme.palette.success.main }} />
                    Complete Math Homework
                  </Typography>
                  <Typography variant="caption" color="text.disabled">9:00 AM</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ 
                      width: 18, 
                      height: 18, 
                      borderRadius: '50%', 
                      border: `2px solid ${theme.palette.warning.main}`,
                      mr: 1
                    }} />
                    Prepare Physics Lab Report
                  </Typography>
                  <Typography variant="caption" color="text.secondary">3:00 PM</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ 
                      width: 18, 
                      height: 18, 
                      borderRadius: '50%', 
                      border: `2px solid ${theme.palette.error.main}`,
                      mr: 1
                    }} />
                    English Speech Practice (15 min)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">5:30 PM</Typography>
                </Box>
              </Stack>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                endIcon={<ArrowForwardIcon />} 
                size="small" 
                color="primary"
                className="button-hover"
              >
                View All
              </Button>
            </Box>
          </Paper>
        </Box>
        
        {/* Mood status card */}
        <Box sx={{ width: { xs: '100%', md: '48%', lg: '23%' } }} className="stagger-item-2">
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              borderRadius: 3, 
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: `0 8px 25px -15px ${alpha(theme.palette.primary.main, 0.5)}`,
                transform: 'translateY(-5px)',
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  <MoodIcon />
                </Avatar>
                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                  Mood Status
                </Typography>
              </Box>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.1), 
                  px: 1.5, 
                  py: 0.5,
                  borderRadius: 5,
                  fontWeight: 'medium',
                }}
              >
                Good
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 'bold',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                85
              </Typography>
              <Box sx={{ ml: 2 }}>
                <Typography variant="caption" color="text.secondary">Last Week Average</Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: theme.palette.success.main }}>
                  75 <ArrowForwardIcon sx={{ fontSize: 16, mx: 0.5 }} /> 85
                </Typography>
              </Box>
            </Box>
            <Box sx={{ 
              p: 1.5, 
              borderRadius: 2, 
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              display: 'flex',
              alignItems: 'center',
              mb: 2
            }}>
              <Typography variant="body2" color="text.secondary">
                Your mood has been steadily improving. Maintaining this state helps boost your study efficiency!
              </Typography>
            </Box>
            <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                endIcon={<ArrowForwardIcon />} 
                size="small" 
                color="primary"
                className="button-hover"
              >
                Mood History
              </Button>
            </Box>
          </Paper>
        </Box>
        
        {/* Health data card */}
        <Box sx={{ width: { xs: '100%', md: '48%', lg: '23%' } }} className="stagger-item-3">
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              borderRadius: 3, 
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: `0 8px 25px -15px ${alpha(theme.palette.primary.main, 0.5)}`,
                transform: 'translateY(-5px)',
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main }}>
                  <DirectionsRunIcon />
                </Avatar>
                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                  Health Data
                </Typography>
              </Box>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ width: 'calc(50% - 8px)' }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.info.main, 0.05),
                    textAlign: 'center',
                  }}
                >
                  <BedtimeIcon color="info" />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                    7.5 hours
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg. Sleep
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ width: 'calc(50% - 8px)' }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.success.main, 0.05),
                    textAlign: 'center',
                  }}
                >
                  <FitnessCenterIcon color="success" />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                    45 mins
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Daily Exercise
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Screen Time</Typography>
                <Typography variant="subtitle2" fontWeight="medium">4.5 hours/day</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={75} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3, 
                      bgcolor: alpha(theme.palette.warning.light, 0.2),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: theme.palette.warning.main,
                      }
                    }} 
                  />
                </Box>
                <Typography variant="caption" color="warning.main">75%</Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                endIcon={<ArrowForwardIcon />} 
                size="small" 
                color="primary"
                className="button-hover"
              >
                Full Report
              </Button>
            </Box>
          </Paper>
        </Box>
        
        {/* Learning goals card */}
        <Box sx={{ width: { xs: '100%', md: '48%', lg: '23%' } }} className="stagger-item-4">
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              borderRadius: 3, 
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: `0 8px 25px -15px ${alpha(theme.palette.primary.main, 0.5)}`,
                transform: 'translateY(-5px)',
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: theme.palette.secondary.main }}>
                  <SchoolIcon />
                </Avatar>
                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                  Learning Goals
                </Typography>
              </Box>
              <Typography variant="subtitle2" color="text.secondary">3 Active Goals</Typography>
            </Box>
            <Box sx={{ mt: 1, mb: 2 }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  mb: 2,
                  bgcolor: alpha(theme.palette.secondary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">Final Exam Prep</Typography>
                  <Typography variant="caption" sx={{ 
                    bgcolor: alpha(theme.palette.error.main, 0.1), 
                    color: theme.palette.error.main,
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontWeight: 'medium'
                  }}>
                    High Priority
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={60} 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3, 
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: theme.palette.secondary.main,
                        }
                      }} 
                    />
                  </Box>
                  <Typography variant="caption" color="secondary.main">60%</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  15 days left to complete this goal
                </Typography>
              </Paper>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmojiEventsIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.warning.main }} />
                  English Proficiency Test
                </Typography>
                <Typography variant="caption" color="text.secondary">75%</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmojiEventsIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.success.main }} />
                  Python Learning
                </Typography>
                <Typography variant="caption" color="text.secondary">40%</Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                endIcon={<ArrowForwardIcon />} 
                size="small" 
                color="primary"
                className="button-hover"
              >
                Manage Goals
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Chart area */}
      <Box sx={{ mb: 4 }} className="fade-in">
        <Typography 
          variant="h5" 
          className="fade-in" 
          sx={{ 
            mb: 3, 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            '&::before': {
              content: '""',
              width: 4,
              height: 24,
              backgroundColor: theme.palette.primary.main,
              display: 'inline-block',
              borderRadius: 4,
              mr: 1.5,
            }
          }}
        >
          Data Insights
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2,
          pb: 2,
          borderBottom: `1px dashed ${alpha(theme.palette.divider, 0.3)}`,
        }} className="fade-in">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: alpha(theme.palette.background.paper, 0.5),
            borderRadius: 3,
            p: 0.5,
            boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.04)}`
          }}>
            <Button 
              variant={activePeriod === 'Day' ? 'contained' : 'text'} 
              size="small"
              onClick={() => handlePeriodChange('Day')}
              sx={{ 
                minWidth: 64, 
                borderRadius: 2,
                color: activePeriod === 'Day' ? 'white' : 'text.secondary',
              }}
            >
              Day
            </Button>
            <Button 
              variant={activePeriod === 'Week' ? 'contained' : 'text'} 
              size="small"
              onClick={() => handlePeriodChange('Week')}
              sx={{ 
                minWidth: 64, 
                borderRadius: 2,
                color: activePeriod === 'Week' ? 'white' : 'text.secondary',
              }}
            >
              Week
            </Button>
            <Button 
              variant={activePeriod === 'Month' ? 'contained' : 'text'} 
              size="small"
              onClick={() => handlePeriodChange('Month')}
              sx={{ 
                minWidth: 64, 
                borderRadius: 2,
                color: activePeriod === 'Month' ? 'white' : 'text.secondary',
              }}
            >
              Month
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="outlined" 
              startIcon={<FilterAltIcon />}
              size="small"
              sx={{ 
                borderRadius: 2,
                borderColor: alpha(theme.palette.primary.main, 0.3),
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                }
              }}
            >
              Filter
            </Button>
            <Button 
              variant="contained" 
              disableElevation
              size="small"
              sx={{ 
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.8),
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                }
              }}
            >
              Export
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }} className="fade-in">
          {/* Mood trend chart */}
          <Box sx={{ width: { xs: '100%', md: '100%', lg: '60%' } }} className="stagger-item-1">
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 3, 
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 10px 30px -15px ${alpha(theme.palette.primary.main, 0.3)}`,
                },
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Chart decorative accent */}
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: -30, 
                  right: -30, 
                  width: 150, 
                  height: 150, 
                  borderRadius: '50%', 
                  background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.03)} 0%, transparent 70%)`,
                  zIndex: 0 
                }}
              />
              
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Mood & Health Trends
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Track your emotional and physical well-being over time
                    </Typography>
                  </Box>
                  <IconButton 
                    size="small" 
                    sx={{ 
                      backgroundColor: alpha(theme.palette.background.paper, 0.6),
                      '&:hover': { backgroundColor: alpha(theme.palette.background.paper, 0.8) }
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  mb: 3, 
                  gap: 2,
                  pb: 2,
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}>
                  <Box sx={{ 
                    px: 2, 
                    py: 1, 
                    borderRadius: 6, 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      bgcolor: theme.palette.primary.main,
                      mr: 1,
                      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                    }} />
                    <Typography variant="caption" fontWeight="bold" color={theme.palette.primary.main}>
                      Mood Index
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    px: 2, 
                    py: 1, 
                    borderRadius: 6, 
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                  }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      bgcolor: theme.palette.secondary.main,
                      mr: 1,
                      boxShadow: `0 0 0 2px ${alpha(theme.palette.secondary.main, 0.2)}`,
                    }} />
                    <Typography variant="caption" fontWeight="bold" color={theme.palette.secondary.main}>
                      Sleep Quality
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ height: 300, mt: 1 }}>
                  <Line data={moodData} options={chartOptions} />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Average Mood
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color={theme.palette.primary.main}>
                      78.3 / 100
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Trend
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color={theme.palette.success.main} sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon sx={{ mr: 0.5, fontSize: 20 }} />
                      +12%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Sleep Quality
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color={theme.palette.secondary.main}>
                      Good
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>
          
          {/* Screen time distribution */}
          <Box sx={{ width: { xs: '100%', md: '100%', lg: '40%' } }} className="stagger-item-2">
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 3, 
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 10px 30px -15px ${alpha(theme.palette.primary.main, 0.3)}`,
                },
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative pattern */}
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: -20, 
                  right: -20, 
                  width: 120, 
                  height: 120, 
                  borderRadius: '50%', 
                  background: `radial-gradient(circle, ${alpha(theme.palette.warning.main, 0.03)} 0%, transparent 70%)`,
                  zIndex: 0 
                }}
              />
              
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Screen Time
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      How you're spending time on your devices
                    </Typography>
                  </Box>
                  <Chip 
                    label="Today" 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                    sx={{ fontWeight: 'medium' }}
                  />
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ height: 220, display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <Doughnut data={screenTimeData} options={doughnutOptions} />
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  flexWrap: 'wrap', 
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.background.paper, 0.4),
                  border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`,
                }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="medium">
                      TOTAL TODAY
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      4h 25m
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="medium">
                      VS YESTERDAY
                    </Typography>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold" 
                      color={theme.palette.success.main}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      -30min
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="medium">
                      GOAL
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      &lt; 5h
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
      
      {/* Quick access area */}
      <Box sx={{ mb: 4 }} className="fade-in">
        <Typography 
          variant="h5" 
          className="fade-in" 
          sx={{ 
            mb: 3, 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            '&::before': {
              content: '""',
              width: 4,
              height: 24,
              backgroundColor: theme.palette.primary.main,
              display: 'inline-block',
              borderRadius: 4,
              mr: 1.5,
            }
          }}
        >
          Quick Access
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3,
            justifyContent: 'space-between',
            mt: 3, 
          }} 
          className="fade-in"
        >
          <Box 
            component={Card} 
            elevation={0}
            sx={{ 
              width: { xs: '100%', sm: '48%', md: '31%' },
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 10px 25px -10px ${alpha(theme.palette.primary.main, 0.3)}`,
                '& .overlay': {
                  opacity: 1,
                },
                '& .card-content': {
                  transform: 'translateY(-5px)',
                }
              },
            }}
            className="stagger-item-1"
          >
            {/* Background gradient */}
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 90,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.4)} 100%)`,
                zIndex: 0
              }}
            />
            
            {/* Content */}
            <Box 
              className="card-content"
              sx={{ 
                p: 3, 
                position: 'relative',
                zIndex: 1,
                transition: 'all 0.3s ease',
              }}
            >
              <Box 
                sx={{ 
                  mb: 3,
                  mt: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: 'white',
                    color: theme.palette.primary.main,
                    boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.3)}`,
                    width: 48,
                    height: 48,
                  }}
                >
                  <CalendarMonthIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Badge badgeContent="2" color="error">
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 3,
                      fontWeight: 'bold',
                      bgcolor: alpha('#ffffff', 0.9),
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    TODAY
                  </Typography>
                </Badge>
              </Box>
              
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                Calendar
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                View and manage your schedule and upcoming events
              </Typography>
              
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  mt: 2,
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  }
                }}
              >
                Open Calendar
              </Button>
            </Box>
            
            {/* Hover overlay */}
            <Box 
              className="overlay"
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(180deg, transparent 50%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                opacity: 0,
                transition: 'all 0.3s ease',
                zIndex: 0
              }}
            />
          </Box>
          
          <Box 
            component={Card} 
            elevation={0}
            sx={{ 
              width: { xs: '100%', sm: '48%', md: '31%' },
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 10px 25px -10px ${alpha(theme.palette.success.main, 0.3)}`,
                '& .overlay': {
                  opacity: 1,
                },
                '& .card-content': {
                  transform: 'translateY(-5px)',
                }
              },
            }}
            className="stagger-item-2"
          >
            {/* Background gradient */}
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 90,
                background: `linear-gradient(135deg, ${alpha(theme.palette.success.light, 0.2)} 0%, ${alpha(theme.palette.success.main, 0.4)} 100%)`,
                zIndex: 0
              }}
            />
            
            {/* Content */}
            <Box 
              className="card-content"
              sx={{ 
                p: 3, 
                position: 'relative',
                zIndex: 1,
                transition: 'all 0.3s ease',
              }}
            >
              <Box 
                sx={{ 
                  mb: 3,
                  mt: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: 'white',
                    color: theme.palette.success.main,
                    boxShadow: `0 4px 10px ${alpha(theme.palette.success.main, 0.3)}`,
                    width: 48,
                    height: 48,
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Badge badgeContent="3" color="error">
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 3,
                      fontWeight: 'bold',
                      bgcolor: alpha('#ffffff', 0.9),
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    PENDING
                  </Typography>
                </Badge>
              </Box>
              
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                Tasks
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Manage your to-do list and track your progress
              </Typography>
              
              <Button
                variant="outlined"
                color="success"
                fullWidth
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  mt: 2,
                  borderColor: alpha(theme.palette.success.main, 0.5),
                  '&:hover': {
                    borderColor: theme.palette.success.main,
                    backgroundColor: alpha(theme.palette.success.main, 0.05),
                  }
                }}
              >
                View Tasks
              </Button>
            </Box>
            
            {/* Hover overlay */}
            <Box 
              className="overlay"
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(180deg, transparent 50%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                opacity: 0,
                transition: 'all 0.3s ease',
                zIndex: 0
              }}
            />
          </Box>
          
          <Box 
            component={Card} 
            elevation={0}
            sx={{ 
              width: { xs: '100%', sm: '100%', md: '31%' },
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 10px 25px -10px ${alpha(theme.palette.info.main, 0.3)}`,
                '& .overlay': {
                  opacity: 1,
                },
                '& .card-content': {
                  transform: 'translateY(-5px)',
                }
              },
            }}
            className="stagger-item-3"
          >
            {/* Background gradient */}
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 90,
                background: `linear-gradient(135deg, ${alpha(theme.palette.info.light, 0.2)} 0%, ${alpha(theme.palette.info.main, 0.4)} 100%)`,
                zIndex: 0
              }}
            />
            
            {/* Content */}
            <Box 
              className="card-content"
              sx={{ 
                p: 3, 
                position: 'relative',
                zIndex: 1,
                transition: 'all 0.3s ease',
              }}
            >
              <Box 
                sx={{ 
                  mb: 3,
                  mt: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: 'white',
                    color: theme.palette.info.main,
                    boxShadow: `0 4px 10px ${alpha(theme.palette.info.main, 0.3)}`,
                    width: 48,
                    height: 48,
                  }}
                >
                  <DirectionsRunIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 3,
                    fontWeight: 'bold',
                    bgcolor: alpha('#ffffff', 0.9),
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  HEALTH
                </Typography>
              </Box>
              
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                Health Data
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Monitor your wellness metrics and activity patterns
              </Typography>
              
              <Button
                variant="outlined"
                color="info"
                fullWidth
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  mt: 2,
                  borderColor: alpha(theme.palette.info.main, 0.5),
                  '&:hover': {
                    borderColor: theme.palette.info.main,
                    backgroundColor: alpha(theme.palette.info.main, 0.05),
                  }
                }}
              >
                View Health
              </Button>
            </Box>
            
            {/* Hover overlay */}
            <Box 
              className="overlay"
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(180deg, transparent 50%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
                opacity: 0,
                transition: 'all 0.3s ease',
                zIndex: 0
              }}
            />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard; 
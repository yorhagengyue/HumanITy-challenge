import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  CardHeader,
  Stack,
  useTheme,
  alpha,
  IconButton,
  Tooltip
} from '@mui/material';
import { keyframes } from '@mui/system';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import MoodIcon from '@mui/icons-material/Mood';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RefreshIcon from '@mui/icons-material/Refresh';

// Define animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [activeEmotion, setActiveEmotion] = useState<string | null>(null);

  const handleEmotionClick = (emoji: string) => {
    setActiveEmotion(emoji);
  };

  return (
    <Container maxWidth="xl">
      <Box 
        sx={{ 
          mb: 4,
          animation: `${fadeIn} 0.6s ease-out`,
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Welcome to MyLife Companion! Here's your daily overview.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Quick Actions */}
        <Box 
          sx={{ 
            width: '100%',
            animation: `${fadeIn} 0.6s ease-out`,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
            }
          }}
        >
          <Paper 
            elevation={3}
            sx={{ 
              p: 2, 
              mb: 3, 
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: 'white',
              borderRadius: 3,
              boxShadow: `0 8px 32px -8px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Today's Focus
            </Typography>
            <Typography variant="body1">
              Complete your morning routine and prepare for the exam tomorrow.
            </Typography>
          </Paper>
        </Box>

        {/* Calendar Widget */}
        <Box 
          sx={{ 
            width: { xs: '100%', md: '48%', lg: '32%' },
            animation: `${fadeIn} 0.7s ease-out`,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: `0 10px 40px -10px ${alpha(theme.palette.primary.main, 0.2)}`,
            }
          }}
        >
          <Card 
            elevation={2}
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <CardHeader 
              avatar={
                <Box 
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CalendarMonthIcon color="primary" />
                </Box>
              }
              action={
                <Tooltip title="More options">
                  <IconButton size="small">
                    <MoreHorizIcon />
                  </IconButton>
                </Tooltip>
              }
              title={
                <Typography fontWeight="bold">Upcoming Events</Typography>
              }
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.03),
                borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.05)}`,
              }}
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 1.5,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: `0 4px 8px -4px ${alpha(theme.palette.primary.main, 0.2)}`,
                    } 
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    10:00 AM - 11:30 AM
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Math Study Group
                  </Typography>
                </Paper>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 1.5,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: `0 4px 8px -4px ${alpha(theme.palette.primary.main, 0.2)}`,
                    } 
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    2:00 PM - 4:00 PM
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Physics Lab
                  </Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Tasks Widget */}
        <Box 
          sx={{ 
            width: { xs: '100%', md: '48%', lg: '32%' },
            animation: `${fadeIn} 0.8s ease-out`,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: `0 10px 40px -10px ${alpha(theme.palette.primary.main, 0.2)}`,
            }
          }}
        >
          <Card 
            elevation={2}
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <CardHeader 
              avatar={
                <Box 
                  sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircleIcon color="success" />
                </Box>
              }
              action={
                <Tooltip title="Refresh tasks">
                  <IconButton size="small">
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              }
              title={
                <Typography fontWeight="bold">Tasks</Typography>
              }
              sx={{
                bgcolor: alpha(theme.palette.success.main, 0.03),
                borderBottom: `1px solid ${alpha(theme.palette.success.main, 0.05)}`,
              }}
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 1.5,
                    borderLeft: `3px solid ${alpha(theme.palette.success.main, 0.5)}`,
                    bgcolor: alpha(theme.palette.success.main, 0.02),
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateX(5px)',
                    }
                  }}
                >
                  <Typography variant="subtitle2" sx={{ textDecoration: 'line-through', opacity: 0.7 }}>
                    Complete math problems (Set A)
                  </Typography>
                </Paper>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 1.5,
                    borderLeft: `3px solid ${alpha(theme.palette.warning.main, 0.7)}`,
                    bgcolor: alpha(theme.palette.warning.main, 0.02),
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateX(5px)',
                    }
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="medium">
                    Read chapter 5 of Physics textbook
                  </Typography>
                </Paper>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 1.5,
                    borderLeft: `3px solid ${alpha(theme.palette.error.main, 0.7)}`,
                    bgcolor: alpha(theme.palette.error.main, 0.02),
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateX(5px)',
                    }
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="medium">
                    Prepare presentation slides
                  </Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Health Data Widget */}
        <Box 
          sx={{ 
            width: { xs: '100%', md: '48%', lg: '32%' },
            animation: `${fadeIn} 0.9s ease-out`,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: `0 10px 40px -10px ${alpha(theme.palette.primary.main, 0.2)}`,
            }
          }}
        >
          <Card 
            elevation={2}
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <CardHeader 
              avatar={
                <Box 
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BedtimeIcon color="info" />
                </Box>
              }
              title={
                <Typography fontWeight="bold">Health Metrics</Typography>
              }
              sx={{
                bgcolor: alpha(theme.palette.info.main, 0.03),
                borderBottom: `1px solid ${alpha(theme.palette.info.main, 0.05)}`,
              }}
            />
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box 
                  sx={{ 
                    width: '50%',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-7px)',
                    }
                  }}
                >
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 1.5, 
                      textAlign: 'center', 
                      borderRadius: 2,
                      background: `linear-gradient(145deg, ${alpha(theme.palette.info.light, 0.05)}, ${alpha(theme.palette.info.main, 0.1)})`,
                      boxShadow: `0 5px 15px -5px ${alpha(theme.palette.info.main, 0.2)}`,
                    }}
                  >
                    <BedtimeIcon color="info" />
                    <Typography variant="h5" fontWeight="bold" color="info.main">7.5h</Typography>
                    <Typography variant="body2" color="text.secondary">Sleep</Typography>
                  </Paper>
                </Box>
                <Box 
                  sx={{ 
                    width: '50%',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-7px)',
                    }
                  }}
                >
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 1.5, 
                      textAlign: 'center', 
                      borderRadius: 2,
                      background: `linear-gradient(145deg, ${alpha(theme.palette.success.light, 0.05)}, ${alpha(theme.palette.success.main, 0.1)})`,
                      boxShadow: `0 5px 15px -5px ${alpha(theme.palette.success.main, 0.2)}`,
                    }}
                  >
                    <DirectionsRunIcon color="success" />
                    <Typography variant="h5" fontWeight="bold" color="success.main">3,500</Typography>
                    <Typography variant="body2" color="text.secondary">Steps</Typography>
                  </Paper>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Mood Tracker */}
        <Box 
          sx={{ 
            width: { xs: '100%', md: '48%' },
            animation: `${fadeIn} 1s ease-out`,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: `0 10px 40px -10px ${alpha(theme.palette.primary.main, 0.2)}`,
            }
          }}
        >
          <Card 
            elevation={2}
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <CardHeader 
              avatar={
                <Box 
                  sx={{
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MoodIcon color="secondary" />
                </Box>
              }
              title={
                <Typography fontWeight="bold">Mood Tracker</Typography>
              }
              sx={{
                bgcolor: alpha(theme.palette.secondary.main, 0.03),
                borderBottom: `1px solid ${alpha(theme.palette.secondary.main, 0.05)}`,
              }}
            />
            <CardContent>
              <Typography variant="body1" gutterBottom>
                How are you feeling today?
              </Typography>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  justifyContent: 'space-around',
                  borderRadius: 2,
                  background: `linear-gradient(145deg, white, ${alpha(theme.palette.secondary.light, 0.1)})`,
                }}
              >
                {['😊', '😐', '😢', '😠', '😴'].map((emoji) => (
                  <Typography 
                    key={emoji} 
                    variant="h4" 
                    component="button"
                    onClick={() => handleEmotionClick(emoji)}
                    sx={{ 
                      background: 'none',
                      border: emoji === activeEmotion ? `2px solid ${theme.palette.secondary.main}` : 'none',
                      borderRadius: '50%',
                      padding: emoji === activeEmotion ? '5px' : '7px',
                      cursor: 'pointer',
                      fontSize: '2rem',
                      '&:hover': { 
                        transform: 'scale(1.2)',
                        animation: `${pulse} 0.6s infinite`
                      },
                      transition: 'all 0.2s',
                      boxShadow: emoji === activeEmotion ? `0 0 15px ${alpha(theme.palette.secondary.main, 0.5)}` : 'none',
                    }}
                  >
                    {emoji}
                  </Typography>
                ))}
              </Paper>
            </CardContent>
          </Card>
        </Box>

        {/* Emotional Support Widget */}
        <Box 
          sx={{ 
            width: { xs: '100%', md: '48%' },
            animation: `${fadeIn} 1.1s ease-out`,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: `0 10px 40px -10px ${alpha(theme.palette.primary.main, 0.2)}`,
            }
          }}
        >
          <Card 
            elevation={2}
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background: `linear-gradient(160deg, ${alpha(theme.palette.primary.light, 0.15)}, transparent)`,
                zIndex: 0,
              }
            }}
          >
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Need someone to talk to?
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Your AI companion is here to listen and support you.
              </Typography>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    cursor: 'pointer',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    color: 'white',
                    boxShadow: `0 5px 20px -5px ${alpha(theme.palette.primary.main, 0.6)}`,
                    transition: 'all 0.3s',
                    '&:hover': { 
                      transform: 'scale(1.03)',
                      boxShadow: `0 8px 25px -5px ${alpha(theme.palette.primary.main, 0.8)}`,
                    },
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Start a conversation
                  </Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard; 
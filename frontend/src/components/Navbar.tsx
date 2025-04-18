import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  Container, 
  Avatar, 
  Button, 
  Tooltip, 
  MenuItem,
  useTheme,
  alpha,
  Badge
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LogoutIcon from '@mui/icons-material/Logout';
import LockIcon from '@mui/icons-material/Lock';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ForumIcon from '@mui/icons-material/Forum';
import { logout } from '../services/auth.service';

const pages = [
  { name: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { name: 'Calendar', path: '/calendar', icon: <CalendarMonthIcon /> },
  { name: 'Tasks', path: '/tasks', icon: <AssignmentIcon /> },
  { name: 'Health', path: '/health-data', icon: <MonitorHeartIcon /> },
  { name: 'Support', path: '/emotional-support', icon: <SupportAgentIcon /> },
];

const settings = [
  { name: 'Profile', path: '/profile' },
  { name: 'Account', path: '/profile' },
  { name: 'Settings', path: '/settings' },
  { name: 'Logout', path: '#' }
];

const Navbar: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [isPrivateMode, setIsPrivateMode] = useState(() => {
    return localStorage.getItem('calendar_private_mode') === 'true';
  });
  
  useEffect(() => {
    const savedPrivateMode = localStorage.getItem('calendar_private_mode') === 'true';
    setIsPrivateMode(savedPrivateMode);
  }, []);
  
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'calendar_private_mode') {
        setIsPrivateMode(e.newValue === 'true');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    const handleCustomEvent = () => {
      const savedPrivateMode = localStorage.getItem('calendar_private_mode') === 'true';
      setIsPrivateMode(savedPrivateMode);
    };
    
    window.addEventListener('private-mode-change', handleCustomEvent);
    
    const intervalId = setInterval(() => {
      const currentPrivateMode = localStorage.getItem('calendar_private_mode') === 'true';
      if (currentPrivateMode !== isPrivateMode) {
        setIsPrivateMode(currentPrivateMode);
      }
    }, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('private-mode-change', handleCustomEvent);
      clearInterval(intervalId);
    };
  }, [isPrivateMode]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const toggleDarkMode = () => {
    const newMode = !isPrivateMode;
    setIsPrivateMode(newMode);
    localStorage.setItem('calendar_private_mode', newMode.toString());
    
    window.dispatchEvent(new CustomEvent('private-mode-change'));
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <AppBar 
      position="sticky" 
      color="default"
      elevation={0}
      sx={{ 
        backgroundColor: isPrivateMode ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${isPrivateMode ? theme.palette.divider : 'rgba(0, 0, 0, 0.06)'}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for large screens */}
          <Box
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              mr: 2 
            }}
            className="logo-animation"
          >
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
              }}
            >
              {/* Logo Shield/Badge */}
              <Box
                sx={{
                  position: 'relative',
                  height: 44,
                  width: 44,
                  mr: 2,
                }}
              >
                {/* Main Shield */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                    borderRadius: '50% 50% 45% 45%',
                    background: `linear-gradient(135deg, 
                      ${theme.palette.primary.dark} 0%, 
                      ${theme.palette.primary.main} 40%,
                      ${theme.palette.primary.light} 100%)`,
                    boxShadow: `0 4px 10px ${alpha(theme.palette.primary.dark, 0.3)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      borderRadius: 'inherit',
                      background: `linear-gradient(160deg, 
                        ${alpha('#ffffff', 0.7)} 0%, 
                        ${alpha('#ffffff', 0)} 60%)`,
                      opacity: 0.6,
                    }
                  }}
                >
                  {/* Brain Icon */}
                  <PsychologyIcon sx={{ 
                    color: 'white', 
                    fontSize: 24,
                    position: 'relative',
                    top: -2,
                    filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))',
                    zIndex: 2,
                  }} />
                </Box>
                
                {/* Inner Border */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 3,
                    left: 3,
                    height: 'calc(100% - 6px)',
                    width: 'calc(100% - 6px)',
                    borderRadius: '50% 50% 45% 45%',
                    border: `1px solid ${alpha('#ffffff', 0.4)}`,
                    zIndex: 1,
                  }}
                />

                {/* Heart Accent */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 2,
                    right: 2,
                    height: 12,
                    width: 12,
                    borderRadius: '50%',
                    background: theme.palette.secondary.main,
                    boxShadow: `0 2px 5px ${alpha(theme.palette.secondary.main, 0.5)}`,
                    zIndex: 2,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 2,
                      left: 2,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      border: `1px solid ${alpha('#ffffff', 0.7)}`,
                    }
                  }}
                >
                </Box>
              </Box>
             
              {/* Text */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Montserrat", sans-serif',
                    fontWeight: 800,
                    letterSpacing: '0.02rem',
                    lineHeight: 1,
                    fontSize: '1.3rem',
                    mb: 0.2,
                  }}
                >
                  <Box 
                    component="span" 
                    sx={{ 
                      color: theme.palette.primary.dark,
                      textShadow: `1px 1px 0 ${alpha(theme.palette.primary.main, 0.3)}`,
                    }}
                  >
                    My
                  </Box>
                  <Box 
                    component="span" 
                    sx={{ 
                      color: theme.palette.primary.main,
                      textShadow: `1px 1px 0 ${alpha(theme.palette.primary.main, 0.3)}`,
                    }}
                  >
                    Life
                  </Box>
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    position: 'relative',
                    fontFamily: '"Montserrat", sans-serif',
                    letterSpacing: '0.15rem',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    color: alpha(theme.palette.text.secondary, 0.9),
                    textTransform: 'uppercase',
                    pl: 0.5,
                    mt: -0.5,
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      height: '1px',
                      width: '14px',
                      background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
                      bottom: -2,
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }
                  }}
                >
                  Companion
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.name} 
                  onClick={handleCloseNavMenu}
                  component={Link}
                  to={page.path}
                  selected={location.pathname === page.path}
                  sx={{
                    backgroundColor: location.pathname === page.path ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ mr: 1, color: location.pathname === page.path ? 'primary.main' : 'inherit' }}>
                      {page.icon}
                    </Box>
                    <Typography textAlign="center">{page.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo for small screens */}
          <Box
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            {/* Mini Shield Logo */}
            <Box
              sx={{
                position: 'relative',
                height: 34,
                width: 34,
                mr: 1.5,
              }}
            >
              {/* Main Shield */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: '100%',
                  borderRadius: '50% 50% 45% 45%',
                  background: `linear-gradient(135deg, 
                    ${theme.palette.primary.dark} 0%, 
                    ${theme.palette.primary.main} 40%,
                    ${theme.palette.primary.light} 100%)`,
                  boxShadow: `0 3px 8px ${alpha(theme.palette.primary.dark, 0.3)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: 'inherit',
                    background: `linear-gradient(160deg, 
                      ${alpha('#ffffff', 0.7)} 0%, 
                      ${alpha('#ffffff', 0)} 60%)`,
                    opacity: 0.6,
                  }
                }}
              >
                <PsychologyIcon sx={{ 
                  color: 'white', 
                  fontSize: 18,
                  position: 'relative',
                  top: -1,
                  filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))',
                  zIndex: 2,
                }} />
              </Box>
              
              {/* Inner Border */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 2,
                  left: 2,
                  height: 'calc(100% - 4px)',
                  width: 'calc(100% - 4px)',
                  borderRadius: '50% 50% 45% 45%',
                  border: `1px solid ${alpha('#ffffff', 0.4)}`,
                  zIndex: 1,
                }}
              />

              {/* Heart Accent */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 2,
                  right: 2,
                  height: 8,
                  width: 8,
                  borderRadius: '50%',
                  background: theme.palette.secondary.main,
                  boxShadow: `0 1px 3px ${alpha(theme.palette.secondary.main, 0.5)}`,
                  zIndex: 2,
                }}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 800,
                letterSpacing: '0',
                fontSize: '1.1rem',
                color: theme.palette.primary.main,
                textShadow: `1px 1px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              MyLife
            </Typography>
          </Box>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, index) => (
              <Box 
                key={page.name}
                className={`stagger-item-${index + 1} fade-in`}
              >
                <Button
                  component={Link}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                  className={location.pathname === page.path ? "nav-active" : "button-hover"}
                  sx={{
                    my: 2,
                    mx: 1,
                    px: 2,
                    display: 'flex',
                    alignItems: 'center',
                    color: location.pathname === page.path ? 'primary.main' : 'text.primary',
                    position: 'relative',
                    fontWeight: location.pathname === page.path ? 'bold' : 'normal',
                    '&::after': location.pathname === page.path ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '30%',
                      height: 3,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '4px',
                    } : {},
                  }}
                >
                  <Box sx={{ mr: 1 }}>{page.icon}</Box>
                  {page.name}
                </Button>
              </Box>
            ))}
          </Box>

          {/* Right side actions */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Dark mode toggle - 更新图标 */}
            <Tooltip title={isPrivateMode ? "Exit Private Mode" : "Enter Private Mode"}>
              <IconButton 
                onClick={toggleDarkMode}
                color="inherit"
                className="hover-rotate"
              >
                {isPrivateMode ? <Brightness7Icon /> : <LockIcon />}
              </IconButton>
            </Tooltip>
            
            {/* Notifications */}
            <IconButton 
              color="inherit"
              sx={{ ml: 1 }}
              className="hover-scale"
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            {/* User menu */}
            <Box sx={{ ml: 2 }}>
              <Tooltip title="Open settings">
                <IconButton 
                  onClick={handleOpenUserMenu} 
                  sx={{ p: 0 }}
                  className="hover-scale"
                >
                  <Avatar 
                    alt="User Avatar" 
                    src="/static/images/avatar/1.jpg"
                    sx={{ 
                      border: `2px solid ${theme.palette.primary.main}`,
                      background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                    }}
                    className={anchorElUser ? "pulse" : ""}
                  >
                    <AccountCircleIcon />
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem 
                    key={setting.name} 
                    onClick={setting.name === "Logout" ? handleLogout : handleCloseUserMenu}
                    component={setting.name === "Logout" ? "button" : Link}
                    to={setting.path !== "#" ? setting.path : undefined}
                  >
                    <Typography textAlign="center">{setting.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 
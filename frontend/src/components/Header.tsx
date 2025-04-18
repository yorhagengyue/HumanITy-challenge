import React, { useState } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Avatar, 
  Menu, 
  MenuItem, 
  Tooltip 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { logout } from '../services/auth.service';

interface HeaderProps {
  handleDrawerToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleDrawerToggle }) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: 'none',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1 }}
        >
          MyLife Companion
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" sx={{ mr: 2 }}>
            <NotificationsIcon />
          </IconButton>
          
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="User" src="/static/images/avatar/default.jpg" />
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
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography textAlign="center">Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography textAlign="center">Account</Typography>
            </MenuItem>
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography textAlign="center">Settings</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 
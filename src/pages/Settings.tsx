import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  ListItemButton,
} from '@mui/material';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import LanguageIcon from '@mui/icons-material/Language';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SecurityIcon from '@mui/icons-material/Security';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'english',
    notifications: true,
    dataSaving: false,
    autoBackup: true,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleChange = (name: string, value: any) => {
    setSettings({
      ...settings,
      [name]: value,
    });
    
    // Show saved confirmation
    setSnackbarMessage('Settings updated successfully');
    setSnackbarOpen(true);
  };

  const handleDeleteData = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = () => {
    // This would typically communicate with a backend to delete user data
    setOpenDialog(false);
    setSnackbarMessage('Your data has been deleted');
    setSnackbarOpen(true);
  };

  const handleExportData = () => {
    // In a real app, this would trigger a data export
    setSnackbarMessage('Your data has been exported');
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Configure your application preferences
        </Typography>
      </Box>

      <Paper elevation={1}>
        <List>
          {/* Appearance */}
          <ListItem>
            <ListItemIcon>
              <ColorLensIcon />
            </ListItemIcon>
            <ListItemText
              primary="Theme"
              secondary="Choose how the application looks"
            />
            <FormControl sx={{ minWidth: 120 }}>
              <Select
                value={settings.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                size="small"
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="system">System Default</MenuItem>
              </Select>
            </FormControl>
          </ListItem>

          <Divider />

          {/* Language */}
          <ListItem>
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText
              primary="Language"
              secondary="Select your preferred language"
            />
            <FormControl sx={{ minWidth: 120 }}>
              <Select
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                size="small"
              >
                <MenuItem value="english">English</MenuItem>
                <MenuItem value="chinese">Chinese</MenuItem>
                <MenuItem value="malay">Malay</MenuItem>
                <MenuItem value="tamil">Tamil</MenuItem>
              </Select>
            </FormControl>
          </ListItem>

          <Divider />

          {/* Notifications */}
          <ListItem>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Notifications"
              secondary="Enable or disable push notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications}
                  onChange={(e) => handleChange('notifications', e.target.checked)}
                  color="primary"
                />
              }
              label=""
            />
          </ListItem>

          <Divider />

          {/* Data Saving */}
          <ListItem>
            <ListItemIcon>
              <DataUsageIcon />
            </ListItemIcon>
            <ListItemText
              primary="Data Saving Mode"
              secondary="Reduce data usage when on mobile networks"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.dataSaving}
                  onChange={(e) => handleChange('dataSaving', e.target.checked)}
                  color="primary"
                />
              }
              label=""
            />
          </ListItem>

          <Divider />

          {/* Auto Backup */}
          <ListItem>
            <ListItemIcon>
              <SecurityIcon />
            </ListItemIcon>
            <ListItemText
              primary="Automatic Backup"
              secondary="Regularly back up your data to the cloud"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoBackup}
                  onChange={(e) => handleChange('autoBackup', e.target.checked)}
                  color="primary"
                />
              }
              label=""
            />
          </ListItem>

          <Divider />

          {/* Export Data */}
          <ListItem disablePadding>
            <ListItemButton onClick={handleExportData}>
              <ListItemIcon>
                <CloudDownloadIcon />
              </ListItemIcon>
              <ListItemText
                primary="Export Your Data"
                secondary="Download a copy of all your data"
              />
            </ListItemButton>
          </ListItem>

          <Divider />

          {/* Delete Account */}
          <ListItem disablePadding>
            <ListItemButton onClick={handleDeleteData} sx={{ color: 'error.main' }}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText
                primary="Delete All Data"
                secondary="Remove all your personal data from our servers"
              />
            </ListItemButton>
          </ListItem>

          <Divider />

          {/* Help & Support */}
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <HelpOutlineIcon />
              </ListItemIcon>
              <ListItemText
                primary="Help & Support"
                secondary="Get assistance or report a problem"
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirm Data Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete all your data? This action cannot be undone, and all your personal information, tasks, calendar events, and other data will be permanently removed from our servers.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete All Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings; 
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
  IconButton,
  Tab,
  Tabs,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { 
  getCurrentUserProfile, 
  updateUserProfile, 
  uploadProfileImage,
  getNotificationSettings,
  updateNotificationSettings,
  getPrivacySettings,
  updatePrivacySettings,
  UserProfile,
  NotificationSettings,
  PrivacySettings
} from '../services/user.service';
import { getCurrentUser } from '../services/auth.service';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '',
    username: '',
    email: '',
    full_name: '',
    avatar: '',
    role: '',
    phone: '',
    school: '',
    grade: '',
    bio: '',
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailReminders: true,
    taskNotifications: true,
    healthReminders: true,
    emotionalSupportMessages: true,
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    shareHealthData: false,
    shareEmotionalData: false,
    allowParentAccess: false,
    allowSchoolAccess: false,
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get user profile
        const profileData = await getCurrentUserProfile();
        setUserProfile(profileData);
        
        // Get notification settings
        const notificationData = await getNotificationSettings();
        setNotificationSettings(notificationData);
        
        // Get privacy settings
        const privacyData = await getPrivacySettings();
        setPrivacySettings(privacyData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Get current user ID
      const currentUser = getCurrentUser();
      if (!currentUser) {
        setError('Not authenticated');
        setSaving(false);
        return;
      }
      
      // Update profile information
      await updateUserProfile(currentUser.id, {
        full_name: userProfile.full_name,
        phone: userProfile.phone,
        school: userProfile.school,
        grade: userProfile.grade,
        bio: userProfile.bio
      });
      
      // Upload avatar if selected
      if (selectedFile) {
        await uploadProfileImage(currentUser.id, selectedFile);
        setSelectedFile(null);
      }
      
      setMessage('Profile updated successfully');
      setEditMode(false);
      setSaving(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to update profile. Please try again.');
      setSaving(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserProfile({
      ...userProfile,
      [name]: value,
    });
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    });
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPrivacySettings({
      ...privacySettings,
      [name]: checked,
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setSaving(true);
      await updateNotificationSettings(notificationSettings);
      setMessage('Notification settings updated successfully');
      setSaving(false);
    } catch (err) {
      console.error('Error saving notification settings:', err);
      setError('Failed to update notification settings. Please try again.');
      setSaving(false);
    }
  };

  const handleSavePrivacy = async () => {
    try {
      setSaving(true);
      await updatePrivacySettings(privacySettings);
      setMessage('Privacy settings updated successfully');
      setSaving(false);
    } catch (err) {
      console.error('Error saving privacy settings:', err);
      setError('Failed to update privacy settings. Please try again.');
      setSaving(false);
    }
  };

  const handleCloseMessage = () => {
    setMessage('');
  };

  const handleCloseError = () => {
    setError('');
  };

  // Determine avatar URL
  const avatarUrl = selectedFile 
    ? URL.createObjectURL(selectedFile)
    : userProfile.avatar 
      ? `/static/images/avatar/${userProfile.avatar}` 
      : '/static/images/avatar/default.jpg';

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Manage your account information and preferences
        </Typography>
      </Box>

      <Paper elevation={1} sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="profile tabs"
            variant="fullWidth"
          >
            <Tab icon={<AccountCircleIcon />} label="Personal Info" iconPosition="start" />
            <Tab icon={<NotificationsIcon />} label="Notifications" iconPosition="start" />
            <Tab icon={<SecurityIcon />} label="Privacy" iconPosition="start" />
          </Tabs>
        </Box>

        {/* Personal Info Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ position: 'relative' }}>
            {!editMode && (
              <IconButton
                color="primary"
                onClick={handleEdit}
                sx={{ position: 'absolute', top: 0, right: 0 }}
              >
                <EditIcon />
              </IconButton>
            )}
            {editMode && (
              <IconButton
                color="primary"
                onClick={handleSave}
                disabled={saving}
                sx={{ position: 'absolute', top: 0, right: 0 }}
              >
                {saving ? <CircularProgress size={24} /> : <SaveIcon />}
              </IconButton>
            )}

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                mb: 4,
              }}
            >
              <Box sx={{ position: 'relative', mr: { sm: 4 }, mb: { xs: 2, sm: 0 } }}>
                <Avatar
                  sx={{ width: 120, height: 120, bgcolor: 'primary.main' }}
                  alt={userProfile.full_name}
                  src={avatarUrl}
                >
                  {userProfile.full_name ? userProfile.full_name.charAt(0) : userProfile.username.charAt(0)}
                </Avatar>
                {editMode && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFileSelect}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'background.paper',
                      }}
                      onClick={triggerFileInput}
                    >
                      <PhotoCameraIcon />
                    </IconButton>
                  </>
                )}
              </Box>
              <Box>
                <Typography variant="h5">{userProfile.full_name || userProfile.username}</Typography>
                <Typography color="text.secondary">{userProfile.school || ''}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {userProfile.grade || ''}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <TextField
                  label="Full Name"
                  name="full_name"
                  value={userProfile.full_name || ''}
                  onChange={handleProfileChange}
                  fullWidth
                  disabled={!editMode || saving}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Email"
                  name="email"
                  value={userProfile.email || ''}
                  fullWidth
                  disabled={true}  // Email should never be editable here
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Phone"
                  name="phone"
                  value={userProfile.phone || ''}
                  onChange={handleProfileChange}
                  fullWidth
                  disabled={!editMode || saving}
                />
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <TextField
                  label="School"
                  name="school"
                  value={userProfile.school || ''}
                  onChange={handleProfileChange}
                  fullWidth
                  disabled={!editMode || saving}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Grade/Year"
                  name="grade"
                  value={userProfile.grade || ''}
                  onChange={handleProfileChange}
                  fullWidth
                  disabled={!editMode || saving}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Bio"
                  name="bio"
                  value={userProfile.bio || ''}
                  onChange={handleProfileChange}
                  fullWidth
                  multiline
                  rows={3}
                  disabled={!editMode || saving}
                />
              </Box>
            </Box>
          </Box>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Notification Preferences
          </Typography>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.emailReminders}
                  onChange={handleNotificationChange}
                  name="emailReminders"
                  color="primary"
                  disabled={saving}
                />
              }
              label="Email reminders for upcoming tasks and events"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.taskNotifications}
                  onChange={handleNotificationChange}
                  name="taskNotifications"
                  color="primary"
                  disabled={saving}
                />
              }
              label="Push notifications for due tasks"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.healthReminders}
                  onChange={handleNotificationChange}
                  name="healthReminders"
                  color="primary"
                  disabled={saving}
                />
              }
              label="Daily health check-in reminders"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.emotionalSupportMessages}
                  onChange={handleNotificationChange}
                  name="emotionalSupportMessages"
                  color="primary"
                  disabled={saving}
                />
              }
              label="Emotional support messages and tips"
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="contained" 
              onClick={handleSaveNotifications}
              disabled={saving}
            >
              {saving ? <CircularProgress size={24} sx={{ mr: 1 }} /> : null}
              Save Changes
            </Button>
          </Box>
        </TabPanel>

        {/* Privacy Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Privacy Settings
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Data Sharing
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={privacySettings.shareHealthData}
                  onChange={handlePrivacyChange}
                  name="shareHealthData"
                  color="primary"
                  disabled={saving}
                />
              }
              label="Share anonymized health data for research"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={privacySettings.shareEmotionalData}
                  onChange={handlePrivacyChange}
                  name="shareEmotionalData"
                  color="primary"
                  disabled={saving}
                />
              }
              label="Share anonymized emotional data for research"
            />

            <Typography
              variant="subtitle2"
              gutterBottom
              color="text.secondary"
              sx={{ mt: 3 }}
            >
              Access Controls
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={privacySettings.allowParentAccess}
                  onChange={handlePrivacyChange}
                  name="allowParentAccess"
                  color="primary"
                  disabled={saving}
                />
              }
              label="Allow limited parent/guardian access"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={privacySettings.allowSchoolAccess}
                  onChange={handlePrivacyChange}
                  name="allowSchoolAccess"
                  color="primary"
                  disabled={saving}
                />
              }
              label="Allow limited school counselor access"
            />
          </Box>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="outlined"
              startIcon={<VisibilityIcon />}
              sx={{ mr: 2 }}
            >
              View My Data
            </Button>
            <Button 
              variant="contained"
              onClick={handleSavePrivacy}
              disabled={saving}
            >
              {saving ? <CircularProgress size={24} sx={{ mr: 1 }} /> : null}
              Save Changes
            </Button>
          </Box>
        </TabPanel>
      </Paper>

      {/* Success message */}
      <Snackbar open={!!message} autoHideDuration={6000} onClose={handleCloseMessage}>
        <Alert onClose={handleCloseMessage} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>

      {/* Error message */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 
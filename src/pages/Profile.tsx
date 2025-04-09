import React, { useState } from 'react';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';

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

  const [userProfile, setUserProfile] = useState({
    name: 'Sarah Tan',
    email: 'sarah.tan@example.com',
    phone: '+65 9123 4567',
    school: 'Singapore Polytechnic',
    grade: 'Year 2',
    bio: 'Student majoring in Computer Science. Passionate about technology and mental health awareness.',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailReminders: true,
    taskNotifications: true,
    healthReminders: true,
    emotionalSupportMessages: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    shareHealthData: false,
    shareEmotionalData: false,
    allowParentAccess: true,
    allowSchoolAccess: true,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    setEditMode(false);
    // Here would be API call to save user data
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
                sx={{ position: 'absolute', top: 0, right: 0 }}
              >
                <SaveIcon />
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
                  alt={userProfile.name}
                  src="/static/images/avatar/default.jpg"
                >
                  {userProfile.name.charAt(0)}
                </Avatar>
                {editMode && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'background.paper',
                    }}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                )}
              </Box>
              <Box>
                <Typography variant="h5">{userProfile.name}</Typography>
                <Typography color="text.secondary">{userProfile.school}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {userProfile.grade}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <TextField
                  label="Full Name"
                  name="name"
                  value={userProfile.name}
                  onChange={handleProfileChange}
                  fullWidth
                  disabled={!editMode}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Email"
                  name="email"
                  value={userProfile.email}
                  onChange={handleProfileChange}
                  fullWidth
                  disabled={!editMode}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Phone"
                  name="phone"
                  value={userProfile.phone}
                  onChange={handleProfileChange}
                  fullWidth
                  disabled={!editMode}
                />
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <TextField
                  label="School"
                  name="school"
                  value={userProfile.school}
                  onChange={handleProfileChange}
                  fullWidth
                  disabled={!editMode}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Grade/Year"
                  name="grade"
                  value={userProfile.grade}
                  onChange={handleProfileChange}
                  fullWidth
                  disabled={!editMode}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Bio"
                  name="bio"
                  value={userProfile.bio}
                  onChange={handleProfileChange}
                  fullWidth
                  multiline
                  rows={3}
                  disabled={!editMode}
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
                />
              }
              label="Emotional support messages and tips"
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained">Save Changes</Button>
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
            <Button variant="contained">Save Changes</Button>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Profile; 
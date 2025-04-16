import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Grid,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import OpacityIcon from '@mui/icons-material/Opacity';
import WatchIcon from '@mui/icons-material/Watch';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import MonitorIcon from '@mui/icons-material/Monitor';
import TimerIcon from '@mui/icons-material/Timer';
import { sleepData, hydrationData, exerciseData, screenTimeData, heartRateData, weightData } from '../data/HealthData';

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
      id={`health-tabpanel-${index}`}
      aria-labelledby={`health-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const HealthData: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const renderMetricCard = (
    title: string,
    value: string,
    icon: React.ReactNode,
    color: string,
    subtitle: string
  ) => (
    <Card elevation={1}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <Box
          sx={{
            backgroundColor: `${color}`,
            borderRadius: '50%',
            width: 48,
            height: 48,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mr: 2,
            color: 'white',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const renderDataEntry = () => (
    <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Record New Data
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <TextField
            label="Date"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <TextField
            select
            fullWidth
            label="Data Type"
            defaultValue="sleep"
          >
            <MenuItem value="sleep">Sleep</MenuItem>
            <MenuItem value="exercise">Exercise</MenuItem>
            <MenuItem value="screenTime">Screen Time</MenuItem>
            <MenuItem value="meals">Meals</MenuItem>
            <MenuItem value="water">Water Intake</MenuItem>
          </TextField>
        </Box>
        
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <TextField
            fullWidth
            label="Value"
            type="number"
            inputProps={{ step: 0.5 }}
          />
        </Box>
        
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <TextField
            select
            fullWidth
            label="Unit"
            defaultValue="hours"
          >
            <MenuItem value="hours">Hours</MenuItem>
            <MenuItem value="minutes">Minutes</MenuItem>
            <MenuItem value="steps">Steps</MenuItem>
            <MenuItem value="ml">ml</MenuItem>
          </TextField>
        </Box>
        
        <Box sx={{ width: '100%' }}>
          <Button variant="contained" startIcon={<AddIcon />}>
            Add Entry
          </Button>
        </Box>
      </Box>
    </Paper>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Health Data
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Track and monitor your health metrics
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
          {renderMetricCard(
            'Sleep',
            '7.5h',
            <BedtimeIcon />,
            '#1976d2',
            'Weekly average'
          )}
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
          {renderMetricCard(
            'Exercise',
            '3/7 days',
            <DirectionsRunIcon />,
            '#2e7d32',
            'This week'
          )}
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
          {renderMetricCard(
            'Screen Time',
            '3.2h',
            <MonitorIcon />,
            '#ed6c02',
            'Daily average'
          )}
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
          {renderMetricCard(
            'Study Time',
            '28h',
            <TimerIcon />,
            '#9c27b0',
            'This week'
          )}
        </Box>
      </Box>

      {renderDataEntry()}

      <Paper elevation={1}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="health data tabs"
            variant="fullWidth"
          >
            <Tab label="Sleep" icon={<BedtimeIcon />} iconPosition="start" />
            <Tab label="Exercise" icon={<DirectionsRunIcon />} iconPosition="start" />
            <Tab label="Screen Time" icon={<MonitorIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Sleep History
          </Typography>
          <Box
            sx={{
              width: '100%',
              height: 300,
              bgcolor: 'rgba(0, 0, 0, 0.04)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 1,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Sleep chart would be displayed here
            </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Recent Sleep Data
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {sleepData.map((item) => (
                <Box key={item.date} sx={{ flex: '1 1 150px', minWidth: 0 }}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="caption">{item.date}</Typography>
                    <Typography variant="h6">{item.hours}h</Typography>
                  </Paper>
                </Box>
              ))}
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Exercise History
          </Typography>
          <Box
            sx={{
              width: '100%',
              height: 300,
              bgcolor: 'rgba(0, 0, 0, 0.04)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 1,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Exercise chart would be displayed here
            </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Recent Exercise Data
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {exerciseData.map((item) => (
                <Box key={item.date} sx={{ flex: '1 1 150px', minWidth: 0 }}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="caption">{item.date}</Typography>
                    <Typography variant="h6">{item.minutes}min</Typography>
                    <Typography variant="body2">{item.type}</Typography>
                  </Paper>
                </Box>
              ))}
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Screen Time History
          </Typography>
          <Box
            sx={{
              width: '100%',
              height: 300,
              bgcolor: 'rgba(0, 0, 0, 0.04)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 1,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Screen time chart would be displayed here
            </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Recent Screen Time Data
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {screenTimeData.map((item) => (
                <Box key={item.date} sx={{ flex: '1 1 150px', minWidth: 0 }}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="caption">{item.date}</Typography>
                    <Typography variant="h6">{item.hours}h</Typography>
                  </Paper>
                </Box>
              ))}
            </Box>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default HealthData; 
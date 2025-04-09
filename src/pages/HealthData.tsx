import React, { useState } from 'react';
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
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import MonitorIcon from '@mui/icons-material/Monitor';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TimerIcon from '@mui/icons-material/Timer';
import DateRangeIcon from '@mui/icons-material/DateRange';

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock data for health metrics
  const sleepData = [
    { date: '2023-04-01', hours: 7.5 },
    { date: '2023-04-02', hours: 8 },
    { date: '2023-04-03', hours: 6.5 },
    { date: '2023-04-04', hours: 7 },
    { date: '2023-04-05', hours: 7.5 },
    { date: '2023-04-06', hours: 8 },
    { date: '2023-04-07', hours: 6 },
  ];

  const exerciseData = [
    { date: '2023-04-01', minutes: 30, type: 'Running' },
    { date: '2023-04-02', minutes: 45, type: 'Swimming' },
    { date: '2023-04-03', minutes: 0, type: 'None' },
    { date: '2023-04-04', minutes: 60, type: 'Basketball' },
    { date: '2023-04-05', minutes: 20, type: 'Walking' },
    { date: '2023-04-06', minutes: 0, type: 'None' },
    { date: '2023-04-07', minutes: 40, type: 'Cycling' },
  ];

  const screenTimeData = [
    { date: '2023-04-01', hours: 3.5 },
    { date: '2023-04-02', hours: 2.5 },
    { date: '2023-04-03', hours: 4 },
    { date: '2023-04-04', hours: 3 },
    { date: '2023-04-05', hours: 2 },
    { date: '2023-04-06', hours: 3.5 },
    { date: '2023-04-07', hours: 4.5 },
  ];

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
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
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
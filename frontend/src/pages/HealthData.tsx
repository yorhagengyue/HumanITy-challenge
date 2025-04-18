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
  FormControl,
  ThemeProvider,
  createTheme,
  useTheme,
  alpha,
  Chip,
  Snackbar,
  Alert
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
import LockIcon from '@mui/icons-material/Lock';
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
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  
  // 添加私有模式状态
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  
  // 创建暗色主题
  const darkTheme = createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      mode: 'dark',
      primary: {
        main: '#90caf9',
        light: '#e3f2fd',
        dark: '#42a5f5',
      },
      secondary: {
        main: '#f48fb1',
        light: '#f8bbd0',
        dark: '#c2185b',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
    },
  });

  // 在组件加载时检查之前保存的隐私模式状态
  useEffect(() => {
    const savedPrivateMode = localStorage.getItem('calendar_private_mode') === 'true';
    setIsPrivateMode(savedPrivateMode);
  }, []);

  // 切换隐私模式
  const handlePrivateModeToggle = () => {
    const newMode = !isPrivateMode;
    setIsPrivateMode(newMode);
    localStorage.setItem('calendar_private_mode', newMode.toString());
  };

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
    <Paper elevation={isPrivateMode ? 3 : 1} sx={{ 
      p: 3, 
      mb: 4, 
      bgcolor: isPrivateMode ? 'background.paper' : undefined,
      borderLeft: isPrivateMode ? `6px solid ${theme.palette.secondary.main}` : undefined
    }}>
      <Typography variant="h6" gutterBottom sx={{ color: isPrivateMode ? 'white' : 'text.primary' }}>
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

  // 导出数据功能
  const handleExport = () => {
    const exportData = {
      name: 'Geng Yue',
      sleepData,
      exerciseData,
      screenTimeData,
      hydrationData,
      heartRateData,
      weightData,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'GengYue-health-data.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <ThemeProvider theme={isPrivateMode ? darkTheme : theme}>
      <Container maxWidth="lg" sx={{
        bgcolor: isPrivateMode ? 'background.default' : 'transparent',
        borderRadius: 2,
        p: 2,
        transition: 'all 0.3s ease',
        minHeight: '100vh',
        // 隐私模式特殊样式
        ...(isPrivateMode && {
          boxShadow: `0 4px 20px ${alpha('#000', 0.2)}`,
          backgroundImage: 'linear-gradient(to bottom, #1a1a2e, #16213e)',
        })
      }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{
              color: isPrivateMode ? 'white' : 'text.primary'
            }}>
              Health Tracker: {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
            </Typography>
            <Typography variant="subtitle1" color={isPrivateMode ? 'grey.400' : 'text.secondary'} gutterBottom>
              Track and monitor your health metrics
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Export button */}
            <Button
              variant="contained"
              color="success"
              onClick={handleExport}
              sx={{ borderRadius: 4, fontWeight: 'bold' }}
            >
              Export
            </Button>
            {/* 添加隐私模式按钮 */}
            <Button
              variant={isPrivateMode ? "contained" : "outlined"}
              color={isPrivateMode ? "secondary" : "primary"}
              startIcon={<LockIcon />}
              onClick={handlePrivateModeToggle}
              sx={{ 
                borderRadius: 4,
                backgroundColor: isPrivateMode ? alpha(theme.palette.secondary.main, 0.9) : 'transparent',
                color: isPrivateMode ? 'white' : 'primary.main',
                '&:hover': {
                  backgroundColor: isPrivateMode ? alpha(theme.palette.secondary.main, 1) : alpha(theme.palette.primary.main, 0.1),
                }
              }}
            >
              {isPrivateMode ? "Exit Private Mode" : "Private Mode"}
            </Button>
          </Box>
        </Box>

        {/* 隐私模式指示器 */}
        {isPrivateMode && (
          <Box sx={{ mb: 3 }}>
            <Chip 
              icon={<LockIcon />} 
              label="Private Mode Active - Your health data is protected" 
              color="secondary" 
              sx={{ 
                fontWeight: 'bold', 
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { boxShadow: '0 0 0 0 rgba(156, 39, 176, 0.4)' },
                  '70%': { boxShadow: '0 0 0 10px rgba(156, 39, 176, 0)' },
                  '100%': { boxShadow: '0 0 0 0 rgba(156, 39, 176, 0)' }
                }
              }} 
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
            {renderMetricCard(
              'Sleep',
              '7.5h',
              <BedtimeIcon />,
              isPrivateMode ? '#5e35b1' : '#1976d2',
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

        <Paper elevation={isPrivateMode ? 3 : 1} sx={{ 
          bgcolor: isPrivateMode ? 'background.paper' : undefined 
        }}>
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
                mb: 2,
              }}
            >
              <Line
                data={{
                  labels: sleepData.map((item) => item.date),
                  datasets: [
                    {
                      label: 'Sleep Hours',
                      data: sleepData.map((item) => item.hours),
                      fill: false,
                      borderColor: theme.palette.primary.main,
                      backgroundColor: theme.palette.primary.light,
                      tension: 0.3,
                      pointRadius: 4,
                      pointHoverRadius: 6,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: true, position: 'top' },
                    title: { display: false },
                  },
                  scales: {
                    x: { title: { display: true, text: 'Date' } },
                    y: { title: { display: true, text: 'Hours' }, min: 0, max: 10 },
                  },
                }}
              />
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
                mb: 2,
              }}
            >
              <Line
                data={{
                  labels: exerciseData.map((item) => item.date),
                  datasets: [
                    {
                      label: 'Exercise Minutes',
                      data: exerciseData.map((item) => item.minutes),
                      fill: false,
                      borderColor: theme.palette.secondary.main,
                      backgroundColor: theme.palette.secondary.light,
                      tension: 0.3,
                      pointRadius: 4,
                      pointHoverRadius: 6,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: true, position: 'top' },
                    title: { display: false },
                  },
                  scales: {
                    x: { title: { display: true, text: 'Date' } },
                    y: { title: { display: true, text: 'Minutes' }, min: 0 },
                  },
                }}
              />
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
                mb: 2,
              }}
            >
              <Line
                data={{
                  labels: screenTimeData.map((item) => item.date),
                  datasets: [
                    {
                      label: 'Screen Time (h)',
                      data: screenTimeData.map((item) => item.hours),
                      fill: false,
                      borderColor: theme.palette.warning ? theme.palette.warning.main : '#FFA726',
                      backgroundColor: theme.palette.warning ? theme.palette.warning.light : '#FFE0B2',
                      tension: 0.3,
                      pointRadius: 4,
                      pointHoverRadius: 6,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: true, position: 'top' },
                    title: { display: false },
                  },
                  scales: {
                    x: { title: { display: true, text: 'Date' } },
                    y: { title: { display: true, text: 'Hours' }, min: 0 },
                  },
                }}
              />
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
    </ThemeProvider>
  );
};

export default HealthData; 
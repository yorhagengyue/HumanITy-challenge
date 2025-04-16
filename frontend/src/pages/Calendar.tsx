import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isToday, isThisMonth, isWeekend, parseISO, addDays } from 'date-fns';
import {
  Box,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Divider,
  useTheme,
  alpha,
  Snackbar,
  Alert,
  CircularProgress,
  useMediaQuery,
  Container,
  ThemeProvider,
  createTheme,
  Select,
  FormControl,
  InputLabel,
  Chip,
  SelectChangeEvent
} from '@mui/material';
import { keyframes } from '@mui/system';
import { TabContext, TabPanel, TabList } from '@mui/lab';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import DeleteIcon from '@mui/icons-material/Delete';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TodayIcon from '@mui/icons-material/Today';
import CategoryIcon from '@mui/icons-material/Category';
import SettingsIcon from '@mui/icons-material/Settings';
import LockIcon from '@mui/icons-material/Lock';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MoodIcon from '@mui/icons-material/Mood';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ScaleIcon from '@mui/icons-material/Scale';
import FavoriteIcon from '@mui/icons-material/Favorite';

// Import health service
import { 
  getHealthMetricTypes, 
  getUnitForMetricType, 
  createHealthMetric, 
  getAllHealthMetrics
} from '../services/health.service';
import CalendarServiceAPI from '../services/calendar.service';

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

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Define interfaces locally instead of importing to avoid conflicts
interface CalendarCategory {
  id: number;
  name: string;
  color: string;
  user_id?: number;
}

interface CalendarEvent {
  id?: number | string;
  title: string;
  description?: string;
  location?: string;
  start_time: string;
  end_time: string;
  all_day: boolean;
  category_id: number;
  category?: CalendarCategory;
  user_id?: number;
  reminder?: number | null;
  is_health_event: boolean;
  health_metric_type?: string;
  health_metric_value?: number;
  health_metric_id?: number | string;
}

// Mock CalendarService until the actual service is created
const CalendarService = {
  getEvents: async (): Promise<CalendarEvent[]> => {
    return Promise.resolve([]);
  },
  getCategories: async (): Promise<CalendarCategory[]> => {
    return Promise.resolve([]);
  },
  getHealthEvents: async (): Promise<CalendarEvent[]> => {
    return Promise.resolve([]);
  },
  createEvent: async (event: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    return Promise.resolve({
      id: Math.floor(Math.random() * 1000),
      title: event.title || '',
      start_time: event.start_time || new Date().toISOString(),
      end_time: event.end_time || new Date().toISOString(),
      all_day: event.all_day || false,
      category_id: event.category_id || 1,
      is_health_event: event.is_health_event || false,
    } as CalendarEvent);
  },
  updateEvent: async (id: number, event: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    return Promise.resolve({
      id,
      title: event.title || '',
      start_time: event.start_time || new Date().toISOString(),
      end_time: event.end_time || new Date().toISOString(),
      all_day: event.all_day || false,
      category_id: event.category_id || 1,
      is_health_event: event.is_health_event || false,
    } as CalendarEvent);
  },
  deleteEvent: async (id: number): Promise<void> => {
    return Promise.resolve();
  }
};

// Event colors
const eventColors = {
  blue: '#1976d2',
  green: '#2e7d32',
  purple: '#7b1fa2',
  orange: '#ed6c02',
  red: '#d32f2f',
  teal: '#00796b'
};

// Create a simple hook for event colors
const useEventColors = () => {
  return {
    getEventColor: (categoryId: number, categories: CalendarCategory[]) => {
      const category = categories.find(c => c.id === categoryId);
      return category ? category.color : eventColors.blue;
    },
    // Add direct access to colors
    blue: eventColors.blue,
    green: eventColors.green,
    purple: eventColors.purple,
    orange: eventColors.orange,
    red: eventColors.red,
    teal: eventColors.teal
  };
};

// View type for calendar
type View = 'month' | 'week' | 'day' | 'health';

// Health metric icons map
const healthMetricIcons: Record<string, React.ReactNode> = {
  sleep: <BedtimeIcon />,
  exercise: <FitnessCenterIcon />,
  screenTime: <AccessTimeIcon />,
  studyTime: <AccessTimeIcon />,
  water: <LocalDrinkIcon />,
  steps: <DirectionsRunIcon />,
  weight: <ScaleIcon />,
  heartRate: <FavoriteIcon />,
  mood: <MoodIcon />
};

// Get color for health metric type
const getHealthMetricColor = (type: string) => {
  const colors = {
    sleep: '#5e35b1', // purple
    exercise: '#43a047', // green
    screenTime: '#ef6c00', // orange
    studyTime: '#0288d1', // blue
    water: '#0097a7', // teal
    steps: '#039be5', // light blue
    weight: '#757575', // gray
    heartRate: '#d32f2f', // red
    mood: '#fb8c00', // amber
    default: '#2196f3' // default blue
  };
  
  return colors[type as keyof typeof colors] || colors.default;
};

const Calendar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const eventColors = useEventColors();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Calendar view state
  const [view, setView] = useState<View>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [healthEvents, setHealthEvents] = useState<CalendarEvent[]>([]);
  const [categories, setCategories] = useState<CalendarCategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [visibleEvents, setVisibleEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Dark mode for health view
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Create a darker theme for health view
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
  
  // Health metric state
  const [healthMetricTypes, setHealthMetricTypes] = useState<string[]>([]);
  const [healthMetricData, setHealthMetricData] = useState<any[]>([]);
  const [healthMetricForm, setHealthMetricForm] = useState({
    type: 'sleep',
    value: '',
    notes: ''
  });
  
  // Event form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    start_time: new Date().toISOString(),
    end_time: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
    category_id: 1,
    all_day: false,
    is_health_event: false
  });
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  
  // Category form state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryDetails, setCategoryDetails] = useState<{ name: string; color: string }>({
    name: '',
    color: eventColors.blue
  });
  const [editingCategory, setEditingCategory] = useState<CalendarCategory | null>(null);
  
  // Filter state
  const [showRegularEvents, setShowRegularEvents] = useState(true);
  const [showHealthEvents, setShowHealthEvents] = useState(true);
  
  // Default category for health events
  const healthCategoryId = 999; // Special ID for health category
  
  // Set up initial calendar state
  useEffect(() => {
    fetchCategories();
    fetchEvents();
  }, []);
  
  // Update visible events whenever filters or events change
  useEffect(() => {
    // Combine and filter events based on user selections
    const allEvents = [
      ...(showRegularEvents ? events : []),
      ...(showHealthEvents ? healthEvents : [])
    ];
    
    // Filter by selected categories if any are selected
    const filtered = selectedCategories.length > 0
      ? allEvents.filter(event => selectedCategories.includes(event.category_id || 0))
      : allEvents;
    
    setVisibleEvents(filtered);
  }, [events, healthEvents, selectedCategories, showRegularEvents, showHealthEvents]);
  
  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await CalendarServiceAPI.getAllCategories();
      setCategories(response.data);
      
      // Initialize selected categories to include all categories
      setSelectedCategories(response.data.map((cat: CalendarCategory) => cat.id));
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again later.');
    }
  };
  
  // Fetch events from API
  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch regular events
      const eventsResponse = await CalendarServiceAPI.getAllEvents();
      setEvents(eventsResponse.data);
      
      // Fetch health events for current year/month
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
      const healthEventsResponse = await CalendarServiceAPI.getHealthEvents(currentYear, currentMonth);
      setHealthEvents(healthEventsResponse.data);
      
      setIsLoading(false);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
      setIsLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    // Format date strings for the new event
    const formattedDate = format(date, 'yyyy-MM-dd');
    const defaultStartTime = `${formattedDate}T09:00:00`;
    const defaultEndTime = `${formattedDate}T10:00:00`;
    
    setEventDetails({
      title: '',
      description: '',
      location: '',
      start_time: defaultStartTime,
      end_time: defaultEndTime,
      all_day: false,
      category_id: 1,
      is_health_event: view === 'health'
    });
    
    setEditingEvent(null);
    
    // Open appropriate modal based on view
    if (view === 'health') {
      setIsHealthModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setEditingEvent(event);
    setEventDetails({
      ...event,
      start_time: event.start_time.slice(0, 16), // Format for datetime-local input
      end_time: event.end_time.slice(0, 16)      // Format for datetime-local input
    });
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleNewEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEventDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddEvent = async () => {
    try {
      // Format data for API with required fields
      const eventData: any = {
        ...eventDetails,
        title: eventDetails.title || '',
        start_time: eventDetails.start_time || new Date().toISOString(),
        end_time: eventDetails.end_time || new Date().toISOString(),
        all_day: eventDetails.all_day || false,
        category_id: eventDetails.category_id || 1,
        is_health_event: eventDetails.is_health_event || false
      };
      
      if (editingEvent && editingEvent.id) {
        // 确保ID是数字类型
        if (typeof editingEvent.id === 'number') {
          // Update existing event
          await CalendarServiceAPI.updateEvent(editingEvent.id, eventData);
        } else {
          console.error('Cannot update event with string ID:', editingEvent.id);
          setError('Cannot update event with non-numeric ID');
        }
      } else {
        // Create new event
        await CalendarServiceAPI.createEvent(eventData);
      }
      
      // Refresh events
      fetchEvents();
      handleClose();
    } catch (err) {
      console.error('Error saving event:', err);
      setError('Failed to save event. Please try again.');
    }
  };

  const handleDeleteEvent = async () => {
    if (!editingEvent || !editingEvent.id) return;
    
    try {
      // 确保ID是数字类型
      if (typeof editingEvent.id === 'number') {
        await CalendarServiceAPI.deleteEvent(editingEvent.id);
      } else if (editingEvent.is_health_event) {
        // 对于具有字符串ID的健康事件，从本地状态中删除
        setHealthEvents(healthEvents.filter(e => e.id !== editingEvent.id));
      } else {
        console.error('Cannot delete event with string ID:', editingEvent.id);
        setError('Cannot delete event with non-numeric ID');
        return;
      }
      
      setSuccess('Event deleted successfully');
      
      // Refresh events
      fetchEvents();
      handleClose();
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event. Please try again.');
    }
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const handleSnackbarClose = () => {
    setError(null);
  };

  const handleManageCategories = () => {
    navigate('/calendar/categories');
  };

  const renderDays = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          width: '100%',
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          borderRadius: '12px 12px 0 0',
          mb: 1,
          animation: `${fadeIn} 0.5s ease-out`,
        }}
      >
        {days.map((day) => (
          <Box key={day} sx={{ flex: 1, textAlign: 'center', py: 1.5 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 'bold',
                color: day === 'Sunday' || day === 'Saturday' ? 'text.secondary' : 'text.primary'
              }}
            >
              {day.substring(0, 3)}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };
  
  const renderCells = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    
    const dateFormat = new Intl.DateTimeFormat('en-US', { day: 'numeric' });
    const rows = [];
    
    let days = [];
    let day = startDate;
    let formattedDate = '';
    
    // Adjust to start from the first day of the week (Sunday)
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // Create 6 rows to accommodate all possible month layouts
    for (let i = 0; i < 6; i++) {
      days = [];
      
      // Create 7 columns (days of the week)
      for (let j = 0; j < 7; j++) {
        formattedDate = dateFormat.format(day);
        const dayStr = format(day, 'yyyy-MM-dd');
        const currentDay = new Date(day);
        
        // Filter events for this day
        const dayEvents = showRegularEvents ? events : healthEvents;
        const filteredEvents = dayEvents.filter(event => {
          const eventStartDate = event.start_time.split('T')[0];
          const eventEndDate = event.end_time.split('T')[0];
          return eventStartDate === dayStr || eventEndDate === dayStr;
        });
        
        const isToday = currentDay.toDateString() === new Date().toDateString();
        const isCurrentMonth = currentDay.getMonth() === monthStart.getMonth();
        const isWeekend = currentDay.getDay() === 0 || currentDay.getDay() === 6;
        
        // Use a closure to capture the current value of day
        const dayValue = new Date(currentDay);
        const dayNum = dayValue.getDate();
        
        days.push(
          <Box 
            key={dayValue.toString()} 
            sx={{ 
              width: '14.28%',
              px: 0.5,
              animation: `${scaleIn} 0.5s ease-out`,
              animationDelay: `${i * 0.05 + j * 0.03}s`,
              opacity: 0,
              animationFillMode: 'forwards',
            }}
            onMouseEnter={() => setEditingEvent(filteredEvents.find(e => format(new Date(e.start_time), 'yyyy-MM-dd') === dayStr) as CalendarEvent)}
            onMouseLeave={() => setEditingEvent(null)}
          >
            <Paper 
              elevation={isToday ? 3 : editingEvent && editingEvent.id === filteredEvents.find(e => format(new Date(e.start_time), 'yyyy-MM-dd') === dayStr)?.id ? 2 : 0}
              sx={{ 
                p: 1, 
                height: 120, 
                bgcolor: isToday 
                  ? alpha(theme.palette.primary.main, 0.1)
                  : !isCurrentMonth 
                    ? alpha(theme.palette.text.disabled, 0.03) 
                    : isWeekend 
                      ? alpha(theme.palette.background.default, 0.6) 
                      : alpha(theme.palette.background.paper, 1),
                borderRadius: 2,
                border: isToday 
                  ? `2px solid ${theme.palette.primary.main}` 
                  : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                overflow: 'hidden',
                '&:hover': { 
                  transform: 'scale(1.02)',
                  boxShadow: `0 6px 20px -10px ${alpha(theme.palette.primary.main, 0.4)}`,
                  zIndex: 2,
                  position: 'relative'
                }
              }}
              onClick={() => handleDateClick(dayNum)}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1
              }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: isToday ? 'bold' : isCurrentMonth ? 'medium' : 'normal',
                    color: !isCurrentMonth 
                      ? 'text.disabled' 
                      : isToday 
                        ? 'primary.main' 
                        : 'text.primary',
                    bgcolor: isToday ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {formattedDate}
                </Typography>
                {editingEvent && editingEvent.id === filteredEvents.find(e => format(new Date(e.start_time), 'yyyy-MM-dd') === dayStr)?.id && isCurrentMonth && (
                  <Tooltip title="Add event">
                    <IconButton 
                      size="small" 
                      sx={{ 
                        opacity: 0.7, 
                        '&:hover': { opacity: 1 },
                        p: 0.3,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDateClick(dayNum);
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              
              <Box sx={{ overflow: 'hidden' }}>
                {filteredEvents.map((event) => {
                  const startTime = new Date(event.start_time);
                  const formattedTime = format(startTime, 'HH:mm');
                  const categoryColor = event.category ? event.category.color : '#2196F3';
                  
                  return (
                    <Box 
                      key={event.id}
                      sx={{ 
                        bgcolor: event.is_health_event 
                          ? alpha(getHealthMetricColor(event.health_metric_type || 'default'), 0.7)
                          : alpha(categoryColor, 0.7),
                        color: 'white',
                        p: 0.5,
                        borderRadius: 1,
                        mb: 0.5,
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        transition: 'transform 0.15s ease',
                        borderLeft: event.is_health_event 
                          ? `3px solid ${getHealthMetricColor(event.health_metric_type || 'default')}`
                          : 'none',
                        '&:hover': {
                          transform: 'translateX(5px)',
                          boxShadow: `0 2px 5px -2px ${alpha(theme.palette.common.black, 0.3)}`,
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                    >
                      {event.is_health_event && (
                        <Box 
                          component="span" 
                          sx={{ 
                            mr: 0.5, 
                            display: 'inline-flex',
                            alignItems: 'center',
                            verticalAlign: 'middle',
                            '& svg': {
                              fontSize: '0.75rem',
                              mr: 0.25
                            }
                          }}
                        >
                          {event.health_metric_type === 'sleep' && <BedtimeIcon fontSize="inherit" />}
                          {event.health_metric_type === 'exercise' && <FitnessCenterIcon fontSize="inherit" />}
                          {event.health_metric_type === 'mood' && <MoodIcon fontSize="inherit" />}
                          {event.health_metric_type === 'screenTime' && <AccessTimeIcon fontSize="inherit" />}
                          {event.health_metric_type === 'steps' && <DirectionsRunIcon fontSize="inherit" />}
                          {event.health_metric_type === 'weight' && <ScaleIcon fontSize="inherit" />}
                          {event.health_metric_type === 'heartRate' && <FavoriteIcon fontSize="inherit" />}
                        </Box>
                      )}
                      {formattedTime} - {event.title}
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </Box>
        );
        
        day = new Date(day);
        day.setDate(day.getDate() + 1);
      }
      
      rows.push(
        <Box 
          sx={{ 
            display: 'flex', 
            mb: 1,
            animation: `${fadeIn} 0.5s ease-out`,
            animationDelay: `${i * 0.07}s`
          }} 
          key={i}
        >
          {days}
        </Box>
      );
      
      // Stop rendering if we've passed the end of the month
      if (day > monthEnd) break;
    }
    
    return <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column' }}>{rows}</Box>;
  };
  
  // Handle view change with theme toggle
  const handleViewChange = (event: React.SyntheticEvent, newView: View) => {
    setView(newView);
    setIsDarkMode(newView === 'health');
    
    // Fetch health metrics when switching to health view
    if (newView === 'health') {
      fetchHealthMetrics();
    }
  };
  
  // Fetch available health metric types
  useEffect(() => {
    setHealthMetricTypes(getHealthMetricTypes());
  }, []);
  
  // Fetch health metrics from API
  const fetchHealthMetrics = async () => {
    setIsLoading(true);
    try {
      // Get the current month's first and last day
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      // Format dates for API
      const startDate = format(firstDay, 'yyyy-MM-dd');
      const endDate = format(lastDay, 'yyyy-MM-dd');
      
      // 重用现有认证令牌
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
      
      try {
        // 从calendar service获取健康数据
        const healthEventsResponse = await CalendarServiceAPI.getHealthEvents(currentYear, currentMonth);
        setHealthEvents(healthEventsResponse.data);
        
        // 如果上面失败了，尝试直接从health service获取数据
        if (healthEventsResponse.data.length === 0) {
          // 尝试直接从health service获取数据
          const response = await getAllHealthMetrics(1, 100, undefined, startDate, endDate);
          
          if (response && response.data) {
            // 将健康指标转换为日历事件
            const healthEvents: CalendarEvent[] = response.data.map((metric: any) => {
              const metricDate = parseISO(metric.date);
              
              return {
                id: metric.id,
                title: `${metric.type.charAt(0).toUpperCase() + metric.type.slice(1)}: ${metric.value} ${metric.unit}`,
                description: metric.notes || '',
                start_time: format(metricDate, "yyyy-MM-dd'T'HH:mm:ss"),
                end_time: format(addDays(metricDate, 0), "yyyy-MM-dd'T'HH:mm:ss"),
                all_day: false,
                category_id: 999, // Special ID for health category
                is_health_event: true,
                health_metric_type: metric.type,
                health_metric_value: metric.value,
                health_metric_id: metric.id
              };
            });
            
            setHealthEvents(healthEvents);
          }
        }
      } catch (error) {
        console.error("Error getting health events, falling back to mock data:", error);
        
        // 作为备选，使用本地mock数据
        const mockHealthData = [
          // Sleep data
          {
            id: "mock-101",
            title: "Sleep: 7.5 hours",
            description: "Sleep quality good",
            start_time: format(new Date(currentDate.getFullYear(), currentDate.getMonth(), 5, 8, 0), "yyyy-MM-dd'T'HH:mm:ss"),
            end_time: format(new Date(currentDate.getFullYear(), currentDate.getMonth(), 5, 8, 15), "yyyy-MM-dd'T'HH:mm:ss"),
            all_day: false,
            category_id: 999,
            is_health_event: true,
            health_metric_type: "sleep",
            health_metric_value: 7.5
          },
          // Mood data
          {
            id: "mock-102",
            title: "Mood: 85/100",
            description: "Feeling positive",
            start_time: format(new Date(currentDate.getFullYear(), currentDate.getMonth(), 10, 12, 0), "yyyy-MM-dd'T'HH:mm:ss"),
            end_time: format(new Date(currentDate.getFullYear(), currentDate.getMonth(), 10, 12, 15), "yyyy-MM-dd'T'HH:mm:ss"),
            all_day: false,
            category_id: 999,
            is_health_event: true,
            health_metric_type: "mood",
            health_metric_value: 85
          },
          // Exercise data
          {
            id: "mock-103",
            title: "Exercise: 45 minutes",
            description: "Cardio workout",
            start_time: format(new Date(currentDate.getFullYear(), currentDate.getMonth(), 15, 17, 0), "yyyy-MM-dd'T'HH:mm:ss"),
            end_time: format(new Date(currentDate.getFullYear(), currentDate.getMonth(), 15, 17, 45), "yyyy-MM-dd'T'HH:mm:ss"),
            all_day: false,
            category_id: 999,
            is_health_event: true,
            health_metric_type: "exercise",
            health_metric_value: 45
          }
        ];
        
        setHealthEvents(mockHealthData as CalendarEvent[]);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching health metrics:', err);
      setError('Failed to load health metrics');
      setIsLoading(false);
    }
  };
  
  // Create separate handlers for different input types
  const handleHealthMetricInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHealthMetricForm({
      ...healthMetricForm,
      [name]: value
    });
  };

  const handleHealthMetricSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setHealthMetricForm({
      ...healthMetricForm,
      [name]: value
    });
  };

  // Handle health metric submission
  const handleAddHealthMetric = async () => {
    try {
      const { type, value, notes } = healthMetricForm;
      
      if (!type || !value) {
        setError('Please fill in all required fields');
        return;
      }
      
      const numericValue = parseFloat(value as string);
      if (isNaN(numericValue)) {
        setError('Value must be a number');
        return;
      }
      
      // Get unit for the selected type
      const unit = getUnitForMetricType(type);
      
      try {
        // Create health metric
        await createHealthMetric(
          type,
          numericValue,
          unit,
          notes as string,
          new Date(eventDetails.start_time || '')
        );
        
        // Show success message
        setSuccess('Health metric added successfully');
        
        // Refresh health metrics
        fetchHealthMetrics();
      } catch (createError) {
        console.error('Error creating health metric, using local data:', createError);
        
        // 如果API失败，添加到本地健康事件
        const newHealthEvent: CalendarEvent = {
          id: `local-${Date.now()}`,
          title: `${type.charAt(0).toUpperCase() + type.slice(1)}: ${numericValue} ${unit}`,
          description: notes as string || '',
          start_time: eventDetails.start_time || new Date().toISOString(),
          end_time: eventDetails.start_time || new Date().toISOString(),
          all_day: false,
          category_id: 999,
          is_health_event: true,
          health_metric_type: type,
          health_metric_value: numericValue
        };
        
        // 更新本地健康事件列表
        setHealthEvents([...healthEvents, newHealthEvent]);
        setSuccess('Health metric added to local calendar');
      }
      
      // Close the modal
      setIsHealthModalOpen(false);
      
      // Reset form
      setHealthMetricForm({
        type: 'sleep',
        value: '',
        notes: ''
      });
    } catch (err) {
      console.error('Error adding health metric:', err);
      setError('Failed to add health metric');
    }
  };

  // Open health metric form
  const handleOpenHealthMetricForm = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const formattedDate = format(date, "yyyy-MM-dd'T'09:00:00");
    
    setEventDetails({
      ...eventDetails,
      start_time: formattedDate,
      end_time: formattedDate,
      is_health_event: true
    });
    
    setIsHealthModalOpen(true);
  };
  
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : theme}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4, animation: `${fadeIn} 0.5s ease-out` }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${isDarkMode ? darkTheme.palette.primary.main : theme.palette.primary.main}, ${isDarkMode ? darkTheme.palette.secondary.main : theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Calendar
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Plan your schedule and keep track of important events
          </Typography>
        </Box>
        
        <TabContext value={view}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <TabList 
              onChange={handleViewChange}
              aria-label="calendar modes"
              centered
            >
              <Tab 
                icon={<EventNoteIcon />} 
                label="Regular Calendar" 
                value="month" 
                iconPosition="start"
              />
              <Tab 
                icon={<LockIcon />} 
                label="Health Tracker (Private)" 
                value="health" 
                iconPosition="start"
              />
            </TabList>
          </Box>

          <TabPanel value="month" sx={{ p: 0 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3,
                animation: `${fadeIn} 0.5s ease-out`,
                animationDelay: '0.1s'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mr: 2 }}>
                  {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </Typography>
                <Button 
                  startIcon={<TodayIcon />} 
                  variant="outlined" 
                  size="small" 
                  onClick={handleTodayClick}
                  sx={{ 
                    ml: 2, 
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 10px -2px ${alpha(theme.palette.primary.main, 0.2)}`,
                    }
                  }}
                >
                  Today
                </Button>
                <Button 
                  startIcon={<CategoryIcon />} 
                  variant="outlined" 
                  size="small" 
                  onClick={handleManageCategories}
                  sx={{ 
                    ml: 2, 
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 10px -2px ${alpha(theme.palette.primary.main, 0.2)}`,
                    }
                  }}
                >
                  Manage Categories
                </Button>
              </Box>
              <Box>
                <IconButton 
                  onClick={handlePrevMonth}
                  sx={{ 
                    mr: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'scale(1.1)',
                    }
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton 
                  onClick={handleNextMonth}
                  sx={{ 
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'scale(1.1)',
                    }
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Box>
            </Box>
            
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                borderRadius: 3,
                boxShadow: `0 10px 40px -10px ${alpha(theme.palette.primary.main, 0.15)}`,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {isLoading && (
                <Box sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: alpha(theme.palette.background.paper, 0.7),
                  zIndex: 10
                }}>
                  <CircularProgress />
                </Box>
              )}
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              {renderDays()}
              {renderCells()}
            </Paper>
          </TabPanel>

          <TabPanel value="health" sx={{ p: 0 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3,
                animation: `${fadeIn} 0.5s ease-out`,
                animationDelay: '0.1s'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mr: 2 }}>
                  Health Tracker: {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </Typography>
                <Button 
                  startIcon={<TodayIcon />} 
                  variant="outlined" 
                  size="small" 
                  color="primary"
                  onClick={handleTodayClick}
                  sx={{ 
                    ml: 2, 
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 10px -2px ${alpha(isDarkMode ? darkTheme.palette.primary.main : theme.palette.primary.main, 0.2)}`,
                    }
                  }}
                >
                  Today
                </Button>
                <Tooltip title="Health data is private and used for dashboards">
                  <Box 
                    sx={{ 
                      ml: 2, 
                      display: 'flex',
                      alignItems: 'center',
                      color: 'text.secondary',
                      bgcolor: alpha(isDarkMode ? darkTheme.palette.primary.main : theme.palette.primary.main, 0.1),
                      p: 0.5,
                      px: 1,
                      borderRadius: 1
                    }}
                  >
                    <LockIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">Private Mode</Typography>
                  </Box>
                </Tooltip>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setEventDetails({
                      ...eventDetails,
                      start_time: new Date().toISOString().slice(0, 16),
                      end_time: new Date().toISOString().slice(0, 16),
                      is_health_event: true
                    });
                    setIsHealthModalOpen(true);
                  }}
                  sx={{ 
                    mr: 2,
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 10px -2px ${alpha(isDarkMode ? darkTheme.palette.primary.main : theme.palette.primary.main, 0.2)}`,
                    }
                  }}
                >
                  Add Health Metric
                </Button>
                <IconButton 
                  onClick={handlePrevMonth}
                  sx={{ 
                    mr: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: alpha(isDarkMode ? darkTheme.palette.primary.main : theme.palette.primary.main, 0.1),
                      transform: 'scale(1.1)',
                    }
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton 
                  onClick={handleNextMonth}
                  sx={{ 
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: alpha(isDarkMode ? darkTheme.palette.primary.main : theme.palette.primary.main, 0.1),
                      transform: 'scale(1.1)',
                    }
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Box>
            </Box>
            
            <Paper 
              elevation={4}
              sx={{ 
                p: 2, 
                borderRadius: 3,
                boxShadow: `0 10px 40px -10px ${alpha(isDarkMode ? darkTheme.palette.primary.main : theme.palette.secondary.main, 0.25)}`,
                overflow: 'hidden',
                position: 'relative',
                border: isDarkMode ? `1px solid ${alpha(darkTheme.palette.primary.main, 0.2)}` : 'none',
                bgcolor: isDarkMode ? alpha(darkTheme.palette.background.paper, 0.8) : theme.palette.background.paper
              }}
            >
              {isLoading && (
                <Box sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: alpha(isDarkMode ? darkTheme.palette.background.paper : theme.palette.background.paper, 0.7),
                  zIndex: 10
                }}>
                  <CircularProgress color="primary" />
                </Box>
              )}
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  icon={<BedtimeIcon />} 
                  label="Sleep" 
                  color="primary" 
                  variant="outlined"
                  onClick={() => {}}
                />
                <Chip 
                  icon={<FitnessCenterIcon />} 
                  label="Exercise" 
                  color="success" 
                  variant="outlined"
                  onClick={() => {}}
                />
                <Chip 
                  icon={<MoodIcon />} 
                  label="Mood" 
                  color="secondary" 
                  variant="outlined"
                  onClick={() => {}}
                />
                <Chip 
                  icon={<AccessTimeIcon />} 
                  label="Screen Time" 
                  color="warning" 
                  variant="outlined"
                  onClick={() => {}}
                />
                <Chip 
                  icon={<DirectionsRunIcon />} 
                  label="Steps" 
                  color="info" 
                  variant="outlined"
                  onClick={() => {}}
                />
              </Box>
              
              {renderDays()}
              {renderCells()}
            </Paper>
          </TabPanel>
        </TabContext>
        
        <Dialog open={isModalOpen} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EventIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </Typography>
              </Box>
              {editingEvent && (
                <Tooltip title="Delete Event">
                  <IconButton 
                    color="error" 
                    size="small" 
                    onClick={handleDeleteEvent}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </DialogTitle>
          <DialogContent sx={{ pt: 2, pb: 1, mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Event Title"
              type="text"
              fullWidth
              variant="outlined"
              value={eventDetails.title}
              onChange={handleNewEventChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description (Optional)"
              type="text"
              fullWidth
              variant="outlined"
              value={eventDetails.description || ''}
              onChange={handleNewEventChange}
              sx={{ mb: 2 }}
              multiline
              rows={2}
            />
            <TextField
              margin="dense"
              name="location"
              label="Location (Optional)"
              type="text"
              fullWidth
              variant="outlined"
              value={eventDetails.location || ''}
              onChange={handleNewEventChange}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                margin="dense"
                name="start_time"
                label="Start Time"
                type="datetime-local"
                fullWidth
                variant="outlined"
                value={eventDetails.start_time}
                onChange={handleNewEventChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                margin="dense"
                name="end_time"
                label="End Time"
                type="datetime-local"
                fullWidth
                variant="outlined"
                value={eventDetails.end_time}
                onChange={handleNewEventChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                select
                margin="dense"
                name="category_id"
                label="Category"
                fullWidth
                variant="outlined"
                value={eventDetails.category_id || ''}
                onChange={handleNewEventChange}
              >
                <MenuItem value="">None</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          bgcolor: category.color,
                          mr: 1 
                        }} 
                      />
                      {category.name}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                margin="dense"
                name="reminder"
                label="Reminder"
                fullWidth
                variant="outlined"
                value={eventDetails.reminder || ''}
                onChange={handleNewEventChange}
              >
                <MenuItem value="">No Reminder</MenuItem>
                <MenuItem value={15}>15 minutes before</MenuItem>
                <MenuItem value={30}>30 minutes before</MenuItem>
                <MenuItem value={60}>1 hour before</MenuItem>
                <MenuItem value={1440}>1 day before</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ mr: 2 }}>All Day Event</Typography>
              <Box component="label" sx={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  name="all_day"
                  checked={eventDetails.all_day}
                  onChange={handleNewEventChange}
                  style={{ marginRight: theme.spacing(1) }}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={handleClose} color="inherit">Cancel</Button>
            <Button 
              onClick={handleAddEvent} 
              variant="contained"
              sx={{ 
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  boxShadow: `0 5px 10px -3px ${alpha(theme.palette.primary.main, 0.4)}`,
                }
              }}
            >
              {editingEvent ? 'Save Changes' : 'Add Event'}
            </Button>
          </DialogActions>
        </Dialog>
        
        <Dialog open={isHealthModalOpen} onClose={() => setIsHealthModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: alpha(isDarkMode ? darkTheme.palette.primary.main : theme.palette.primary.main, 0.05) }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MonitorHeartIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6">
                Add Health Metric
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ pt: 2, pb: 1, mt: 1 }}>
            <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
              <InputLabel id="health-metric-type-label">Metric Type</InputLabel>
              <Select
                labelId="health-metric-type-label"
                id="health-metric-type"
                name="type"
                value={healthMetricForm.type}
                onChange={handleHealthMetricSelectChange}
                label="Metric Type"
              >
                {healthMetricTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ mr: 1 }}>{healthMetricIcons[type] || <MonitorHeartIcon />}</Box>
                      {type.charAt(0).toUpperCase() + type.slice(1)} ({getUnitForMetricType(type)})
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              margin="dense"
              name="value"
              label={`Value (${getUnitForMetricType(healthMetricForm.type)})`}
              type="number"
              fullWidth
              variant="outlined"
              value={healthMetricForm.value}
              onChange={handleHealthMetricInputChange}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="dense"
              name="notes"
              label="Notes (Optional)"
              type="text"
              fullWidth
              variant="outlined"
              value={healthMetricForm.notes}
              onChange={handleHealthMetricInputChange}
              sx={{ mb: 2 }}
              multiline
              rows={2}
            />
            
            <TextField
              margin="dense"
              name="start_time"
              label="Date and Time"
              type="datetime-local"
              fullWidth
              variant="outlined"
              value={eventDetails.start_time}
              onChange={(e) => setEventDetails({
                ...eventDetails,
                start_time: e.target.value,
                end_time: e.target.value
              })}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setIsHealthModalOpen(false)} color="inherit">Cancel</Button>
            <Button 
              onClick={handleAddHealthMetric} 
              variant="contained"
              sx={{ 
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  boxShadow: `0 5px 10px -3px ${alpha(theme.palette.primary.main, 0.4)}`,
                }
              }}
            >
              Add Health Metric
            </Button>
          </DialogActions>
        </Dialog>
        
        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
        
        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default Calendar; 
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isToday, isThisMonth, isWeekend, parseISO, addDays, getDaysInMonth } from 'date-fns';
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
  SelectChangeEvent,
  CssBaseline
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
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import HeightIcon from '@mui/icons-material/Height';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Import health service
import { 
  getHealthMetricTypes, 
  getUnitForMetricType, 
  createHealthMetric, 
  getAllHealthMetrics
} from '../services/health.service';
import CalendarServiceAPI from '../services/calendar.service';

// 导入类型但使用不同的名称以避免冲突
import type { CalendarEvent as CalendarEventType, CalendarCategory as CalendarCategoryType } from '../services/calendar.service';

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
// interface CalendarCategory {
//   id: number;
//   name: string;
//   color: string;
//   user_id?: number;
// }

// interface CalendarEvent {
//   id?: number | string;
//   title: string;
//   description?: string;
//   location?: string;
//   start_time: string;
//   end_time: string;
//   all_day: boolean;
//   category_id: number;
//   category?: CalendarCategory;
//   user_id?: number;
//   reminder?: number | null;
//   is_health_event: boolean;
//   health_metric_type?: string;
//   health_metric_value?: number;
//   health_metric_id?: number | string;
// }

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
    getEventColor: (categoryId: number, categories: CalendarCategoryType[]) => {
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
  weight: <ScaleIcon />,
  height: <HeightIcon />,
  bloodPressure: <FavoriteIcon />,
  heartRate: <FavoriteIcon />,
  bloodSugar: <WaterDropIcon />,
  sleep: <BedtimeIcon />,
  exercise: <FitnessCenterIcon />,
  water: <LocalDrinkIcon />,
  diet: <RestaurantIcon />,
  medication: <MedicalInformationIcon />,
  appointment: <EventIcon />,
  other: <HelpOutlineIcon />
};

// Get color for health metric type
const getHealthMetricColor = (type: string) => {
  const colors = {
    weight: '#757575', // gray
    height: '#9E9E9E', // gray
    bloodPressure: '#d32f2f', // red
    heartRate: '#d32f2f', // red
    bloodSugar: '#E91E63', // pink
    sleep: '#5e35b1', // purple
    exercise: '#43a047', // green
    water: '#0097a7', // teal
    diet: '#ff9800', // orange
    medication: '#E57373', // light red
    appointment: '#3F51B5', // indigo
    other: '#607D8B' // blue gray
  };
  
  return colors[type as keyof typeof colors] || colors.other;
};

// 修改 FORCE_DARK_MODE_STYLE 变量中的文本颜色样式
const FORCE_DARK_MODE_STYLE = `
  html, body, #root, main, .page-transition, .MuiBox-root {
    background-color: #121212 !important;
    color: #ffffff !important;
  }
  
  .MuiAppBar-root, .MuiToolbar-root, nav, header {
    background-color: #1e1e1e !important;
    color: #ffffff !important;
  }
  
  .MuiPaper-root {
    background-color: #1e1e1e !important;
    background-image: none !important;
  }
  
  .MuiDrawer-paper {
    background-color: #1e1e1e !important;
  }
  
  .MuiDialog-paper {
    background-color: #1e1e1e !important;
  }
  
  .MuiPopover-paper, .MuiMenu-paper {
    background-color: #2d2d2d !important;
  }
  
  .MuiButton-root, .MuiIconButton-root {
    color: #90caf9 !important;
  }
  
  /* 确保按钮内的文字具有适当的对比度和可见性 */
  .MuiButton-contained {
    color: #ffffff !important;
  }
  
  .MuiButton-containedPrimary {
    background-color: #1976d2 !important;
    color: #ffffff !important;
  }
  
  .MuiButton-containedSecondary {
    background-color: #c2185b !important;
    color: #ffffff !important;
  }
  
  .MuiTypography-root {
    color: #ffffff !important;
  }
  
  .MuiTypography-colorTextSecondary {
    color: #cccccc !important; 
  }
  
  /* 确保所有对话框内的文本可见 */
  .MuiDialogContent-root {
    color: #ffffff !important;
  }
  
  .MuiDialogActions-root .MuiButton-contained {
    color: #ffffff !important;
  }
  
  * {
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  .forced-dark-mode-indicator {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #1e1e1e !important;
    color: #ffffff !important;
    text-align: center;
    padding: 2px 0;
    font-size: 12px;
    z-index: 9999;
  }
`;

// 该函数强制应用深色模式到整个页面
const applyForcedDarkMode = (enable: boolean) => {
  let styleEl = document.getElementById('force-dark-mode') as HTMLStyleElement;
  let indicatorEl = document.getElementById('dark-mode-indicator') as HTMLDivElement;
  
  if (enable) {
    // 添加样式
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'force-dark-mode';
      styleEl.innerHTML = FORCE_DARK_MODE_STYLE;
      document.head.appendChild(styleEl);
    }
    
    // 添加指示器
    if (!indicatorEl) {
      indicatorEl = document.createElement('div');
      indicatorEl.id = 'dark-mode-indicator';
      indicatorEl.className = 'forced-dark-mode-indicator';
      indicatorEl.innerHTML = '🔒 Private Mode Active';
      document.body.prepend(indicatorEl);
    }
    
    document.documentElement.classList.add('forced-dark-mode');
    document.body.classList.add('forced-dark-mode');
  } else {
    // 移除样式
    if (styleEl) {
      document.head.removeChild(styleEl);
    }
    
    // 移除指示器
    if (indicatorEl) {
      indicatorEl.remove();
    }
    
    document.documentElement.classList.remove('forced-dark-mode');
    document.body.classList.remove('forced-dark-mode');
  }
};

// 确保在页面加载时立即应用深色模式 - 使用分号前缀避免ASI问题
;(function checkAndApplyDarkMode() {
  const privateModeEnabled = localStorage.getItem('calendar_private_mode') === 'true';
  if (privateModeEnabled) {
    applyForcedDarkMode(true);
  }
})();

const Calendar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const eventColors = useEventColors();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTab, setCurrentTab] = useState('regular');
  
  // 日历视图状态
  const [view, setView] = useState<View>('month');
  const [regularEvents, setRegularEvents] = useState<CalendarEventType[]>([]);
  const [healthEvents, setHealthEvents] = useState<CalendarEventType[]>([]);
  const [allEvents, setAllEvents] = useState<CalendarEventType[]>([]);
  const [categories, setCategories] = useState<CalendarCategoryType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [visibleEvents, setVisibleEvents] = useState<CalendarEventType[]>([]);
  
  // 事件和编辑模态框状态
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventType | null>(null);
  const [eventFormData, setEventFormData] = useState<Partial<CalendarEventType>>({
    title: '',
    description: '',
    start_time: new Date().toISOString(),
    end_time: new Date().toISOString(),
    all_day: false,
    category_id: null
  });
  
  // UI状态变量
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  
  // Dark mode for health view
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Create a darker theme for health view
  const darkTheme = createTheme({
    ...theme,
    palette: {
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
      text: {
        primary: '#ffffff',
        secondary: '#cccccc', // 提高对比度，从#b0b0b0改为#cccccc
      },
      divider: 'rgba(255, 255, 255, 0.12)',
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#121212',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: '#121212',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            '&.MuiTypography-body2': {
              color: '#ffffff', // 确保次要文本在深色模式下更可读
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            '&.MuiButton-containedInherit': {
              backgroundColor: '#333333', // 修改继承按钮颜色，避免误认
            },
          },
        },
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
  
  // Category form state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryDetails, setCategoryDetails] = useState<{ name: string; color: string }>({
    name: '',
    color: eventColors.blue
  });
  const [editingCategory, setEditingCategory] = useState<CalendarCategoryType | null>(null);
  
  // Filter state
  const [showRegularEvents, setShowRegularEvents] = useState(true);
  const [showHealthEvents, setShowHealthEvents] = useState(true);
  
  // Default category for health events
  const healthCategoryId = 999; // Special ID for health category
  
  // First add a state to track private mode
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  
  // Load private mode state from localStorage on initial render
  useEffect(() => {
    const savedPrivateMode = localStorage.getItem('calendar_private_mode') === 'true';
    if (savedPrivateMode) {
      setIsPrivateMode(true);
      setIsDarkMode(true);
    }
    
    return () => {
      // 当组件卸载时清理样式
      applyForcedDarkMode(false);
    };
  }, []);
  
  // Set up initial calendar state
  useEffect(() => {
    fetchCategories();
    fetchEvents();
  }, []);
  
  // Update visible events whenever filters or events change
  useEffect(() => {
    // Combine and filter events based on user selections
    let filtered = [];
    
    if (showRegularEvents) {
      filtered = [...filtered, ...regularEvents];
    }
    
    if (showHealthEvents) {
      filtered = [...filtered, ...healthEvents];
    }
    
    // If categories are selected, further filter
    if (selectedCategories.length > 0) {
      console.log('使用类别过滤:', selectedCategories);
      filtered = filtered.filter(event => {
        // 健康事件不应该被类别过滤掉
        if (event.is_health_event) {
          console.log(`保留健康事件: ${event.title}`);
          return true;
        }
        
        // 常规事件按类别过滤
        const eventCategoryId = typeof event.category === 'object' && event.category 
          ? event.category.id 
          : event.category_id;
          
        const isIncluded = selectedCategories.includes(eventCategoryId);
        if (!isIncluded) {
          console.log(`过滤掉事件: ${event.title}, 类别ID: ${eventCategoryId}`);
        }
        return isIncluded;
      });
    }

    console.log(`过滤后剩余事件数量: ${filtered.length}`);
    setVisibleEvents(filtered);
  }, [regularEvents, healthEvents, selectedCategories, showRegularEvents, showHealthEvents]);
  
  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await CalendarServiceAPI.getAllCategories();
      setCategories(response.data);
      
      // Initialize selected categories to include all categories
      setSelectedCategories(response.data.map((cat: CalendarCategoryType) => cat.id));
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again later.');
    }
  };
  
  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the current month's first and last day
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
      
      console.log(`获取 ${currentYear}年${currentMonth}月 的日历事件`);
      
      // Get regular events
      const regularEventsResponse = await CalendarServiceAPI.getMonthEvents(currentYear, currentMonth);
      const fetchedRegularEvents = regularEventsResponse.data || [];
      setRegularEvents(fetchedRegularEvents);
      
      // Get health events for current year/month
      const healthEventsResponse = await CalendarServiceAPI.getHealthEvents(currentYear, currentMonth);
      const fetchedHealthEvents = healthEventsResponse.data || [];
      
      console.log('获取到的健康日历事件原始数据:', healthEventsResponse);
      console.log('健康日历事件数据:', healthEventsResponse.data);
      
      if (Array.isArray(healthEventsResponse.data)) {
        console.log(`成功获取到 ${healthEventsResponse.data.length} 个健康日历事件`);
        console.log('第一条健康日历事件:', healthEventsResponse.data[0]);
      } else {
        console.log('健康日历事件数据不是数组，实际数据类型:', typeof healthEventsResponse.data);
        console.log('健康日历事件数据结构:', healthEventsResponse.data);
      }
      
      // 确保健康事件被正确标记
      const processedHealthEvents = fetchedHealthEvents.map(event => ({
        ...event,
        is_health_event: true, // 确保明确标记为健康事件
        // 确保日期格式一致
        start_time: event.start_time,
        end_time: event.end_time || event.start_time
      }));
      
      console.log('处理后的健康事件:', processedHealthEvents);
      
      setHealthEvents(processedHealthEvents);
      
      // Combine events
      const combinedEvents = [...fetchedRegularEvents, ...processedHealthEvents];
      setAllEvents(combinedEvents);
      
      console.log(`加载了 ${fetchedRegularEvents.length} 条常规事件和 ${processedHealthEvents.length} 条健康事件`);
      
      setIsLoading(false);
    } catch (err: any) {
      console.error('获取日历事件时出错:', err);
      setError(err.message || '获取事件失败');
      setIsLoading(false);
    }
  }, [currentDate]);
  
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
    
    setEventFormData({
      title: '',
      description: '',
      location: '',
      start_time: defaultStartTime,
      end_time: defaultEndTime,
      all_day: false,
      category_id: 1,
      is_health_event: view === 'health'
    });
    
    setSelectedEvent(null);
    
    // Open appropriate modal based on view
    if (view === 'health') {
      setIsHealthModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleEventClick = (event: CalendarEventType) => {
    setSelectedEvent(event);
    setEventFormData({
      ...event,
      start_time: event.start_time.slice(0, 16), // Format for datetime-local input
      end_time: event.end_time.slice(0, 16)      // Format for datetime-local input
    });
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleNewEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEventFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddEvent = async () => {
    try {
      // Format data for API with required fields
      const eventData: any = {
        ...eventFormData,
        title: eventFormData.title || '',
        start_time: eventFormData.start_time || new Date().toISOString(),
        end_time: eventFormData.end_time || new Date().toISOString(),
        all_day: eventFormData.all_day || false,
        category_id: eventFormData.category_id || 1,
        is_health_event: eventFormData.is_health_event || false
      };
      
      if (selectedEvent && selectedEvent.id) {
        // Update existing event
        await CalendarServiceAPI.updateEvent(selectedEvent.id, eventData);
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
    if (!selectedEvent || !selectedEvent.id) return;
    
    try {
      // Delete event
      await CalendarServiceAPI.deleteEvent(selectedEvent.id);
      
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
        const dayEvents = showRegularEvents ? regularEvents : healthEvents;
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
            onMouseEnter={() => setSelectedEvent(filteredEvents.find(e => format(new Date(e.start_time), 'yyyy-MM-dd') === dayStr) as CalendarEventType)}
            onMouseLeave={() => setSelectedEvent(null)}
          >
            <Paper 
              elevation={isToday ? 3 : selectedEvent && selectedEvent.id === filteredEvents.find(e => format(new Date(e.start_time), 'yyyy-MM-dd') === dayStr)?.id ? 2 : 0}
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
                {selectedEvent && selectedEvent.id === filteredEvents.find(e => format(new Date(e.start_time), 'yyyy-MM-dd') === dayStr)?.id && isCurrentMonth && (
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
                  console.log('渲染事件:', event);
                  const startTime = new Date(event.start_time);
                  const formattedTime = format(startTime, 'HH:mm');
                  
                  // 安全地获取类别颜色
                  const categoryColor = typeof event.category === 'object' && event.category ? 
                    event.category.color : 
                    '#2196F3'; // 默认颜色
                  
                  // 确定是否为健康事件 - 检查category值，考虑它可能是对象或字符串
                  const categoryName = typeof event.category === 'object' && event.category ? 
                    event.category.name : 
                    (typeof event.category === 'string' ? event.category : null);
                  
                  const isHealthEvent = event.is_health_event || 
                    categoryName === 'medication' || 
                    categoryName === 'appointment' || 
                    categoryName === 'exercise' || 
                    categoryName === 'diet' || 
                    categoryName === 'measurement';
                  
                  console.log(`事件 ${event.title} 是健康事件吗: ${isHealthEvent}, category: ${categoryName}, is_health_event: ${event.is_health_event}`);
                  
                  // 获取健康事件类型（优先使用health_metric_type，如果没有则映射category）
                  const healthType = event.health_metric_type || (
                    categoryName === 'exercise' ? 'exercise' :
                    categoryName === 'diet' ? 'diet' :
                    categoryName === 'measurement' ? 'weight' :
                    categoryName === 'medication' ? 'medication' :
                    categoryName === 'appointment' ? 'appointment' : 'other'
                  );
                  
                  // 获取事件颜色
                  const eventColor = isHealthEvent 
                    ? getHealthMetricColor(healthType)
                    : (event.color || categoryColor);
                  
                  return (
                    <Box 
                      key={event.id}
                      sx={{ 
                        bgcolor: isHealthEvent 
                          ? alpha(eventColor, 0.7)
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
                        borderLeft: isHealthEvent 
                          ? `3px solid ${eventColor}`
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
                      {isHealthEvent && (
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
                          {healthType === 'sleep' && <BedtimeIcon fontSize="inherit" />}
                          {healthType === 'exercise' && <FitnessCenterIcon fontSize="inherit" />}
                          {healthType === 'water' && <LocalDrinkIcon fontSize="inherit" />}
                          {healthType === 'weight' && <ScaleIcon fontSize="inherit" />}
                          {healthType === 'height' && <HeightIcon fontSize="inherit" />}
                          {healthType === 'heartRate' && <FavoriteIcon fontSize="inherit" />}
                          {healthType === 'bloodPressure' && <FavoriteIcon fontSize="inherit" />}
                          {healthType === 'bloodSugar' && <WaterDropIcon fontSize="inherit" />}
                          {healthType === 'diet' && <RestaurantIcon fontSize="inherit" />}
                          {healthType === 'medication' && <MedicalInformationIcon fontSize="inherit" />}
                          {healthType === 'appointment' && <EventIcon fontSize="inherit" />}
                          {healthType === 'other' && <HelpOutlineIcon fontSize="inherit" />}
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
  
  // Handle health metric form
  const handleOpenHealthMetricForm = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const formattedDate = format(date, "yyyy-MM-dd'T'09:00:00");
    
    setEventFormData({
      ...eventFormData,
      start_time: formattedDate,
      end_time: formattedDate,
      is_health_event: true
    });
    
    setIsHealthModalOpen(true);
  };
  
  // 保留函数，但修改为内部使用的工具函数
  const handlePrivateModeToggle = (newMode: boolean) => {
    setIsPrivateMode(newMode);
    // Save private mode state in localStorage for cross-page state
    localStorage.setItem('calendar_private_mode', newMode.toString());
    // If private mode, apply dark theme
    setIsDarkMode(newMode);
    
    // Dispatch custom event for App.tsx to detect the change
    window.dispatchEvent(new CustomEvent('private-mode-change'));
    
    // 强制应用深色模式到整个页面
    applyForcedDarkMode(newMode);
  };
  
  // Handle view change with theme toggle
  const handleViewChange = (event: React.SyntheticEvent, newView: View) => {
    setView(newView);
    
    // 自动切换深浅色模式
    if (newView === 'health' && !isPrivateMode) {
      // 进入health选项卡时自动切换到深色模式
      handlePrivateModeToggle(true);
    } else if (newView === 'month' && isPrivateMode) {
      // 返回month选项卡时自动切换到浅色模式
      handlePrivateModeToggle(false);
    }
    
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
      
      // 获取健康数据
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
      
      // 从calendar service获取健康数据
      const healthEventsResponse = await CalendarServiceAPI.getHealthEvents(currentYear, currentMonth);
      setHealthEvents(healthEventsResponse.data);
      
      // 如果数据为空，从health service获取数据
      if (healthEventsResponse.data.length === 0) {
        const response = await getAllHealthMetrics(1, 100, undefined, startDate, endDate);
        
        if (response && response.data) {
          // 将健康指标转换为日历事件
          const healthEvents: CalendarEventType[] = response.data.map((metric: any) => {
            const metricDate = parseISO(metric.date);
            
            return {
              id: parseInt(metric.id), // 将string转换为number
              title: `${metric.type.charAt(0).toUpperCase() + metric.type.slice(1)}: ${metric.value} ${metric.unit}`,
              description: metric.notes || '',
              start_time: format(metricDate, "yyyy-MM-dd'T'HH:mm:ss"),
              end_time: format(addDays(metricDate, 0), "yyyy-MM-dd'T'HH:mm:ss"),
              all_day: false,
              category_id: 999, // Special ID for health category
              is_health_event: true,
              health_metric_type: metric.type,
              health_metric_value: metric.value,
              health_metric_id: parseInt(metric.id) // 将string转换为number
            };
          });
          
          setHealthEvents(healthEvents as unknown as CalendarEventType[]);
        }
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
          new Date(eventFormData.start_time || '')
        );
        
        // Show success message
        setSuccess('Health metric added successfully');
        
        // Refresh health metrics from server
        fetchHealthMetrics();
      } catch (createError) {
        console.error('Error creating health metric:', createError);
        
        // 如果API失败，添加到本地健康事件
        const newHealthEvent: CalendarEventType = {
          id: parseInt(`${Date.now()}`), // 将string转换为number
          title: `${type.charAt(0).toUpperCase() + type.slice(1)}: ${numericValue} ${unit}`,
          description: notes as string || '',
          start_time: eventFormData.start_time || new Date().toISOString(),
          end_time: eventFormData.start_time || new Date().toISOString(),
          all_day: false,
          category_id: 999,
          is_health_event: true,
          health_metric_type: type,
          health_metric_value: numericValue
        };
        
        // 更新本地健康事件列表
        setHealthEvents(prevEvents => [...prevEvents, newHealthEvent]);
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
  
  // 修改事件渲染函数
  const renderDayEvents = (day: number) => {
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = format(dayDate, 'yyyy-MM-dd');
    
    // 找出当天的事件
    const eventsForDay = visibleEvents.filter(event => {
      const eventStartDate = event.start_time.split('T')[0];
      const eventEndDate = event.end_time.split('T')[0];
      return eventStartDate === dateString || eventEndDate === dateString;
    });
    
    // 限制显示数量
    const maxEventsToShow = 3;
    const displayEvents = eventsForDay.slice(0, maxEventsToShow);
    const remainingCount = eventsForDay.length - maxEventsToShow;
    
    return (
      <Box sx={{ mt: 1 }}>
        {displayEvents.map((event, index) => {
          const isHealthEvent = event.is_health_event || false;
          // 安全地获取颜色
          const color = isHealthEvent 
            ? getHealthMetricColor(event.health_metric_type || 'default')
            : (event.color || (typeof event.category === 'object' && event.category ? event.category.color : '#1976d2'));
            
          return (
            <Box
              key={`${event.id}-${index}`}
              sx={{
                backgroundColor: color,
                color: '#fff',
                p: 0.5,
                mb: 0.5,
                borderRadius: '4px',
                fontSize: '0.75rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                animation: `${scaleIn} 0.3s ease-out`
              }}
              onClick={() => handleEventClick(event)}
            >
              {event.title}
            </Box>
          );
        })}
        
        {remainingCount > 0 && (
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center' }}>
            +{remainingCount} 更多
          </Typography>
        )}
      </Box>
    );
  };
  
  // 添加健康事件颜色函数
  const getHealthEventColor = (category: string) => {
    switch (category) {
      case 'medication':
        return '#E57373'; // 红色
      case 'appointment':
        return '#64B5F6'; // 蓝色
      case 'exercise':
        return '#81C784'; // 绿色
      case 'diet':
        return '#FFD54F'; // 黄色
      case 'measurement':
        return '#9575CD'; // 紫色
      default:
        return '#90A4AE'; // 默认灰色
    }
  };
  
  // 渲染日期单元格
  const renderDateCell = (day: number) => {
    const isCurrentMonth = day > 0 && day <= getDaysInMonth(currentDate);
    
    if (!isCurrentMonth) {
      return null;
    }
    
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const formattedDate = format(dayDate, 'yyyy-MM-dd');
    
    // 查找当天的事件
    const eventsForDay = visibleEvents.filter(event => {
      // 安全获取日期字符串，避免日期解析错误
      let eventStart, eventEnd;
      try {
        // 处理不同格式的日期
        if (typeof event.start_time === 'string') {
          // 如果是ISO字符串格式（带T的日期时间）
          if (event.start_time.includes('T')) {
            eventStart = event.start_time.split('T')[0];
          } else {
            // 如果是其他格式的字符串
            eventStart = format(new Date(event.start_time), 'yyyy-MM-dd');
          }
        } else {
          // 如果是Date对象
          eventStart = format(event.start_time, 'yyyy-MM-dd');
        }

        if (event.end_time) {
          if (typeof event.end_time === 'string') {
            if (event.end_time.includes('T')) {
              eventEnd = event.end_time.split('T')[0];
            } else {
              eventEnd = format(new Date(event.end_time), 'yyyy-MM-dd');
            }
          } else {
            eventEnd = format(event.end_time, 'yyyy-MM-dd');
          }
        } else {
          eventEnd = eventStart;
        }
      } catch (error) {
        console.error('日期解析错误:', error, event);
        return false;
      }
      
      // 检查事件日期是否包含当前单元格日期
      return formattedDate >= eventStart && formattedDate <= eventEnd;
    });
    
    // 调试日期单元格的事件数量
    const healthEventsForDay = eventsForDay.filter(e => e.is_health_event);
    if (eventsForDay.length > 0) {
      console.log(`${formattedDate} 有 ${eventsForDay.length} 个事件，其中健康事件 ${healthEventsForDay.length} 个`);
      if (healthEventsForDay.length > 0) {
        console.log(`健康事件示例:`, healthEventsForDay[0]);
      }
    }
    
    return (
      <Box 
        sx={{ 
          width: '14.28%',
          px: 0.5,
          animation: `${scaleIn} 0.5s ease-out`,
          animationDelay: '0.1s',
          opacity: 0,
          animationFillMode: 'forwards',
        }}
        onMouseEnter={() => setSelectedEvent(eventsForDay.find(e => format(new Date(e.start_time), 'yyyy-MM-dd') === formattedDate) as CalendarEventType)}
        onMouseLeave={() => setSelectedEvent(null)}
      >
        <Paper 
          elevation={isToday(dayDate) ? 3 : selectedEvent && selectedEvent.id === eventsForDay.find(e => format(new Date(e.start_time), 'yyyy-MM-dd') === formattedDate)?.id ? 2 : 0}
          sx={{ 
            p: 1, 
            height: 120, 
            bgcolor: isToday(dayDate) 
              ? alpha(theme.palette.primary.main, 0.1)
              : !isCurrentMonth 
                ? alpha(theme.palette.text.disabled, 0.03) 
                : isWeekend(dayDate) 
                  ? alpha(theme.palette.background.default, 0.6) 
                  : alpha(theme.palette.background.paper, 1),
            borderRadius: 2,
            border: isToday(dayDate) 
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
          onClick={() => handleDateClick(day)}
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
                fontWeight: isToday(dayDate) ? 'bold' : isCurrentMonth ? 'medium' : 'normal',
                color: !isCurrentMonth 
                  ? 'text.disabled' 
                  : isToday(dayDate) 
                    ? 'primary.main' 
                    : 'text.primary',
                bgcolor: isToday(dayDate) ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                borderRadius: '50%',
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {day}
            </Typography>
            {selectedEvent && selectedEvent.id === eventsForDay.find(e => format(new Date(e.start_time), 'yyyy-MM-dd') === formattedDate)?.id && isCurrentMonth && (
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
                    handleDateClick(day);
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          
          <Box sx={{ overflow: 'hidden' }}>
            {eventsForDay.map((event) => {
              console.log('渲染事件:', event);
              const startTime = new Date(event.start_time);
              const formattedTime = format(startTime, 'HH:mm');
              
              // 安全地获取类别颜色
              const categoryColor = typeof event.category === 'object' && event.category ? 
                event.category.color : 
                '#2196F3'; // 默认颜色
              
              // 确定是否为健康事件 - 检查category值，考虑它可能是对象或字符串
              const categoryName = typeof event.category === 'object' && event.category ? 
                event.category.name : 
                (typeof event.category === 'string' ? event.category : null);
              
              const isHealthEvent = event.is_health_event || 
                categoryName === 'medication' || 
                categoryName === 'appointment' || 
                categoryName === 'exercise' || 
                categoryName === 'diet' || 
                categoryName === 'measurement';
              
              console.log(`事件 ${event.title} 是健康事件吗: ${isHealthEvent}, category: ${categoryName}, is_health_event: ${event.is_health_event}`);
              
              // 获取健康事件类型（优先使用health_metric_type，如果没有则映射category）
              const healthType = event.health_metric_type || (
                categoryName === 'exercise' ? 'exercise' :
                categoryName === 'diet' ? 'diet' :
                categoryName === 'measurement' ? 'weight' :
                categoryName === 'medication' ? 'medication' :
                categoryName === 'appointment' ? 'appointment' : 'other'
              );
              
              // 获取事件颜色
              const eventColor = isHealthEvent 
                ? getHealthMetricColor(healthType)
                : (event.color || categoryColor);
              
              return (
                <Box 
                  key={event.id}
                  sx={{ 
                    bgcolor: isHealthEvent 
                      ? alpha(eventColor, 0.7)
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
                    borderLeft: isHealthEvent 
                      ? `3px solid ${eventColor}`
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
                  {isHealthEvent && (
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
                      {healthType === 'sleep' && <BedtimeIcon fontSize="inherit" />}
                      {healthType === 'exercise' && <FitnessCenterIcon fontSize="inherit" />}
                      {healthType === 'water' && <LocalDrinkIcon fontSize="inherit" />}
                      {healthType === 'weight' && <ScaleIcon fontSize="inherit" />}
                      {healthType === 'height' && <HeightIcon fontSize="inherit" />}
                      {healthType === 'heartRate' && <FavoriteIcon fontSize="inherit" />}
                      {healthType === 'bloodPressure' && <FavoriteIcon fontSize="inherit" />}
                      {healthType === 'bloodSugar' && <WaterDropIcon fontSize="inherit" />}
                      {healthType === 'diet' && <RestaurantIcon fontSize="inherit" />}
                      {healthType === 'medication' && <MedicalInformationIcon fontSize="inherit" />}
                      {healthType === 'appointment' && <EventIcon fontSize="inherit" />}
                      {healthType === 'other' && <HelpOutlineIcon fontSize="inherit" />}
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
  };
  
  return (
    <ThemeProvider theme={isPrivateMode ? darkTheme : theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          bgcolor: 'background.default',
          color: 'text.primary',
          minHeight: '100vh',
          width: '100%',
          transition: 'background-color 0.3s ease, color 0.3s ease',
          pt: 2,
          pb: 4
        }}
      >
        <Container maxWidth="xl">
          {/* Private mode indicator */}
          {isPrivateMode && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Chip 
                icon={<LockIcon />} 
                label="Private Mode Active" 
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
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setEventFormData({
                        ...eventFormData,
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
                    {selectedEvent ? 'Edit Event' : 'Add New Event'}
                  </Typography>
                </Box>
                {selectedEvent && (
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
                value={eventFormData.title}
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
                value={eventFormData.description || ''}
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
                value={eventFormData.location || ''}
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
                  value={eventFormData.start_time}
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
                  value={eventFormData.end_time}
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
                  value={eventFormData.category_id || ''}
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
                  value={eventFormData.reminder || ''}
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
                    checked={eventFormData.all_day}
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
                {selectedEvent ? 'Save Changes' : 'Add Event'}
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
                value={eventFormData.start_time}
                onChange={(e) => setEventFormData({
                  ...eventFormData,
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
                color="primary"
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  color: '#ffffff', // 确保文字颜色为白色
                  backgroundColor: theme.palette.primary.main, // 确保背景色为主色调
                  '&:hover': {
                    boxShadow: `0 5px 10px -3px ${alpha(theme.palette.primary.main, 0.4)}`,
                    backgroundColor: theme.palette.primary.dark, // 悬停时变暗
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
      </Box>
    </ThemeProvider>
  );
};

export default Calendar;
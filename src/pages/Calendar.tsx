import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  MenuItem, 
  IconButton, 
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import { keyframes } from '@mui/system';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import TodayIcon from '@mui/icons-material/Today';

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

// Mock data
const mockEvents = [
  { id: 1, title: 'Math Exam', date: '2025-04-15', time: '10:00 AM', category: 'exam' },
  { id: 2, title: 'Physics Assignment Due', date: '2025-04-20', time: '11:59 PM', category: 'assignment' },
  { id: 3, title: 'Study Group', date: '2025-04-12', time: '3:00 PM', category: 'meeting' },
  { id: 4, title: 'Career Counseling', date: '2025-04-18', time: '1:30 PM', category: 'meeting' },
];

const Calendar: React.FC = () => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    category: 'meeting',
  });
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(day);
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setNewEvent(prev => ({ ...prev, date: formattedDate }));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDate(null);
  };

  const handleNewEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = () => {
    // In a real app, we would save this to a backend
    console.log('New event created:', newEvent);
    handleClose();
  };

  const handleTodayClick = () => {
    setCurrentMonth(new Date());
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
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    const endDate = new Date(monthEnd);
    
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
        const cloneDay = new Date(day);
        const dayStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
        
        const dayEvents = mockEvents.filter(event => event.date === dayStr);
        const isToday = day.toDateString() === new Date().toDateString();
        const isCurrentMonth = day.getMonth() === monthStart.getMonth();
        const isWeekend = day.getDay() === 0 || day.getDay() === 6;
        
        days.push(
          <Box 
            key={day.toString()} 
            sx={{ 
              width: '14.28%',
              px: 0.5,
              animation: `${scaleIn} 0.5s ease-out`,
              animationDelay: `${i * 0.05 + j * 0.03}s`,
              opacity: 0,
              animationFillMode: 'forwards',
            }}
            onMouseEnter={() => setHoveredDay(dayStr)}
            onMouseLeave={() => setHoveredDay(null)}
          >
            <Paper 
              elevation={isToday ? 3 : hoveredDay === dayStr ? 2 : 0}
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
              onClick={() => handleDateClick(day.getDate())}
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
                {hoveredDay === dayStr && isCurrentMonth && (
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
                        handleDateClick(day.getDate());
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              
              <Box sx={{ overflow: 'hidden' }}>
                {dayEvents.map((event, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      bgcolor: event.category === 'exam' 
                        ? alpha(theme.palette.error.main, 0.7)
                        : event.category === 'assignment' 
                          ? alpha(theme.palette.warning.main, 0.7)
                          : alpha(theme.palette.primary.main, 0.7),
                      color: 'white',
                      p: 0.5,
                      borderRadius: 1,
                      mb: 0.5,
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      transition: 'transform 0.15s ease',
                      '&:hover': {
                        transform: 'translateX(5px)',
                        boxShadow: `0 2px 5px -2px ${alpha(theme.palette.common.black, 0.3)}`,
                      }
                    }}
                  >
                    {event.time} - {event.title}
                  </Box>
                ))}
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
          key={day.toString()}
        >
          {days}
        </Box>
      );
      
      // Stop rendering if we've passed the end of the month
      if (day > monthEnd) break;
    }
    
    return <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column' }}>{rows}</Box>;
  };
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, animation: `${fadeIn} 0.5s ease-out` }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Calendar
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Plan your study schedule and keep track of important events.
        </Typography>
      </Box>
      
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
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
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
          overflow: 'hidden'
        }}
      >
        {renderDays()}
        {renderCells()}
      </Paper>
      
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EventIcon sx={{ mr: 1 }} color="primary" />
            <Typography variant="h6">Add New Event</Typography>
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
            value={newEvent.title}
            onChange={handleNewEventChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="date"
            label="Date"
            type="date"
            fullWidth
            variant="outlined"
            value={newEvent.date}
            onChange={handleNewEventChange}
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            name="time"
            label="Time"
            type="time"
            fullWidth
            variant="outlined"
            value={newEvent.time}
            onChange={handleNewEventChange}
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            select
            margin="dense"
            name="category"
            label="Category"
            fullWidth
            variant="outlined"
            value={newEvent.category}
            onChange={handleNewEventChange}
          >
            <MenuItem value="exam">Exam</MenuItem>
            <MenuItem value="assignment">Assignment</MenuItem>
            <MenuItem value="meeting">Meeting</MenuItem>
          </TextField>
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
            Add Event
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Calendar; 
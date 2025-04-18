import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import HealthCalendarService, { HealthCalendarEvent } from '../services/healthCalendar.service';

// 健康事件图标和颜色映射
const eventColors = {
  medication: '#E57373', // 红色
  appointment: '#64B5F6', // 蓝色
  exercise: '#81C784', // 绿色
  diet: '#FFD54F', // 黄色
  measurement: '#9575CD', // 紫色
  other: '#90A4AE', // 灰色
};

interface HealthCalendarEventsProps {
  year: number;
  month: number;
  onEventClick?: (event: HealthCalendarEvent) => void;
}

const HealthCalendarEvents: React.FC<HealthCalendarEventsProps> = ({ 
  year, 
  month, 
  onEventClick 
}) => {
  const [events, setEvents] = useState<HealthCalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取当月的健康日历事件
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`获取 ${year}年${month}月 的健康日历事件`);
        const response = await HealthCalendarService.getMonthEvents(year, month);
        setEvents(response.data || []);
        console.log(`找到 ${response.data.length} 条健康日历事件`);
      } catch (err) {
        console.error('获取健康日历事件失败:', err);
        setError('获取健康记录失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [year, month]);

  // 获取事件类别的颜色
  const getEventColor = (category: string) => {
    return eventColors[category as keyof typeof eventColors] || eventColors.other;
  };

  // 按日期分组事件
  const eventsByDate = events.reduce((acc, event) => {
    const dateStr = format(new Date(event.start_time), 'yyyy-MM-dd');
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(event);
    return acc;
  }, {} as Record<string, HealthCalendarEvent[]>);

  // 渲染加载状态
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <CircularProgress />
        <Typography variant="body2" ml={2}>
          加载健康日历事件...
        </Typography>
      </Box>
    );
  }

  // 渲染错误状态
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  // 如果没有事件
  if (events.length === 0) {
    return (
      <Box p={2} textAlign="center">
        <Typography variant="body1" color="text.secondary">
          本月没有健康记录
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          添加健康指标数据以在日历中查看
        </Typography>
      </Box>
    );
  }

  // 渲染事件列表
  return (
    <Box>
      <Typography variant="h6" mb={2}>
        健康记录 ({events.length})
      </Typography>
      
      {Object.entries(eventsByDate).map(([dateStr, dateEvents]) => (
        <Paper key={dateStr} sx={{ mb: 2, p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" mb={1}>
            {format(new Date(dateStr), 'yyyy年MM月dd日')}
          </Typography>
          
          <Grid container spacing={1}>
            {dateEvents.map((event, index) => (
              <Grid item xs={12} key={`${event.id}-${index}`}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    borderLeft: `4px solid ${getEventColor(event.category)}`,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.action.hover
                    }
                  }}
                  onClick={() => onEventClick && onEventClick(event)}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1">{event.title}</Typography>
                    <Chip 
                      label={event.category} 
                      size="small"
                      sx={{ 
                        backgroundColor: getEventColor(event.category),
                        color: 'white'
                      }}
                    />
                  </Box>
                  
                  {event.description && (
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      {event.description}
                    </Typography>
                  )}
                  
                  <Typography variant="caption" display="block" color="text.secondary" mt={0.5}>
                    {format(new Date(event.start_time), 'HH:mm')} - 
                    {format(new Date(event.end_time), 'HH:mm')}
                  </Typography>
                  
                  {event.health_metric_id && (
                    <Typography variant="caption" color="text.secondary">
                      指标ID: {event.health_metric_id}
                      {event.metric_value && ` | 值: ${event.metric_value}`}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ))}
    </Box>
  );
};

export default HealthCalendarEvents;

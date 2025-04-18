import { authAxios } from './auth.service';

const API_URL = 'http://localhost:8000/api/health/calendar';

// 健康日历事件接口
export interface HealthCalendarEvent {
  id?: string;
  user_id?: number;
  title: string;
  start_time: string; // ISO格式的日期时间
  end_time: string; // ISO格式的日期时间
  description?: string;
  category: string; // 'medication', 'appointment', 'exercise', 'diet', 'measurement', 'other'
  color?: string;
  all_day?: boolean;
  health_metric_id?: number;
  metric_value?: number | null;
  isHealthEvent: boolean;
}

// 获取所有健康日历事件
const getAllEvents = () => {
  return authAxios.get(`${API_URL}/events`);
};

// 获取指定月份的健康日历事件
const getMonthEvents = (year: number, month: number) => {
  return authAxios.get(`${API_URL}/events/month/${year}/${month}`);
};

// 获取单个健康日历事件
const getEvent = (id: string) => {
  return authAxios.get(`${API_URL}/events/${id}`);
};

// 创建新的健康日历事件
const createEvent = (event: HealthCalendarEvent) => {
  return authAxios.post(`${API_URL}/events`, event);
};

// 更新健康日历事件
const updateEvent = (id: string, event: HealthCalendarEvent) => {
  return authAxios.put(`${API_URL}/events/${id}`, event);
};

// 删除健康日历事件
const deleteEvent = (id: string) => {
  return authAxios.delete(`${API_URL}/events/${id}`);
};

// 获取与特定健康指标相关的事件
const getEventsByMetric = (metricId: number) => {
  return authAxios.get(`${API_URL}/events/metric/${metricId}`);
};

// 按类别获取事件
const getEventsByCategory = (category: string) => {
  return authAxios.get(`${API_URL}/events/category/${category}`);
};

const HealthCalendarService = {
  getAllEvents,
  getMonthEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByMetric,
  getEventsByCategory
};

export default HealthCalendarService;
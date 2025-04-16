import { authAxios } from './auth.service';

const API_URL = 'http://localhost:8000/api/health-calendar';

// 健康日历事件接口
export interface HealthCalendarEvent {
  id?: string;
  userId?: string;
  title: string;
  start: Date | string;
  end: Date | string;
  description?: string;
  category: 'medication' | 'appointment' | 'exercise' | 'diet' | 'measurement' | 'other';
  color?: string;
  allDay?: boolean;
  healthMetricId?: string;
  metricValue?: number | null;
  recurrence?: {
    frequency: 'none' | 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate: Date | null;
  };
  reminders?: {
    time: number;
    type: 'notification' | 'email' | 'sms';
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

// 获取所有健康日历事件
const getAllEvents = () => {
  return authAxios.get(`${API_URL}`);
};

// 获取指定月份的健康日历事件
const getMonthEvents = (year: number, month: number) => {
  return authAxios.get(`${API_URL}/month/${year}/${month}`);
};

// 获取单个健康日历事件
const getEvent = (id: string) => {
  return authAxios.get(`${API_URL}/${id}`);
};

// 创建新的健康日历事件
const createEvent = (event: HealthCalendarEvent) => {
  return authAxios.post(`${API_URL}`, event);
};

// 更新健康日历事件
const updateEvent = (id: string, event: HealthCalendarEvent) => {
  return authAxios.put(`${API_URL}/${id}`, event);
};

// 删除健康日历事件
const deleteEvent = (id: string) => {
  return authAxios.delete(`${API_URL}/${id}`);
};

// 获取与特定健康指标相关的事件
const getEventsByMetric = (metricId: string) => {
  return authAxios.get(`${API_URL}/metric/${metricId}`);
};

// 按类别获取事件
const getEventsByCategory = (category: string) => {
  return authAxios.get(`${API_URL}/category/${category}`);
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
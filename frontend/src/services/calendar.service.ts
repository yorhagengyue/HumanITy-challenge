import { authAxios, getToken, isLoggedIn } from './auth.service';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/calendar';
const HEALTH_API_URL = 'http://localhost:8000/api/health';

// Enable offline mode for testing (matching auth.service.ts)
const OFFLINE_MODE = false;

// Mock data for offline mode
const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: 1,
    title: "Team Meeting",
    description: "Weekly team sync",
    start_time: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 10, 0).toISOString(),
    end_time: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 11, 30).toISOString(),
    all_day: false,
    category: {
      id: 1,
      name: "Work",
      color: "#2196F3"
    }
  },
  {
    id: 2,
    title: "Doctor Appointment",
    description: "Annual checkup",
    start_time: new Date(new Date().getFullYear(), new Date().getMonth(), 18, 14, 0).toISOString(),
    end_time: new Date(new Date().getFullYear(), new Date().getMonth(), 18, 15, 0).toISOString(),
    all_day: false,
    category: {
      id: 2,
      name: "Health",
      color: "#4CAF50"
    }
  },
  {
    id: 3,
    title: "Birthday Party",
    description: "Sarah's birthday celebration",
    start_time: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 18, 0).toISOString(),
    end_time: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 22, 0).toISOString(),
    all_day: false,
    category: {
      id: 3,
      name: "Personal",
      color: "#FFC107"
    }
  }
];

const MOCK_HEALTH_EVENTS: CalendarEvent[] = [
  {
    id: 101,
    title: "Blood Pressure Check",
    description: "Regular monitoring",
    start_time: new Date(new Date().getFullYear(), new Date().getMonth(), 12, 9, 0).toISOString(),
    end_time: new Date(new Date().getFullYear(), new Date().getMonth(), 12, 9, 15).toISOString(),
    all_day: false,
    is_health_event: true,
    health_metric_type: "blood_pressure",
    health_metric_value: 120,
    color: "#4CAF50",
    metric_value: 120,
    recurrence_frequency: "daily",
    recurrence_interval: 1,
    recurrence_end_date: new Date().toISOString(),
    reminder_time: 30,
    reminder_type: "email"
  },
  {
    id: 102,
    title: "Weight Measurement",
    start_time: new Date(new Date().getFullYear(), new Date().getMonth(), 20, 8, 0).toISOString(),
    end_time: new Date(new Date().getFullYear(), new Date().getMonth(), 20, 8, 5).toISOString(),
    all_day: false,
    is_health_event: true,
    health_metric_type: "weight",
    health_metric_value: 70,
    color: "#4CAF50",
    metric_value: 70,
    recurrence_frequency: "weekly",
    recurrence_interval: 1,
    recurrence_end_date: new Date().toISOString(),
    reminder_time: 30,
    reminder_type: "email"
  }
];

const MOCK_CATEGORIES: CalendarCategory[] = [
  {
    id: 1,
    name: "Work",
    color: "#2196F3"
  },
  {
    id: 2,
    name: "Health",
    color: "#4CAF50"
  },
  {
    id: 3,
    name: "Personal",
    color: "#FFC107"
  },
  {
    id: 4,
    name: "Family",
    color: "#9C27B0"
  },
  {
    id: 5,
    name: "Urgent",
    color: "#F44336"
  }
];

// Calendar Event interface
export interface CalendarEvent {
  id?: number;
  title: string;
  description?: string;
  location?: string;
  start_time: string;
  end_time: string;
  all_day: boolean;
  category_id?: number | null;
  category?: {
    id: number;
    name: string;
    color: string;
  } | string | null; 
  user_id?: number;
  reminder?: number | null;
  is_health_event?: boolean;
  health_metric_type?: string;
  health_metric_value?: number;
  health_metric_id?: number;
  
  // 添加健康日历事件特有的字段
  color?: string;
  metric_value?: number;
  recurrence_frequency?: string;
  recurrence_interval?: number;
  recurrence_end_date?: string;
  reminder_time?: number;
  reminder_type?: string;
}

// Calendar Category interface
export interface CalendarCategory {
  id: number;
  name: string;
  color: string;
}

// Helper function to simulate API delay
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 500));

// Get all events
const getAllEvents = async () => {
  console.log('Fetching all events, offline mode:', OFFLINE_MODE);
  
  if (OFFLINE_MODE) {
    await mockDelay();
    return { data: MOCK_EVENTS };
  }
  
  return authAxios.get(`${API_URL}/events`);
};

// Get events for a specific month
const getMonthEvents = async (year: number, month: number) => {
  console.log(`Fetching events for ${year}/${month}, offline mode:`, OFFLINE_MODE);
  
  if (OFFLINE_MODE) {
    await mockDelay();
    // Filter events for the specified month
    const filteredEvents = MOCK_EVENTS.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate.getFullYear() === year && eventDate.getMonth() + 1 === month;
    });
    return { data: filteredEvents };
  }
  
  return authAxios.get(`${API_URL}/events/month/${year}/${month}`);
};

// Get a single event
const getEvent = async (id: number) => {
  if (OFFLINE_MODE) {
    await mockDelay();
    const event = MOCK_EVENTS.find(e => e.id === id);
    return { data: event };
  }
  
  return authAxios.get(`${API_URL}/events/${id}`);
};

// Create a new event
const createEvent = async (event: CalendarEvent) => {
  if (OFFLINE_MODE) {
    await mockDelay();
    const newEvent = {
      ...event,
      id: Math.max(...MOCK_EVENTS.map(e => e.id || 0), 0) + 1
    };
    MOCK_EVENTS.push(newEvent);
    return { data: newEvent };
  }
  
  return authAxios.post(`${API_URL}/events`, event);
};

// Update an event
const updateEvent = async (id: number, event: CalendarEvent) => {
  if (OFFLINE_MODE) {
    await mockDelay();
    const index = MOCK_EVENTS.findIndex(e => e.id === id);
    if (index >= 0) {
      MOCK_EVENTS[index] = { ...event, id };
      return { data: MOCK_EVENTS[index] };
    }
    throw new Error("Event not found");
  }
  
  return authAxios.put(`${API_URL}/events/${id}`, event);
};

// Delete an event
const deleteEvent = async (id: number) => {
  if (OFFLINE_MODE) {
    await mockDelay();
    const index = MOCK_EVENTS.findIndex(e => e.id === id);
    if (index >= 0) {
      MOCK_EVENTS.splice(index, 1);
      return { data: { message: "Event deleted successfully" } };
    }
    throw new Error("Event not found");
  }
  
  return authAxios.delete(`${API_URL}/events/${id}`);
};

// Get all health events
const getAllHealthEvents = async () => {
  if (OFFLINE_MODE) {
    await mockDelay();
    return { data: MOCK_HEALTH_EVENTS };
  }
  
  try {
    return await authAxios.get(`${HEALTH_API_URL}/calendar/events`);
  } catch (error) {
    console.error('Error fetching health events:', error);
    return { data: [] };
  }
};

// Get health events for a specific month
const getHealthEvents = async (year: number, month: number) => {
  try {
    console.log(`调用getHealthEvents: 获取${year}年${month}月的健康事件`);
    const response = await authAxios.get(`${HEALTH_API_URL}/calendar/events/month/${year}/${month}`);
    console.log('健康事件API响应:', response);
    return response;
  } catch (error) {
    console.error('获取健康事件出错:', error);
    return { data: [] };
  }
};

// Get a single health event
const getHealthEvent = async (id: number) => {
  if (OFFLINE_MODE) {
    await mockDelay();
    const event = MOCK_HEALTH_EVENTS.find(e => e.id === id);
    return { data: event };
  }
  
  return authAxios.get(`${HEALTH_API_URL}/calendar/events/${id}`);
};

// Create a new health event
const createHealthEvent = async (event: CalendarEvent) => {
  if (OFFLINE_MODE) {
    await mockDelay();
    const newEvent = {
      ...event,
      id: Math.max(...MOCK_HEALTH_EVENTS.map(e => e.id || 0), 0) + 1,
      is_health_event: true
    };
    MOCK_HEALTH_EVENTS.push(newEvent);
    return { data: newEvent };
  }
  
  return authAxios.post(`${HEALTH_API_URL}/calendar/events`, event);
};

// Update a health event
const updateHealthEvent = async (id: number, event: CalendarEvent) => {
  if (OFFLINE_MODE) {
    await mockDelay();
    const index = MOCK_HEALTH_EVENTS.findIndex(e => e.id === id);
    if (index >= 0) {
      MOCK_HEALTH_EVENTS[index] = { ...event, id, is_health_event: true };
      return { data: MOCK_HEALTH_EVENTS[index] };
    }
    throw new Error("Health event not found");
  }
  
  return authAxios.put(`${HEALTH_API_URL}/calendar/events/${id}`, event);
};

// Delete a health event
const deleteHealthEvent = async (id: number) => {
  if (OFFLINE_MODE) {
    await mockDelay();
    const index = MOCK_HEALTH_EVENTS.findIndex(e => e.id === id);
    if (index >= 0) {
      MOCK_HEALTH_EVENTS.splice(index, 1);
      return { data: {} };
    }
    throw new Error("Health event not found");
  }
  
  return authAxios.delete(`${HEALTH_API_URL}/calendar/events/${id}`);
};

// Get all categories
const getAllCategories = async () => {
  console.log('Fetching all categories, offline mode:', OFFLINE_MODE);
  
  if (OFFLINE_MODE) {
    await mockDelay();
    return { data: MOCK_CATEGORIES };
  }
  
  return authAxios.get(`${API_URL}/categories`);
};

// Create a new category
const createCategory = async (category: { name: string; color: string }) => {
  if (OFFLINE_MODE) {
    await mockDelay();
    const newCategory = {
      ...category,
      id: Math.max(...MOCK_CATEGORIES.map(c => c.id), 0) + 1
    };
    MOCK_CATEGORIES.push(newCategory);
    return { data: newCategory };
  }
  
  return authAxios.post(`${API_URL}/categories`, category);
};

// Update a category
const updateCategory = async (id: number, category: { name: string; color: string }) => {
  if (OFFLINE_MODE) {
    await mockDelay();
    const index = MOCK_CATEGORIES.findIndex(c => c.id === id);
    if (index >= 0) {
      MOCK_CATEGORIES[index] = { ...category, id };
      return { data: MOCK_CATEGORIES[index] };
    }
    throw new Error("Category not found");
  }
  
  return authAxios.put(`${API_URL}/categories/${id}`, category);
};

// Delete a category
const deleteCategory = async (id: number) => {
  if (OFFLINE_MODE) {
    await mockDelay();
    const index = MOCK_CATEGORIES.findIndex(c => c.id === id);
    if (index >= 0) {
      MOCK_CATEGORIES.splice(index, 1);
      return { data: { message: "Category deleted successfully" } };
    }
    throw new Error("Category not found");
  }
  
  return authAxios.delete(`${API_URL}/categories/${id}`);
};

const CalendarService = {
  getAllEvents,
  getMonthEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getAllHealthEvents,
  getHealthEvents,
  getHealthEvent,
  createHealthEvent,
  updateHealthEvent,
  deleteHealthEvent,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};

export default CalendarService; 
import axios from 'axios';
import { authAxios } from './auth.service';

const API_URL = 'http://localhost:8000/api/health';

export interface HealthMetric {
  id: string;
  type: string;
  value: number;
  unit: string;
  notes?: string;
  date: string;
}

export interface HealthSummary {
  weekly: {
    [key: string]: {
      count: number;
      average: number;
      unit: string;
    }
  };
  monthly: {
    [key: string]: {
      count: number;
      average: number;
      unit: string;
    }
  };
  latest: {
    [key: string]: {
      value: number;
      unit: string;
      date: string;
    }
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Get health summary
export const getHealthSummary = async (): Promise<HealthSummary> => {
  try {
    const response = await authAxios.get(`${API_URL}/summary`);
    return response.data;
  } catch (error) {
    console.error('Error getting health summary:', error);
    throw error;
  }
};

// Get all health metrics with optional filters
export const getAllHealthMetrics = async (
  page = 1,
  limit = 20,
  type?: string,
  startDate?: string,
  endDate?: string
): Promise<PaginatedResponse<HealthMetric>> => {
  try {
    let url = `${API_URL}?page=${page}&limit=${limit}`;
    
    if (type) {
      url += `&type=${type}`;
    }
    
    if (startDate) {
      url += `&startDate=${startDate}`;
    }
    
    if (endDate) {
      url += `&endDate=${endDate}`;
    }
    
    const response = await authAxios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error getting health metrics:', error);
    throw error;
  }
};

// Get health metrics by type
export const getHealthMetricsByType = async (
  type: string,
  page = 1,
  limit = 20,
  startDate?: string,
  endDate?: string
): Promise<PaginatedResponse<HealthMetric>> => {
  try {
    let url = `${API_URL}/${type}?page=${page}&limit=${limit}`;
    
    if (startDate) {
      url += `&startDate=${startDate}`;
    }
    
    if (endDate) {
      url += `&endDate=${endDate}`;
    }
    
    const response = await authAxios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error getting ${type} metrics:`, error);
    throw error;
  }
};

// Get a single health metric by ID
export const getHealthMetricById = async (id: string): Promise<HealthMetric> => {
  try {
    const response = await authAxios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting health metric:', error);
    throw error;
  }
};

// Create a new health metric
export const createHealthMetric = async (
  type: string,
  value: number,
  unit: string,
  notes?: string,
  date?: Date
): Promise<HealthMetric> => {
  try {
    const response = await authAxios.post(API_URL, {
      type,
      value,
      unit,
      notes,
      date: date || new Date()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating health metric:', error);
    throw error;
  }
};

// Update a health metric
export const updateHealthMetric = async (
  id: string,
  updates: Partial<HealthMetric>
): Promise<HealthMetric> => {
  try {
    const response = await authAxios.put(`${API_URL}/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating health metric:', error);
    throw error;
  }
};

// Delete a health metric
export const deleteHealthMetric = async (id: string): Promise<void> => {
  try {
    await authAxios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting health metric:', error);
    throw error;
  }
};

// Get valid health metric types
export const getHealthMetricTypes = (): string[] => {
  return [
    'weight',
    'height',
    'bloodPressure',
    'heartRate',
    'bloodSugar',
    'sleep',
    'exercise',
    'water',
    'diet',
    'medication',
    'other'
  ];
};

// Get unit for a specific health metric type
export const getUnitForMetricType = (type: string): string => {
  const unitMap: Record<string, string> = {
    weight: 'kg',
    height: 'cm',
    bloodPressure: 'mmHg',
    heartRate: 'bpm',
    bloodSugar: 'mg/dL',
    sleep: 'hours',
    exercise: 'minutes',
    water: 'ml',
    diet: 'calories',
    medication: 'dose',
    other: 'unit'
  };
  
  return unitMap[type] || '';
}; 
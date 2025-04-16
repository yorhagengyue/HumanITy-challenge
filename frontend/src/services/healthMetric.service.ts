import { authAxios } from './auth.service';

const API_URL = 'http://localhost:8000/api/health-metrics';

// 健康指标接口
export interface HealthMetric {
  id?: string;
  userId?: string;
  type: string;
  value: number;
  unit?: string;
  date: Date | string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 健康指标统计接口
export interface HealthMetricStats {
  average: number | null;
  min: number | null;
  max: number | null;
  count: number;
  trend: number | null; // 百分比变化
  data: {
    date: Date;
    value: number;
    notes?: string;
  }[];
}

// 获取所有健康指标
const getAllMetrics = () => {
  return authAxios.get(`${API_URL}`);
};

// 按类型获取健康指标
const getMetricsByType = (type: string) => {
  return authAxios.get(`${API_URL}/type/${type}`);
};

// 按日期范围获取健康指标
const getMetricsByDateRange = (startDate: string, endDate: string, type?: string) => {
  let url = `${API_URL}/date-range?startDate=${startDate}&endDate=${endDate}`;
  
  if (type) {
    url += `&type=${type}`;
  }
  
  return authAxios.get(url);
};

// 获取单个健康指标
const getMetric = (id: string) => {
  return authAxios.get(`${API_URL}/${id}`);
};

// 创建新的健康指标
const createMetric = (metric: HealthMetric) => {
  return authAxios.post(`${API_URL}`, metric);
};

// 更新健康指标
const updateMetric = (id: string, metric: HealthMetric) => {
  return authAxios.put(`${API_URL}/${id}`, metric);
};

// 删除健康指标
const deleteMetric = (id: string) => {
  return authAxios.delete(`${API_URL}/${id}`);
};

// 获取健康指标统计信息
const getMetricStats = (type: string, startDate?: string, endDate?: string) => {
  let url = `${API_URL}/stats/${type}`;
  
  if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  }
  
  return authAxios.get(url);
};

const HealthMetricService = {
  getAllMetrics,
  getMetricsByType,
  getMetricsByDateRange,
  getMetric,
  createMetric,
  updateMetric,
  deleteMetric,
  getMetricStats
};

export default HealthMetricService; 
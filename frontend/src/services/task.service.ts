import api from './api';

// 任务类型接口
export interface Task {
  id?: number;
  title: string;
  description?: string;
  due_date?: Date | string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'completed' | 'canceled';
  category_id?: number;
  category?: {
    id: number;
    name: string;
    color: string;
    icon: string;
  };
  created_at?: Date | string;
  updated_at?: Date | string;
}

// 任务过滤器接口
export interface TaskFilter {
  status?: string;
  category_id?: number;
  priority?: string;
  from_date?: string;
  to_date?: string;
  search?: string;
}

// 获取所有任务
export const getAllTasks = async (filters?: TaskFilter) => {
  return api.get('/tasks', { params: filters })
    .then(response => response.data);
};

// 获取单个任务
export const getTask = async (id: number) => {
  return api.get(`/tasks/${id}`)
    .then(response => response.data);
};

// 创建任务
export const createTask = async (task: Task) => {
  return api.post('/tasks', task)
    .then(response => response.data);
};

// 更新任务
export const updateTask = async (id: number, task: Partial<Task>) => {
  return api.put(`/tasks/${id}`, task)
    .then(response => response.data);
};

// 删除任务
export const deleteTask = async (id: number) => {
  return api.delete(`/tasks/${id}`)
    .then(response => response.data);
};

// 获取任务统计
export const getTaskStats = async () => {
  return api.get('/tasks/stats')
    .then(response => response.data);
}; 
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  useTheme,
  CircularProgress,
  SelectChangeEvent,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PlayCircleFilled as InProgressIcon,
  Alarm as AlarmIcon
} from '@mui/icons-material';
import { Task, TaskFilter, getAllTasks, createTask, updateTask, deleteTask } from '../services/task.service';
import { format } from 'date-fns';

const Tasks: React.FC = () => {
  const theme = useTheme();
  
  // 状态
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [filters, setFilters] = useState<TaskFilter>({});
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // 新建/编辑任务表单状态
  const [formValues, setFormValues] = useState<Task>({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    status: 'pending'
  });
  
  // 获取任务列表
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getAllTasks(filters);
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('获取任务列表失败，请稍后再试。');
    } finally {
      setLoading(false);
    }
  };
  
  // 初始加载
  useEffect(() => {
    fetchTasks();
  }, []);
  
  // 过滤器变化时重新获取任务
  useEffect(() => {
    fetchTasks();
  }, [filters]);
  
  // 处理文本输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };
  
  // 处理选择框变化（表单）
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };
  
  // 处理过滤器文本输入变化
  const handleFilterInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  // 处理过滤器选择框变化
  const handleFilterSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value === 'all' ? undefined : value
    });
  };
  
  // 打开创建任务对话框
  const handleOpenCreateDialog = () => {
    setFormValues({
      title: '',
      description: '',
      due_date: '',
      priority: 'medium',
      status: 'pending'
    });
    setDialogMode('create');
    setOpenDialog(true);
  };
  
  // 打开编辑任务对话框
  const handleOpenEditDialog = (task: Task) => {
    setCurrentTask(task);
    setFormValues({
      ...task,
      due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''
    });
    setDialogMode('edit');
    setOpenDialog(true);
  };
  
  // 处理对话框关闭
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTask(null);
  };
  
  // 提交表单
  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        await createTask(formValues);
        setSnackbar({
          open: true,
          message: '任务创建成功！',
          severity: 'success'
        });
      } else if (dialogMode === 'edit' && currentTask?.id) {
        await updateTask(currentTask.id, formValues);
        setSnackbar({
          open: true,
          message: '任务更新成功！',
          severity: 'success'
        });
      }
      handleCloseDialog();
      fetchTasks(); // 刷新任务列表
    } catch (err) {
      console.error('Error saving task:', err);
      setSnackbar({
        open: true,
        message: dialogMode === 'create' ? '创建任务失败' : '更新任务失败',
        severity: 'error'
      });
    }
  };
  
  // 删除任务
  const handleDeleteTask = async (id: number) => {
    if (window.confirm('确认删除该任务？')) {
      try {
        await deleteTask(id);
        setSnackbar({
          open: true,
          message: '任务删除成功！',
          severity: 'success'
        });
        fetchTasks(); // 刷新任务列表
      } catch (err) {
        console.error('Error deleting task:', err);
        setSnackbar({
          open: true,
          message: '删除任务失败',
          severity: 'error'
        });
      }
    }
  };
  
  // 更新任务状态
  const handleUpdateStatus = async (task: Task, newStatus: 'pending' | 'in_progress' | 'completed' | 'canceled') => {
    if (task.id) {
      try {
        await updateTask(task.id, { status: newStatus });
        setSnackbar({
          open: true,
          message: '任务状态更新成功！',
          severity: 'success'
        });
        fetchTasks(); // 刷新任务列表
      } catch (err) {
        console.error('Error updating task status:', err);
        setSnackbar({
          open: true,
          message: '更新任务状态失败',
          severity: 'error'
        });
      }
    }
  };
  
  // 清除过滤器
  const handleClearFilters = () => {
    setFilters({});
    setOpenFilter(false);
  };
  
  // 渲染任务状态标签
  const renderStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip label="待处理" size="small" color="warning" icon={<AlarmIcon />} />;
      case 'in_progress':
        return <Chip label="进行中" size="small" color="info" icon={<InProgressIcon />} />;
      case 'completed':
        return <Chip label="已完成" size="small" color="success" icon={<CheckCircleIcon />} />;
      case 'canceled':
        return <Chip label="已取消" size="small" color="error" icon={<CancelIcon />} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };
  
  // 渲染优先级标签
  const renderPriorityChip = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Chip label="高" size="small" sx={{ bgcolor: theme.palette.error.light, color: theme.palette.error.contrastText }} />;
      case 'medium':
        return <Chip label="中" size="small" sx={{ bgcolor: theme.palette.warning.light, color: theme.palette.warning.contrastText }} />;
      case 'low':
        return <Chip label="低" size="small" sx={{ bgcolor: theme.palette.success.light, color: theme.palette.success.contrastText }} />;
      default:
        return <Chip label={priority} size="small" />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          任务管理
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<FilterListIcon />}
            onClick={() => setOpenFilter(!openFilter)}
            sx={{ mr: 1 }}
          >
            筛选
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleOpenCreateDialog}
          >
            新建任务
          </Button>
        </Box>
      </Box>
      
      {/* 过滤器面板 */}
      {openFilter && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>状态</InputLabel>
              <Select
                name="status"
                value={filters.status || 'all'}
                label="状态"
                onChange={handleFilterSelectChange}
                size="small"
              >
                <MenuItem value="all">全部</MenuItem>
                <MenuItem value="pending">待处理</MenuItem>
                <MenuItem value="in_progress">进行中</MenuItem>
                <MenuItem value="completed">已完成</MenuItem>
                <MenuItem value="canceled">已取消</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>优先级</InputLabel>
              <Select
                name="priority"
                value={filters.priority || 'all'}
                label="优先级"
                onChange={handleFilterSelectChange}
                size="small"
              >
                <MenuItem value="all">全部</MenuItem>
                <MenuItem value="high">高</MenuItem>
                <MenuItem value="medium">中</MenuItem>
                <MenuItem value="low">低</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              name="search"
              label="搜索"
              value={filters.search || ''}
              onChange={handleFilterInputChange}
              size="small"
              InputProps={{
                endAdornment: <SearchIcon />
              }}
            />
            
            <Button variant="outlined" onClick={handleClearFilters}>
              清除筛选
            </Button>
          </Box>
        </Paper>
      )}
      
      {/* 任务列表 */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      ) : tasks.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">还没有任务，立即创建一个吧！</Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleOpenCreateDialog}
            sx={{ mt: 2 }}
          >
            新建任务
          </Button>
        </Paper>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
          {tasks.map((task) => (
            <Card key={task.id} sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderLeft: `4px solid ${
                task.status === 'completed' ? theme.palette.success.main :
                task.status === 'canceled' ? theme.palette.error.main :
                task.priority === 'high' ? theme.palette.error.main :
                task.priority === 'medium' ? theme.palette.warning.main :
                theme.palette.info.main
              }`
            }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" component="div" sx={{ 
                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                    color: task.status === 'completed' ? 'text.secondary' : 'text.primary',
                  }}>
                    {task.title}
                  </Typography>
                  <Box>
                    {renderPriorityChip(task.priority || 'medium')}
                  </Box>
                </Box>
                
                {task.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {task.description}
                  </Typography>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  {renderStatusChip(task.status || 'pending')}
                  
                  {task.due_date && (
                    <Typography variant="caption" sx={{ 
                      color: new Date(task.due_date) < new Date() && task.status !== 'completed' ? 'error.main' : 'text.secondary'
                    }}>
                      截止: {format(new Date(task.due_date), 'yyyy-MM-dd')}
                    </Typography>
                  )}
                </Box>
              </CardContent>
              
              <CardActions>
                {task.status !== 'completed' && task.status !== 'canceled' && (
                  <IconButton 
                    size="small" 
                    onClick={() => handleUpdateStatus(task, 'completed')}
                    title="标记为已完成"
                  >
                    <CheckCircleIcon color="success" />
                  </IconButton>
                )}
                
                <IconButton 
                  size="small" 
                  onClick={() => handleOpenEditDialog(task)}
                  title="编辑任务"
                >
                  <EditIcon />
                </IconButton>
                
                <IconButton 
                  size="small" 
                  onClick={() => task.id ? handleDeleteTask(task.id) : undefined}
                  title="删除任务"
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
      
      {/* 任务表单对话框 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? '创建新任务' : '编辑任务'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="任务标题"
            type="text"
            fullWidth
            variant="outlined"
            value={formValues.title}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="description"
            label="任务描述"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formValues.description || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="due_date"
            label="截止日期"
            type="date"
            fullWidth
            variant="outlined"
            value={formValues.due_date || ''}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>优先级</InputLabel>
            <Select
              name="priority"
              value={formValues.priority || 'medium'}
              label="优先级"
              onChange={handleSelectChange}
            >
              <MenuItem value="high">高</MenuItem>
              <MenuItem value="medium">中</MenuItem>
              <MenuItem value="low">低</MenuItem>
            </Select>
          </FormControl>
          
          {dialogMode === 'edit' && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>状态</InputLabel>
              <Select
                name="status"
                value={formValues.status || 'pending'}
                label="状态"
                onChange={handleSelectChange}
              >
                <MenuItem value="pending">待处理</MenuItem>
                <MenuItem value="in_progress">进行中</MenuItem>
                <MenuItem value="completed">已完成</MenuItem>
                <MenuItem value="canceled">已取消</MenuItem>
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>取消</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formValues.title}>
            {dialogMode === 'create' ? '创建' : '保存'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 提示消息 */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Tasks; 
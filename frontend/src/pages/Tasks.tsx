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
  
  // States
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
  
  // Form states for creating/editing tasks
  const [formValues, setFormValues] = useState<Task>({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    status: 'pending'
  });
  
  // Fetch task list
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getAllTasks(filters);
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch task list. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Initial loading
  useEffect(() => {
    fetchTasks();
  }, []);
  
  // Refetch tasks when filters change
  useEffect(() => {
    fetchTasks();
  }, [filters]);
  
  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };
  
  // Handle select field changes (form)
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };
  
  // Handle filter text input changes
  const handleFilterInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  // Handle filter select changes
  const handleFilterSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value === 'all' ? undefined : value
    });
  };
  
  // Open create task dialog
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
  
  // Open edit task dialog
  const handleOpenEditDialog = (task: Task) => {
    setCurrentTask(task);
    setFormValues({
      ...task,
      due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''
    });
    setDialogMode('edit');
    setOpenDialog(true);
  };
  
  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTask(null);
  };
  
  // Submit form
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
  
  // Delete task
  const handleDeleteTask = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        setSnackbar({
          open: true,
          message: 'Task deleted successfully!',
          severity: 'success'
        });
        fetchTasks(); // 刷新任务列表
      } catch (err) {
        console.error('Error deleting task:', err);
        setSnackbar({
          open: true,
          message: 'Failed to delete task',
          severity: 'error'
        });
      }
    }
  };
  
  // Update task status
  const handleUpdateStatus = async (task: Task, newStatus: 'pending' | 'in_progress' | 'completed' | 'canceled') => {
    if (task.id) {
      try {
        await updateTask(task.id, { status: newStatus });
        setSnackbar({
          open: true,
          message: 'Task status updated successfully!',
          severity: 'success'
        });
        fetchTasks(); // 刷新任务列表
      } catch (err) {
        console.error('Error updating task status:', err);
        setSnackbar({
          open: true,
          message: 'Failed to update task status',
          severity: 'error'
        });
      }
    }
  };
  
  // Clear filters
  const handleClearFilters = () => {
    setFilters({});
    setOpenFilter(false);
  };
  
  // Render status chip
  const renderStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip label="Pending" size="small" color="warning" icon={<AlarmIcon />} />;
      case 'in_progress':
        return <Chip label="In Progress" size="small" color="info" icon={<InProgressIcon />} />;
      case 'completed':
        return <Chip label="Completed" size="small" color="success" icon={<CheckCircleIcon />} />;
      case 'canceled':
        return <Chip label="Canceled" size="small" color="error" icon={<CancelIcon />} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };
  
  // Render priority chip
  const renderPriorityChip = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Chip label="High" size="small" sx={{ bgcolor: theme.palette.error.light, color: theme.palette.error.contrastText }} />;
      case 'medium':
        return <Chip label="Medium" size="small" sx={{ bgcolor: theme.palette.warning.light, color: theme.palette.warning.contrastText }} />;
      case 'low':
        return <Chip label="Low" size="small" sx={{ bgcolor: theme.palette.success.light, color: theme.palette.success.contrastText }} />;
      default:
        return <Chip label={priority} size="small" />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Task Management
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<FilterListIcon />}
            onClick={() => setOpenFilter(!openFilter)}
            sx={{ mr: 1 }}
          >
            Filter
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
      
      {/* Task form dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Create New Task' : 'Edit Task'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Task Title"
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
            label="Task Description"
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
            label="Due Date"
            type="date"
            fullWidth
            variant="outlined"
            value={formValues.due_date || ''}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={formValues.priority || 'medium'}
              label="Priority"
              onChange={handleSelectChange}
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
          
          {dialogMode === 'edit' && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formValues.status || 'pending'}
                label="Status"
                onChange={handleSelectChange}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="canceled">Canceled</MenuItem>
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formValues.title}>
            {dialogMode === 'create' ? 'Create' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification messages */}
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
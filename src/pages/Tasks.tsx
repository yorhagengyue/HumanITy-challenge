import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  IconButton,
  Checkbox,
  Divider,
  Chip,
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: string | null;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Complete Math homework', completed: false, priority: 'high', dueDate: '2023-04-15' },
    { id: 2, title: 'Study for Physics exam', completed: false, priority: 'high', dueDate: '2023-04-20' },
    { id: 3, title: 'Read chapter 5 of Literature book', completed: true, priority: 'medium', dueDate: '2023-04-10' },
    { id: 4, title: 'Prepare presentation slides', completed: false, priority: 'medium', dueDate: '2023-04-18' },
    { id: 5, title: 'Join study group meeting', completed: false, priority: 'low', dueDate: '2023-04-25' },
  ]);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleAddTask = () => {
    if (newTaskTitle.trim() !== '') {
      const newTask: Task = {
        id: Date.now(),
        title: newTaskTitle,
        completed: false,
        priority: 'medium',
        dueDate: null,
      };
      
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  };
  
  const handleToggleComplete = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };
  
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tasks
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Manage your daily tasks and track your progress
        </Typography>
      </Box>
      
      <Paper elevation={1} sx={{ p: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddTask}
                    disabled={newTaskTitle.trim() === ''}
                  >
                    Add
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Chip 
              label="All" 
              onClick={() => setFilter('all')} 
              color={filter === 'all' ? 'primary' : 'default'}
              sx={{ mr: 1 }}
            />
            <Chip 
              label="Active" 
              onClick={() => setFilter('active')} 
              color={filter === 'active' ? 'primary' : 'default'}
              sx={{ mr: 1 }}
            />
            <Chip 
              label="Completed" 
              onClick={() => setFilter('completed')} 
              color={filter === 'completed' ? 'primary' : 'default'}
            />
          </Box>
          
          <TextField
            size="small"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Paper>
      
      <Paper elevation={1}>
        <List>
          {filteredTasks.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No tasks found"
                secondary="Add a new task or change your filters"
                primaryTypographyProps={{ align: 'center' }}
                secondaryTypographyProps={{ align: 'center' }}
              />
            </ListItem>
          ) : (
            filteredTasks.map((task, index) => (
              <React.Fragment key={task.id}>
                {index > 0 && <Divider />}
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(task.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton onClick={() => handleToggleComplete(task.id)} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={task.completed}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      secondary={task.dueDate ? `Due: ${task.dueDate}` : 'No due date'}
                      sx={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'text.disabled' : 'text.primary',
                      }}
                    />
                    <Chip
                      size="small"
                      label={task.priority}
                      color={
                        task.priority === 'high'
                          ? 'error'
                          : task.priority === 'medium'
                          ? 'warning'
                          : 'success'
                      }
                      sx={{ ml: 1 }}
                    />
                  </ListItemButton>
                </ListItem>
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default Tasks; 
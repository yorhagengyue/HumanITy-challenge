import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  alpha,
  useTheme
} from '@mui/material';
import { HexColorPicker } from 'react-colorful';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarService, { CalendarCategory } from '../services/calendar.service';
import { useNavigate } from 'react-router-dom';

const CalendarCategories: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CalendarCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CalendarCategory | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#2196F3'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await CalendarService.getAllCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorChange = (color: string) => {
    setNewCategory(prev => ({
      ...prev,
      color
    }));
  };

  const handleAddCategory = async () => {
    if (!newCategory.name) {
      setSnackbar({
        open: true,
        message: 'Please enter a category name',
        severity: 'error'
      });
      return;
    }

    try {
      if (selectedCategory && selectedCategory.id) {
        await CalendarService.updateCategory(selectedCategory.id, newCategory);
        setSnackbar({
          open: true,
          message: 'Category updated successfully',
          severity: 'success'
        });
      } else {
        await CalendarService.createCategory(newCategory);
        setSnackbar({
          open: true,
          message: 'Category created successfully',
          severity: 'success'
        });
      }
      
      // Refresh categories
      fetchCategories();
      handleDialogClose();
    } catch (err) {
      console.error('Error saving category:', err);
      setSnackbar({
        open: true,
        message: 'Failed to save category. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleEditCategory = (category: CalendarCategory) => {
    setSelectedCategory(category);
    setNewCategory({
      name: category.name,
      color: category.color
    });
    setDialogOpen(true);
  };

  const handleDeleteCategory = (category: CalendarCategory) => {
    setSelectedCategory(category);
    setConfirmDeleteOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!selectedCategory || !selectedCategory.id) return;
    
    try {
      await CalendarService.deleteCategory(selectedCategory.id);
      
      setSnackbar({
        open: true,
        message: 'Category deleted successfully',
        severity: 'success'
      });
      
      // Refresh categories
      fetchCategories();
      setConfirmDeleteOpen(false);
    } catch (err: any) {
      console.error('Error deleting category:', err);
      // Check if error is due to category being in use
      const errorMessage = err.response?.data?.message || 'Failed to delete category. Please try again.';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  const handleDialogOpen = () => {
    setSelectedCategory(null);
    setNewCategory({
      name: '',
      color: '#2196F3'
    });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar({...snackbar, open: false});
  };

  const handleBackToCalendar = () => {
    navigate('/calendar');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Calendar Categories
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Manage your calendar event categories
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          onClick={handleBackToCalendar}
        >
          Back to Calendar
        </Button>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleDialogOpen}
        >
          Add Category
        </Button>
      </Box>

      <Paper 
        sx={{ 
          p: 2, 
          borderRadius: 2,
          position: 'relative',
          minHeight: 200
        }}
      >
        {loading && (
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: alpha(theme.palette.background.paper, 0.7),
            zIndex: 10
          }}>
            <CircularProgress />
          </Box>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {categories.length === 0 && !loading ? (
          <Box sx={{ py: 5, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No categories found. Create a category to get started.
            </Typography>
          </Box>
        ) : (
          <List>
            {categories.map((category) => (
              <ListItem
                key={category.id}
                sx={{
                  mb: 1,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  borderRadius: 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: `0 2px 8px -2px ${alpha(theme.palette.primary.main, 0.1)}`,
                    bgcolor: alpha(theme.palette.background.default, 0.5)
                  }
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: category.color,
                    mr: 2
                  }}
                />
                <ListItemText primary={category.name} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditCategory(category)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Add/Edit Category Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Category Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newCategory.name}
            onChange={handleNewCategoryChange}
            sx={{ mb: 3 }}
          />
          <Typography variant="subtitle2" gutterBottom>
            Category Color
          </Typography>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <HexColorPicker color={newCategory.color} onChange={handleColorChange} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                bgcolor: newCategory.color,
                mr: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.3)}`
              }}
            />
            <TextField
              margin="dense"
              name="color"
              label="Color Code"
              type="text"
              variant="outlined"
              value={newCategory.color}
              onChange={handleNewCategoryChange}
              sx={{ width: 150 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAddCategory} variant="contained">
            {selectedCategory ? 'Save Changes' : 'Add Category'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the category "{selectedCategory?.name}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteCategory} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CalendarCategories; 
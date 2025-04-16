import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  FormHelperText,
  Stack,
  Alert,
  Snackbar,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { HealthMetric, createHealthMetric, updateHealthMetric, getHealthMetricTypes, getUnitForMetricType } from '../services/health.service';

interface HealthMetricsFormProps {
  initialMetric?: HealthMetric;
  onSuccess?: (metric: HealthMetric) => void;
  onCancel?: () => void;
}

const HealthMetricsForm: React.FC<HealthMetricsFormProps> = ({
  initialMetric,
  onSuccess,
  onCancel,
}) => {
  const isEditing = !!initialMetric;
  const metricTypes = getHealthMetricTypes();
  
  const [formData, setFormData] = useState({
    type: initialMetric?.type || '',
    value: initialMetric?.value || '',
    unit: initialMetric?.unit || '',
    notes: initialMetric?.notes || '',
    date: initialMetric?.date ? new Date(initialMetric.date) : new Date(),
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    if (formData.type && formData.type !== initialMetric?.type) {
      setFormData((prev) => ({
        ...prev,
        unit: getUnitForMetricType(formData.type),
      }));
    }
  }, [formData.type, initialMetric?.type]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.type) {
      newErrors.type = 'Metric type is required';
    }
    
    if (!formData.value) {
      newErrors.value = 'Value is required';
    } else if (isNaN(Number(formData.value))) {
      newErrors.value = 'Value must be a number';
    }
    
    if (!formData.unit) {
      newErrors.unit = 'Unit is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleDateChange = (newDate: Date | null) => {
    setFormData({
      ...formData,
      date: newDate || new Date(),
    });
    
    if (errors.date) {
      setErrors({
        ...errors,
        date: '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let result;
      
      if (isEditing && initialMetric?.id) {
        result = await updateHealthMetric(initialMetric.id, {
          type: formData.type,
          value: Number(formData.value),
          unit: formData.unit,
          notes: formData.notes,
          date: formData.date.toISOString(),
        });
      } else {
        result = await createHealthMetric(
          formData.type,
          Number(formData.value),
          formData.unit,
          formData.notes,
          formData.date
        );
      }
      
      setNotification({
        open: true,
        message: `Health metric ${isEditing ? 'updated' : 'created'} successfully!`,
        severity: 'success',
      });
      
      if (onSuccess) {
        onSuccess(result);
      }
      
    } catch (error) {
      console.error('Error saving health metric:', error);
      setNotification({
        open: true,
        message: `Failed to ${isEditing ? 'update' : 'create'} health metric. Please try again.`,
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {isEditing ? 'Edit Health Metric' : 'Add New Health Metric'}
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <FormControl fullWidth error={!!errors.type}>
            <InputLabel id="metric-type-label">Metric Type</InputLabel>
            <Select
              labelId="metric-type-label"
              name="type"
              value={formData.type}
              onChange={handleSelectChange}
              label="Metric Type"
              disabled={isEditing}
            >
              {metricTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </Select>
            {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
          </FormControl>
          
          <TextField
            name="value"
            label="Value"
            type="number"
            value={formData.value}
            onChange={handleInputChange}
            error={!!errors.value}
            helperText={errors.value}
            fullWidth
            required
          />
          
          <TextField
            name="unit"
            label="Unit"
            value={formData.unit}
            onChange={handleInputChange}
            error={!!errors.unit}
            helperText={errors.unit}
            fullWidth
            required
            disabled={formData.type !== ''}
          />
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Date and Time"
              value={formData.date}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.date,
                  helperText: errors.date,
                },
              }}
            />
          </LocalizationProvider>
          
          <TextField
            name="notes"
            label="Notes"
            value={formData.notes}
            onChange={handleInputChange}
            multiline
            rows={3}
            fullWidth
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            {onCancel && (
              <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Save'}
            </Button>
          </Box>
        </Stack>
      </form>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default HealthMetricsForm; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  Grid,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api';

function AddItem() {
  const [formData, setFormData] = useState({ name: '', quantity: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Item name must be at least 2 characters';
    } else if (formData.name.trim().length > 255) {
      newErrors.name = 'Item name must not exceed 255 characters';
    }

    if (formData.quantity === '') {
      newErrors.quantity = 'Quantity is required';
    } else if (isNaN(formData.quantity)) {
      newErrors.quantity = 'Quantity must be a number';
    } else if (parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity must be non-negative';
    } else if (!Number.isInteger(Number(formData.quantity))) {
      newErrors.quantity = 'Quantity must be a whole number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(`${API_URL}/items`, {
        name: formData.name.trim(),
        quantity: parseInt(formData.quantity)
      });

      toast.success('Item created successfully!');
      navigate('/');
    } catch (error) {
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const serverErrors = {};
        Object.keys(error.response.data.errors).forEach(key => {
          const errorMessages = error.response.data.errors[key];
          serverErrors[key] = Array.isArray(errorMessages) ? errorMessages[0] : errorMessages;
        });
        setErrors(serverErrors);
        toast.error('Please fix the validation errors');
      } else if (error.response?.status === 404) {
        toast.error('Resource not found');
      } else {
        toast.error(error.response?.data?.message || error.message || 'Failed to create item');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" mb={3}>
        Add New Item
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <form onSubmit={handleSubmit} noValidate>
              <Stack spacing={3}>
                <TextField
                  label="Item Name"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  disabled={submitting}
                  placeholder="Enter item name"
                />

                <TextField
                  label="Quantity"
                  variant="outlined"
                  fullWidth
                  required
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  error={!!errors.quantity}
                  helperText={errors.quantity}
                  disabled={submitting}
                  placeholder="Enter quantity"
                  inputProps={{ min: 0, step: 1 }}
                />

                <Stack direction="row" spacing={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<SaveIcon />}
                    disabled={submitting}
                    fullWidth
                  >
                    {submitting ? 'Creating...' : 'Create Item'}
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    size="large"
                    startIcon={<CancelIcon />}
                    onClick={() => navigate('/')}
                    disabled={submitting}
                    fullWidth
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, bgcolor: 'primary.light', color: 'white' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              📝 Instructions
            </Typography>
            <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
              <li>Item name is required and must be between 2-255 characters</li>
              <li>Quantity must be a non-negative whole number</li>
              <li>All fields are validated before submission</li>
              <li>Server-side validation will catch any additional issues</li>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AddItem;

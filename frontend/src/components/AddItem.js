import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api';

function AddItem() {
  const [formData, setFormData] = useState({ name: '', quantity: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Item name must be at least 2 characters';
    } else if (formData.name.trim().length > 255) {
      newErrors.name = 'Item name must not exceed 255 characters';
    }

    // Quantity validation
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

    // Client-side validation
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(`${API_URL}/items`, {
        name: formData.name.trim(),
        quantity: parseInt(formData.quantity)
      });

      // Redirect to inventory list on success
      navigate('/');
    } catch (error) {
      if (error.response?.status === 422 && error.response?.data?.errors) {
        // Server validation errors - convert array format to string
        const serverErrors = {};
        Object.keys(error.response.data.errors).forEach(key => {
          const errorMessages = error.response.data.errors[key];
          // Take the first error message if it's an array
          serverErrors[key] = Array.isArray(errorMessages) ? errorMessages[0] : errorMessages;
        });
        setErrors(serverErrors);
      } else if (error.response?.status === 404) {
        alert('Error: Resource not found');
      } else {
        alert('Error creating item: ' + (error.response?.data?.message || error.message));
      }
      console.error('Error creating item:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="add-item-container">
      <div className="form-card">
        <h2>Add New Item</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">
              Item Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter item name"
              className={errors.name ? 'input-error' : ''}
              disabled={submitting}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="quantity">
              Quantity <span className="required">*</span>
            </label>
            <input
              type="number"
              id="quantity"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              placeholder="Enter quantity"
              min="0"
              step="1"
              className={errors.quantity ? 'input-error' : ''}
              disabled={submitting}
            />
            {errors.quantity && <span className="error-text">{errors.quantity}</span>}
          </div>

          <div className="form-buttons">
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create Item'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-cancel"
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="help-text">
        <h3>Instructions</h3>
        <ul>
          <li>Item name is required and must be between 2-255 characters</li>
          <li>Quantity must be a non-negative whole number</li>
          <li>All fields are validated before submission</li>
        </ul>
      </div>
    </div>
  );
}

export default AddItem;

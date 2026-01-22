import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api';

function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', quantity: 0 });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/items`);
      setItems(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch items');
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }
    
    if (formData.quantity < 0) {
      alert('Quantity must be non-negative');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/items/${editingId}`, formData);
      } else {
        await axios.post(`${API_URL}/items`, formData);
      }
      setFormData({ name: '', quantity: 0 });
      setEditingId(null);
      fetchItems();
    } catch (error) {
      alert('Error saving item: ' + (error.response?.data?.message || error.message));
      console.error('Error saving item:', error);
    }
  };

  const handleEdit = (item) => {
    setFormData({ name: item.name, quantity: item.quantity });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/items/${id}`);
      fetchItems();
    } catch (error) {
      alert('Error deleting item');
      console.error('Error deleting item:', error);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', quantity: 0 });
    setEditingId(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="inventory-container">
      {error && <div className="error-message">{error}</div>}

      <div className="form-container">
        <h2>{editingId ? 'Edit Item' : 'Add New Item'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter item name"
              required
            />
          </div>
          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              min="0"
              required
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn-submit">
              {editingId ? 'Update' : 'Add'} Item
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel} className="btn-cancel">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="items-container">
        <h2>Items in Inventory ({items.length})</h2>
        {items.length === 0 ? (
          <p className="no-items">No items in inventory. Add your first item!</p>
        ) : (
          <div className="items-grid">
            {items.map((item) => (
              <div key={item.id} className="item-card">
                <h3>{item.name}</h3>
                <p className="quantity">Quantity: <strong>{item.quantity}</strong></p>
                <div className="item-actions">
                  <button onClick={() => handleEdit(item)} className="btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="btn-delete">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Inventory;

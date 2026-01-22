import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api';

function InventoryList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/items`);
      setItems(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch items');
      toast.error('Failed to load inventory items');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f44336',
      cancelButtonColor: '#667eea',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: 'rgba(255, 255, 255, 0.95)',
      backdrop: 'rgba(102, 126, 234, 0.4)'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/items/${id}`);
      toast.success('Item deleted successfully!');
      fetchItems(); // Refresh the list
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('Item not found. It may have already been deleted.');
        fetchItems(); // Refresh to sync with server
      } else if (error.response?.status === 422) {
        toast.error(error.response?.data?.message || 'Invalid request');
      } else {
        toast.error(error.response?.data?.message || error.message || 'Failed to delete item');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading inventory...</div>;
  }

  return (
    <div className="inventory-list-container">
      <div className="header-section">
        <h2>Inventory Items</h2>
        <button onClick={() => navigate('/add')} className="btn-add">
          + Add New Item
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {items.length === 0 ? (
        <div className="empty-state">
          <p>No items in inventory.</p>
          <button onClick={() => navigate('/add')} className="btn-submit">
            Add Your First Item
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="items-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>
                    <span className="quantity-badge">{item.quantity}</span>
                  </td>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn-delete-small"
                      title="Delete item"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="summary">
        <p>Total Items: <strong>{items.length}</strong></p>
        <p>Total Quantity: <strong>{items.reduce((sum, item) => sum + item.quantity, 0)}</strong></p>
      </div>
    </div>
  );
}

export default InventoryList;

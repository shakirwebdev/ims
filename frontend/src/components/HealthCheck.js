import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api';

function HealthCheck() {
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkApiConnection();
  }, []);

  const checkApiConnection = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/health`);
      setApiStatus(`Connected! ${response.data.message || 'API is running'}`);
    } catch (error) {
      setApiStatus('Not connected. Make sure the backend is running.');
      console.error('API Connection Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="health-check-container">
      <h2>System Health Check</h2>
      <div className="status-card">
        <h3>Backend API Status</h3>
        <p className={loading ? 'status-loading' : apiStatus.includes('Connected') ? 'status-success' : 'status-error'}>
          {apiStatus}
        </p>
        <button onClick={checkApiConnection} disabled={loading} className="btn-submit">
          Refresh Status
        </button>
      </div>
      <div className="info-section">
        <h3>System Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>Backend API:</strong>
            <span>http://localhost:8001/api</span>
          </div>
          <div className="info-item">
            <strong>Frontend:</strong>
            <span>http://localhost:3000</span>
          </div>
          <div className="info-item">
            <strong>Database:</strong>
            <span>MySQL on port 3307</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthCheck;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api';

function HealthCheck() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/health`);
      setHealth(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch health status');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" mb={3}>
        System Health Check
      </Typography>

      {error ? (
        <Alert
          severity="error"
          icon={<ErrorIcon />}
          sx={{ fontSize: '1.1rem', py: 2 }}
        >
          {error}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="success.main">
                    System Status: {health?.status?.toUpperCase()}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {health?.message}
                  </Typography>
                </Box>
              </Box>
              
              <Chip
                label="All Systems Operational"
                color="success"
                icon={<CheckCircleIcon />}
                sx={{ fontWeight: 'bold', fontSize: '0.9rem', py: 2.5, px: 1 }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  API Version
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {health?.version}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Timestamp
                </Typography>
                <Typography variant="h5" fontWeight="medium">
                  {health?.timestamp && new Date(health.timestamp).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3, bgcolor: 'info.light', color: 'white' }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <InfoIcon />
                <Typography variant="h6" fontWeight="bold">
                  System Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />
              <Typography variant="body1" component="ul" sx={{ pl: 2, lineHeight: 2 }}>
                <li><strong>Backend:</strong> Laravel 12 API</li>
                <li><strong>Frontend:</strong> React 18 with Material-UI</li>
                <li><strong>Database:</strong> MySQL 8.0</li>
                <li><strong>Environment:</strong> Docker Containerized</li>
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default HealthCheck;

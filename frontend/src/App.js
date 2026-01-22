import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Box, Tabs, Tab } from '@mui/material';
import { Inventory as InventoryIcon, AddBox as AddBoxIcon, MonitorHeart as HealthIcon } from '@mui/icons-material';
import InventoryList from './components/InventoryList';
import AddItem from './components/AddItem';
import HealthCheck from './components/HealthCheck';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
});

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const routes = [
    { path: '/', label: 'Inventory List', icon: <InventoryIcon /> },
    { path: '/add', label: 'Add Item', icon: <AddBoxIcon /> },
    { path: '/health', label: 'Health Check', icon: <HealthIcon /> },
  ];

  const currentTab = routes.findIndex(route => route.path === location.pathname);
  
  return (
    <Tabs
      value={currentTab !== -1 ? currentTab : 0}
      onChange={(e, newValue) => navigate(routes[newValue].path)}
      textColor="inherit"
      indicatorColor="secondary"
      centered
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      {routes.map((route, index) => (
        <Tab
          key={route.path}
          icon={route.icon}
          label={route.label}
          iconPosition="start"
        />
      ))}
    </Tabs>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
          <AppBar position="static" elevation={2}>
            <Toolbar>
              <InventoryIcon sx={{ mr: 2 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Inventory Management System
              </Typography>
            </Toolbar>
            <Navigation />
          </AppBar>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/" element={<InventoryList />} />
              <Route path="/add" element={<AddItem />} />
              <Route path="/health" element={<HealthCheck />} />
            </Routes>
          </Container>
        </Box>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;

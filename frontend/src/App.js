import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InventoryList from './components/InventoryList';
import AddItem from './components/AddItem';
import HealthCheck from './components/HealthCheck';
import './App.css';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="navigation">
      <Link 
        to="/" 
        className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
      >
        📦 Inventory List
      </Link>
      <Link 
        to="/add" 
        className={location.pathname === '/add' ? 'nav-link active' : 'nav-link'}
      >
        ➕ Add Item
      </Link>
      <Link 
        to="/health" 
        className={location.pathname === '/health' ? 'nav-link active' : 'nav-link'}
      >
        🏥 Health Check
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>📦 Inventory Management System</h1>
          <Navigation />
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<InventoryList />} />
              <Route path="/add" element={<AddItem />} />
              <Route path="/health" element={<HealthCheck />} />
            </Routes>
          </div>
        </header>
      </div>
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
  );
}

export default App;

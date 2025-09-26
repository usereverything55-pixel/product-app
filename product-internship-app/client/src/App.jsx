import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [company, setCompany] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const companyData = localStorage.getItem('company');
    
    if (token && companyData) {
      setCompany(JSON.parse(companyData));
      setCurrentView('dashboard');
    }
  }, []);

  const handleLogin = (companyData, token) => {
    setCompany(companyData);
    setCurrentView('dashboard');
    localStorage.setItem('token', token);
    localStorage.setItem('company', JSON.stringify(companyData));
  };

  const handleLogout = () => {
    setCompany(null);
    setCurrentView('login');
    localStorage.removeItem('token');
    localStorage.removeItem('company');
  };

  return (
    <div className="App">
      <div className="container">
        {currentView === 'login' && <Login onLogin={handleLogin} />}
        {currentView === 'dashboard' && company && (
          <Dashboard company={company} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import MultiStepForm from './MultiStepForm';
import ProductList from './ProductList';

const Dashboard = ({ company, onLogout }) => {
  const [currentTab, setCurrentTab] = useState('form');

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap' }}>
          <div>
            <h1>Product Submission Portal</h1>
            <p style={{ color: '#6b7280' }}>Welcome, {company.name}</p>
          </div>
          <button onClick={onLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setCurrentTab('form')}
            className={`btn ${currentTab === 'form' ? 'btn-primary' : 'btn-secondary'}`}
          >
            📝 New Product Form
          </button>
          <button 
            onClick={() => setCurrentTab('products')}
            className={`btn ${currentTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
          >
            📦 My Products ({currentTab === 'products' ? 'Viewing' : 'View'})
          </button>
        </div>

        {currentTab === 'form' && <MultiStepForm company={company} />}
        {currentTab === 'products' && <ProductList company={company} />}
      </div>
    </div>
  );
};

export default Dashboard;
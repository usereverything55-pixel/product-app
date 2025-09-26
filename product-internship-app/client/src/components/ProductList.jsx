import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = ({ company }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/products');
      setProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>Loading products...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 style={{ marginBottom: '20px' }}>My Submitted Products</h2>
      
      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          <h3>No products submitted yet</h3>
          <p>Go to the "New Product Form" tab to submit your first product!</p>
        </div>
      ) : (
        <div>
          <p style={{ marginBottom: '20px', color: '#6b7280' }}>
            Total products: <strong>{products.length}</strong>
          </p>
          
          <div style={{ display: 'grid', gap: '20px' }}>
            {products.map((product) => (
              <div key={product.id} style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                padding: '20px',
                background: '#f9fafb'
              }}>
                <h3 style={{ color: '#1f2937', marginBottom: '10px' }}>{product.productName}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  <div><strong>Category:</strong> {product.category}</div>
                  <div><strong>Price:</strong> ${product.price}</div>
                  <div><strong>Manufacturer:</strong> {product.manufacturer}</div>
                  <div><strong>Submitted:</strong> {new Date(product.submittedAt).toLocaleDateString()}</div>
                </div>
                {product.description && (
                  <div style={{ marginTop: '10px' }}>
                    <strong>Description:</strong> {product.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
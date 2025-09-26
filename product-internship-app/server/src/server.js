import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'internship-secret-key-2024';

app.use(cors());
app.use(express.json());

// Simple database (no PostgreSQL needed for beginner)
let companies = [
  {
    id: 1,
    name: 'Demo Company',
    email: 'demo@company.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password
  }
];

let products = [];

// Test route - Check if server works
app.get('/api/health', (req, res) => {
  res.json({ 
    status: '✅ Server is running perfectly!', 
    message: 'Backend is working correctly!',
    timestamp: new Date().toISOString() 
  });
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email);

    // Find company
    const company = companies.find(c => c.email === email);
    if (!company) {
      return res.status(400).json({ error: 'Company not found' });
    }

    // Check password (always 'password' for demo)
    const validPassword = await bcrypt.compare(password, company.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Create token
    const token = jwt.sign(
      { id: company.id, email: company.email, name: company.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      company: { id: company.id, name: company.name, email: company.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get form steps
app.get('/api/form-steps', (req, res) => {
  const formSteps = [
    {
      id: 1,
      stepNumber: 1,
      title: "Product Basic Information",
      description: "Tell us about your product basics",
      questions: [
        {
          id: 1,
          questionText: "Product Name *",
          type: "text",
          fieldName: "productName",
          isRequired: true,
          placeholder: "Enter product name"
        },
        {
          id: 2,
          questionText: "Product Category *",
          type: "select",
          fieldName: "category",
          options: ["Electronics", "Clothing", "Food & Beverages", "Home & Garden", "Other"],
          isRequired: true
        }
      ]
    },
    {
      id: 2,
      stepNumber: 2,
      title: "Product Details",
      description: "Additional product specifications",
      questions: [
        {
          id: 3,
          questionText: "Product Description",
          type: "textarea",
          fieldName: "description",
          isRequired: false,
          placeholder: "Describe your product..."
        },
        {
          id: 4,
          questionText: "Price (USD) *",
          type: "number",
          fieldName: "price",
          isRequired: true,
          placeholder: "0.00"
        }
      ]
    },
    {
      id: 3,
      stepNumber: 3,
      title: "Additional Information",
      description: "Final details about your product",
      questions: [
        {
          id: 5,
          questionText: "Manufacturer/Seller Name *",
          type: "text",
          fieldName: "manufacturer",
          isRequired: true
        },
        {
          id: 6,
          questionText: "Is this product eco-friendly?",
          type: "radio",
          fieldName: "ecoFriendly",
          options: ["Yes", "No", "Not applicable"],
          isRequired: false
        }
      ]
    }
  ];

  res.json(formSteps);
});

// Submit product
app.post('/api/products', (req, res) => {
  try {
    const productData = {
      id: products.length + 1,
      ...req.body,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      submittedBy: 'Demo Company'
    };

    products.push(productData);
    
    res.status(201).json({ 
      success: true, 
      message: '🎉 Product submitted successfully!', 
      product: productData 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit product' });
  }
});

// Get all products
app.get('/api/products', (req, res) => {
  res.json({ products, total: products.length });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Backend Server Started Successfully!');
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`✅ Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔑 Demo Login: demo@company.com / password`);
});
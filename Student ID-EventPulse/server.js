const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/db');
const errorMiddleware = require('./middleware/errorMiddleware');

// Routes Imports
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Dummy Swagger Doc (في حال عدم وجود ملف swagger.json منفصل)
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'EventPulse API',
    version: '1.0.0',
    description: 'Real-time Event Management Backend API Documentation'
  },
  paths: {
    '/health': {
      get: {
        summary: 'Check API and DB status',
        responses: {
          '200': { description: 'API is running successfully' }
        }
      }
    }
  }
};

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Welcome to EventPulse API',
    docs: '/api-docs'
  });
});

// Health Check Endpoint (مطلوب طبقاً للـ Checklist)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is healthy and running smoothly',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Centralized Error Handling Middleware
app.use(errorMiddleware);

// Export app for Vercel Serverless Architecture
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

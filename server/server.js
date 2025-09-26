const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

// Initialize Cloudinary
require('./config/cloudinary');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const blogRoutes = require('./routes/blogs');
const uploadRoutes = require('./routes/upload');
const settingsRoutes = require('./routes/settings');
const bookingRoutes = require('./routes/bookings');
const tourRoutes = require('./routes/tours');
const transferRoutes = require('./routes/transfers');
const tourCategoryRoutes = require('./routes/tourCategories');
const transferCategoryRoutes = require('./routes/transferCategories');
const consultationRoutes = require('./routes/consultations');

const app = express();

// Security middleware
app.use(helmet());

// Compression middleware for better performance
app.use(compression());

// Rate limiting - only in production
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10000 // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);
}
// Disable rate limiting in development for now

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
     'http://localhost:3001',
     'https://zuna-travel.vercel.app',
     'https://zuna-travel-ab1g.vercel.app',
     'https://zuna-travel-git-main-zunatravel-dev.vercel.app',
     'https://zunatravel-dev.vercel.app',
     'https://zunatravel-dev.vercel.app',
     'https://www.vnbesttravel.com',
     ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/tour-categories', tourCategoryRoutes);
app.use('/api/transfer-categories', transferCategoryRoutes);
app.use('/api/consultations', consultationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'VnBestTravel API is running',
    timestamp: new Date().toISOString()
  });
});

// Warmup endpoint to wake up server from sleep (Render.com)
app.get('/api/warmup', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is awake and ready',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const http = require('http'); // NEW: needed for manual server + fallback ports
require('dotenv').config({ path: './config.env' });

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const resultRoutes = require('./routes/results');

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: [
    'https://quiz-web-tau.vercel.app',  // ✅ your actual frontend
    'https://quizweb-3go7.onrender.com', // backend (optional)
    'http://localhost:3000'              // for local dev
  ],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection with fallback
const connectDB = async () => {
  try {
    if (process.env.USE_MEMORY_DB === 'true') {
      console.log('📊 Using in-memory database (MongoDB not required)');
      return;
    }
    
    console.log('🔗 Attempting to connect to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB Atlas successfully!');
  } catch (error) {
    console.log('⚠️ MongoDB connection failed:', error.message);
    console.log('💡 Check your MongoDB Atlas connection string and network access');
    process.env.USE_MEMORY_DB = 'true';
  }
};

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/results', resultRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: process.env.USE_MEMORY_DB === 'true' ? 'in-memory' : 'mongodb'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ------------------------
// Server start with port fallback (NO extra deps)
// ------------------------
const START_PORT = parseInt(process.env.PORT, 10) || 5000;
const MAX_TRIES = 10;

function startServer(port, triesLeft) {
  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 Health check: http://localhost:${port}/api/health`);
    console.log(`💾 Database: ${process.env.USE_MEMORY_DB === 'true' ? 'In-Memory' : 'MongoDB'}`);
    if (port !== START_PORT) {
      console.log(`ℹ️ Port ${START_PORT} was busy. Fallback to ${port}.`);
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && triesLeft > 0) {
      const nextPort = port + 1;
      console.warn(`⚠️ Port ${port} in use. Trying ${nextPort}... (${triesLeft - 1} tries left)`);
      startServer(nextPort, triesLeft - 1);
    } else {
      console.error('❌ Could not start server:', err);
      process.exit(1);
    }
  });
}

startServer(START_PORT, MAX_TRIES);

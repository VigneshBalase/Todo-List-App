const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

// Basic middleware
app.use(cors());  // Enable CORS
app.use(express.json());  // Parse JSON body
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded data

// Routes
app.use('/api/v1/todos', require('./routes/todoRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/auth', require('./routes/authRoutes'));

// Default error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err);  // Log the error for development
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

module.exports = app;

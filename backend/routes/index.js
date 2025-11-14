const express = require('express');
const router = express.Router();

// Import route modules
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const facilityRoutes = require('./facilityRoutes');

// Define API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/facilities', facilityRoutes);

// API root endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/ris/api/auth',
      users: '/ris/api/users',
      facilities: '/ris/api/facilities'
    }
  });
});

module.exports = router;


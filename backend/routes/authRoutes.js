const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin, validateUser } = require('../middleware/validators');

// Auth routes
router.post('/register', validateUser, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.getMe);

module.exports = router;


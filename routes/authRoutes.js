const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Authentication routes
router.post('/register', register); // Register a new user
router.post('/login', login);       // Login an existing us

module.exports = router;

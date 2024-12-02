const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

//auth routes
router.post('/register', register); //register 
router.post('/login', login);       //log in

module.exports = router;

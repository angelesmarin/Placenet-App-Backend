const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');

// 2 functionalities
router.post('/add', propertyController.addProperty); //add property 
router.get('/', propertyController.getAllProperties); //list properties 

module.exports = router;

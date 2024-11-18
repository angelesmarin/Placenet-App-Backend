const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');//protect with jwt

const {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');

router.use(authenticateToken);//protect routes

router.post('/', createProperty); 
router.get('/:propertyId', getProperty); 
router.get('/', getAllProperties);
router.put('/:propertyId', updateProperty);  
router.delete('/:propertyId', deleteProperty);  

module.exports = router;

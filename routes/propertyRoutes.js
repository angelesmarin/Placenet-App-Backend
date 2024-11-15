const express = require('express');
const router = express.Router();
const {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');

router.post('/', createProperty); 
router.get('/:propertyId', getProperty); //read: 1 
router.get('/', getAllProperties); //read: all 
router.put('/:propertyId', updateProperty);  
router.delete('/:propertyId', deleteProperty);  

module.exports = router;

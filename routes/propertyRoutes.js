const express = require('express');
const router = express.Router();
const {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');

/*
CRUD operations 
*/

router.post('/', createProperty); // create 

router.get('/:propertyId', getProperty); //read: 1 

router.get('/', getAllProperties); //read: all 

router.put('/:propertyId', updateProperty); //update 

router.delete('/:propertyId', deleteProperty); //delete 

module.exports = router;

const { where } = require('sequelize');
const Property = require('../models/Property');

// get properties
const getAllProperties = async (req, res) => {
  try{
    const  user_id = req.user.userId; //extract from jwt payload 
    const properties = await Property.findAll({
      where: { user_id },
    });
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error getting properties', error });
  }
};

// get a property with ID
const getProperty = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const property = await Property.findOne({
      where: { property_id: req.params.propertyId, user_id },
    });
    if (!property) {
      return res.status(404).json({ message: 'Property not found or unauthorized' });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Error getting property', error });
  }
};

// new property
const createProperty = async (req, res) => {
  try {
    const user_id = req.user.userId; // Override user_id from JWT payload
    const { name } = req.body; // Extract property details
    const newProperty = await Property.create({ user_id, name });
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ message: 'Error creating property', error });
  }
};

// update property 
const updateProperty = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { name } = req.body;
    const property = await Property.findOne({
      where: { property_id: req.params.propertyId, user_id },
    });
    if (!property) {
      return res.status(404).json({ message: 'Property not found or unauthorized' });
    }
    await property.update({ name });
    res.status(200).json({ message: 'Property updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating property', error });
  }
};

<<<<<<< HEAD
// Delete property
=======
//delete
>>>>>>> 9a0f183 (fixed jwt issues)
const deleteProperty = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const property = await Property.findOne({
      where: { property_id: req.params.propertyId, user_id },
    });
    if (!property) {
      return res.status(404).json({ message: 'Property not found or unauthorized' });
    }
    await property.destroy();
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting property', error });
  }
};

module.exports = {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
};

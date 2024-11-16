const { where } = require('sequelize');
const { Property } = require('../models');


//get all
const getAllProperties = async (req, res) => {
  const { user_id } = req.query;
  try {
    const properties = await Property.findAll({
      where: { user_id },
    });
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error getting properties', error });
  }
};

//get a property with ID
const getProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Error getting property', error });
  }
};

// new property
const createProperty = async (req, res) => {
  try {
    const { user_id, name } = req.body;
    const newProperty = await Property.create({ user_id, name });
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ message: 'Error creating property', error });
  }
};

//update 
const updateProperty = async (req, res) => {
  try {
    const { user_id, name } = req.body; 
    const property = await Property.findByPk(req.params.propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    // Update both `user_id` and `name` if needed
    await property.update({ user_id, name });
    res.status(200).json({ message: 'Property updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating property', error });
  }
};

//d
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
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

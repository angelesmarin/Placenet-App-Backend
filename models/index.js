const User = require('./User'); 
const Property = require('./Property');
const Project = require('./Project');
const Document = require('./Document');

//NEW: centralised associations to avoid circular dependencies 

//associations:
User.hasMany(Property, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
  Property.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
  
  Property.hasMany(Project, {
    foreignKey: 'property_id',
    onDelete: 'CASCADE',
  });
  Project.belongsTo(Property, {
    foreignKey: 'property_id',
    onDelete: 'CASCADE',
  });
  
  Project.hasMany(Document, {
    foreignKey: 'project_id',
    onDelete: 'CASCADE',
  });
  Document.belongsTo(Project, {
    foreignKey: 'project_id',
    onDelete: 'CASCADE',
  });
  
  Document.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
  
  module.exports = { User, Property, Project, Document };

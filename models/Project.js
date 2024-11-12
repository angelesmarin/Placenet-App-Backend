const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Property = require('./Property');
const User = require('./User');

const Project = sequelize.define('Project', {
  project_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  property_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Property,
      key: 'property_id',
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'user_id',
    },
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  start_date: {
    type: DataTypes.DATE,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
  },
}, {
  tableName: 'projects',
  timestamps: false,
});

module.exports = Project;

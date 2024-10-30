const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Project = require('./Project');
const User = require('./User');

const Document = sequelize.define('Document', {
  document_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Project,
      key: 'project_id',
    },
    onDelete: 'CASCADE',
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id',
    },
    onDelete: 'CASCADE',
  },
  file_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  file_path: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'documents',
  timestamps: false,
});

module.exports = Document;

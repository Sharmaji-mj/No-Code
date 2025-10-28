// backend/src/models/Project.js

const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Project extends Model {}

// Initialize the Project model
Project.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'mejuvante'
  },
  files: {
    type: DataTypes.JSONB,
    defaultValue: { 'README.md': '' },
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active',
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    // Explicitly map to the snake_case column
    field: 'user_id',
  },
}, {
  sequelize,
  modelName: 'Project',
  tableName: 'projects', // Explicitly lowercase
  underscored: true,      // Use snake_case for columns
  timestamps: true,       // Enable timestamps
});

module.exports = Project;
// backend/src/models/index.js

const { sequelize } = require('../config/database');
const User = require('./User');
const Project = require('./Project');

// Setup associations
User.hasMany(Project, { foreignKey: 'user_id', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// The setup function to be called in your main index.js
const setupModels = () => {
  console.log('Models have been setup and associations are ready.');
  // In a more complex app, you might sync here, but we're doing it in database.js
};

module.exports = {
  sequelize,
  User,
  Project,
  setupModels,
};
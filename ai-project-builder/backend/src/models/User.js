// backend/src/models/User.js

const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

class User extends Model {
  // Instance method to check the password
  async validatePassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

// Initialize the User model
User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 255] // Minimum password length
    }
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users', // Explicitly lowercase
  underscored: true,   // Use snake_case for columns (created_at, updated_at)
  timestamps: true,   // Enable timestamps
  hooks: {
    // Before creating a user, hash their password
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    },
    // Before updating a user, hash their password if it has changed
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  }
});

module.exports = User;
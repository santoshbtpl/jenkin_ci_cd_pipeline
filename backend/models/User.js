const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('user', {
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: { msg: "Full name is required" } }
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: false,
    validate: { notEmpty: { msg: "Gender is required" } }
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: 'username already exists' },
    validate: { notEmpty: { msg: 'Invalid username format' } }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: 'Email already exists' },
    validate: { isEmail: { msg: 'Invalid email format' } }
  },
  mobile_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: 'Mobile number already exists' },
    validate: {
      isNumeric: { msg: 'Mobile number must be numeric' },
      len: { args: [10, 10], msg: 'Mobile number must be 10 digits' },
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('Technician', 'FrontDesk', 'Radiologist'),
    allowNull: false,
    validate: { notEmpty: { msg: 'Role is required' } }
  },
  facility_id: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: { notEmpty: { msg: 'Facility/Branch is required' } }
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Inactive'
  },
  profile_picture: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // Technician Fields
  employee_id: { type: DataTypes.STRING, allowNull: true },
  department: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
  qualification: { type: DataTypes.STRING, allowNull: true },
  experience_years: { type: DataTypes.INTEGER, allowNull: true },
  reporting_supervisor: { type: DataTypes.STRING, allowNull: true },

  // FrontDesk Fields
  assigned_counter: { type: DataTypes.STRING, allowNull: true },
  shift_timing: { type: DataTypes.STRING, allowNull: true },

  // Radiologist Fields
  doctor_id: { type: DataTypes.STRING, allowNull: true },
  registration_number: { type: DataTypes.STRING, allowNull: true },
  specialty: { type: DataTypes.STRING, allowNull: true },
  signature: { type: DataTypes.STRING, allowNull: true },
  peer_reviewer: { type: DataTypes.BOOLEAN, defaultValue: false },
  reporting_modality_access: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },

  deleted_at: { type: DataTypes.DATE, allowNull: true },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      // Only hash if password was changed
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

module.exports = User;

const { sequelize } = require('../config/database');
const User = require('./User');
const Facility = require('./Facility');

// ========== Define Model Associations ==========

// Facility ↔ User Associations
// Facility belongs to User (creator)
Facility.belongsTo(User, {
  as: 'CreatedBy',
  foreignKey: 'created_by',
  targetKey: 'id'
});

// Facility belongs to User (modifier)
Facility.belongsTo(User, {
  as: 'ModifiedBy',
  foreignKey: 'modified_by',
  targetKey: 'id'
});

// User has many facilities (as creator)
User.hasMany(Facility, {
  foreignKey: 'created_by',
  as: 'CreatedFacilities'
});

// User has many facilities (as modifier)
User.hasMany(Facility, {
  foreignKey: 'modified_by',
  as: 'ModifiedFacilities'
});

// User belongs to Facility (facility_id in User)
// Note: No foreign key constraint due to type mismatch (User.facility_id is STRING, Facility.id is UUID)
User.belongsTo(Facility, {
  as: 'Facility',
  foreignKey: 'facility_id',
  targetKey: 'id',
  constraints: false // Disable foreign key constraint due to type mismatch
});

// Facility has many users (staff members)
Facility.hasMany(User, {
  foreignKey: 'facility_id',
  as: 'Staff',
  constraints: false // Disable foreign key constraint due to type mismatch
});

module.exports = {
  sequelize,
  User,
  Facility
};


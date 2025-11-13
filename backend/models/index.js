const { sequelize } = require('../config/database');
const User = require('./User');

// Define model associations here
// Example:
// User.hasMany(Post);
// Post.belongsTo(User);

module.exports = {
  sequelize,
  User
};


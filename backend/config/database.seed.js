const { sequelize } = require('./database');
const User = require('../models/User');

/**
 * Seed the database with initial data
 */
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Sync database (will create tables if they don't exist)
    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });
    console.log('Admin user created:', admin.email);

    // Create regular user
    const user = await User.create({
      name: 'Test User',
      username: 'user',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
      isActive: true
    });
    console.log('Regular user created:', user.email);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;


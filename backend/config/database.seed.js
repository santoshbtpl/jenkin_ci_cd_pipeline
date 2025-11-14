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

    // Create Radiologist user
    const radiologist = await User.create({
      full_name: 'Dr. John Smith',
      gender: 'Male',
      date_of_birth: '1980-05-15',
      username: 'radiologist',
      email: 'radiologist@example.com',
      mobile_number: '9876543210',
      password: 'radio123',
      role: 'Radiologist',
      facility_id: 'FAC001',
      status: 'Active',
      doctor_id: 'DOC001',
      registration_number: 'REG123456',
      specialty: 'Radiology',
      peer_reviewer: true,
      reporting_modality_access: ['CT', 'MRI', 'X-Ray']
    });
    console.log('Radiologist user created:', radiologist.email);

    // Create Technician user
    const technician = await User.create({
      full_name: 'Mike Johnson',
      gender: 'Male',
      date_of_birth: '1990-08-20',
      username: 'technician',
      email: 'technician@example.com',
      mobile_number: '9876543211',
      password: 'tech123',
      role: 'Technician',
      facility_id: 'FAC001',
      status: 'Active',
      employee_id: 'EMP001',
      department: ['CT', 'MRI'],
      qualification: 'B.Sc Radiology',
      experience_years: 5
    });
    console.log('Technician user created:', technician.email);

    // Create FrontDesk user
    const frontdesk = await User.create({
      full_name: 'Sarah Williams',
      gender: 'Female',
      date_of_birth: '1995-03-10',
      username: 'frontdesk',
      email: 'frontdesk@example.com',
      mobile_number: '9876543212',
      password: 'front123',
      role: 'FrontDesk',
      facility_id: 'FAC001',
      status: 'Active',
      assigned_counter: 'Counter 1',
      shift_timing: '9:00 AM - 5:00 PM'
    });
    console.log('FrontDesk user created:', frontdesk.email);

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


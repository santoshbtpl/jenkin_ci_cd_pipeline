const sequelize = require('./database').sequelize;

// Load seeders
const seedFacilities = require('../seeders/facility.seed');
const seedUsers = require('../seeders/users.seed'); 

async function seedDatabase() {
  try {
    console.log("🚀 Starting Database Seeding...");

    // Sync DB
    await sequelize.sync({ force: false });

    // Execute seeds
    console.log("🔹 Seeding Facilities...");
    await seedFacilities();

    console.log("🔹 Seeding Users...");
    await seedUsers();    // <-- call users seeder here

    console.log("🎉 All Seeds Executed Successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during seeding:", err);
    process.exit(1);
  }
}

seedDatabase();

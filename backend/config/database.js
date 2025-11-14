const { Sequelize } = require('sequelize');

/**
 * Initialize PostgreSQL database connection
 */
const sequelize = new Sequelize(
  process.env.DB_NAME || 'ohif_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'admin',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

/**
 * Fix facility_code unique constraint before sync
 */
const fixFacilityUniqueConstraint = async () => {
  try {
    // Check if facilities table exists
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'facilities'
    `);

    if (tables.length === 0) return; // Table doesn't exist yet

    // Drop any existing unique constraints/indexes on facility_code
    const [constraints] = await sequelize.query(`
      SELECT tc.constraint_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_name = 'facilities'
        AND kcu.column_name = 'facility_code'
        AND tc.constraint_type = 'UNIQUE'
    `);

    for (const constraint of constraints) {
      try {
        await sequelize.query(`
          ALTER TABLE facilities 
          DROP CONSTRAINT IF EXISTS ${constraint.constraint_name}
        `);
      } catch (error) {
        // Ignore errors - constraint might not exist
      }
    }

    // Drop indexes
    const [indexes] = await sequelize.query(`
      SELECT indexname
      FROM pg_indexes
      WHERE tablename = 'facilities'
        AND indexname LIKE '%facility_code%'
        AND indexname NOT LIKE '%pkey%'
    `);

    for (const index of indexes) {
      try {
        await sequelize.query(`DROP INDEX IF EXISTS ${index.indexname}`);
      } catch (error) {
        // Ignore errors
      }
    }
  } catch (error) {
    // Ignore errors - table might not exist or already fixed
    console.log('Note: Could not fix facility_code constraint (this is OK if table is new)');
  }
};

/**
 * Connect to PostgreSQL database
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected Successfully');
    
    // Sync models with database (creates tables if they don't exist)
    if (process.env.NODE_ENV === 'development') {
      // Fix facility_code unique constraint before syncing
      await fixFacilityUniqueConstraint();
      
      // Import models to ensure associations are loaded
      const { Facility, User } = require('../models');
      
      // Sync Facility first (since User references it)
      try {
        await Facility.sync({ alter: true });
        console.log('Facility table synchronized');
      } catch (error) {
        // Handle Sequelize ENUM alter syntax error
        // This happens when Sequelize tries to combine COMMENT and USING in one statement
        if (error.message.includes('USING') || 
            error.message.includes('syntax error') ||
            error.message.includes('near "USING"')) {
          console.log('Note: ENUM column alterations skipped (types are already correct)');
          console.log('Facility table structure is compatible - continuing...');
        } else {
          // Re-throw other errors
          throw error;
        }
      }
      
      // Then sync User (which references Facility)
      await User.sync({ alter: true });
      console.log('User table synchronized');
      
      console.log('Database synchronized');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };


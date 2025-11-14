const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Facility = sequelize.define('facility', {
  // ========== Basic Info ==========
  facility_name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: 'Full registered name of the facility'
  },

  facility_code: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Short unique code (for quick reference) - optional'
  },

  facility_type: {
    type: DataTypes.ENUM('Hospital', 'Diagnostic Center', 'Clinic'),
    allowNull: false,
    comment: 'Hospital / Diagnostic Center / Clinic'
  },

  facility_description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Optional notes about the facility'
  },

  // ========== Address & Contact ==========
  address_line_1: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Street or building address'
  },

  address_line_2: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Additional location info'
  },

  city: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Facility city'
  },

  state: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Facility state'
  },

  country: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Facility country'
  },

  pincode: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: 'Postal code'
  },

  contact_number: {
    type: DataTypes.STRING(15),
    allowNull: true,
    comment: 'Facility contact phone'
  },

  email_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isEmail: { msg: 'Please provide a valid email address' }
    },
    comment: 'Facility contact email'
  },

  // ========== Letterhead Configuration (optional) ==========
  letterhead_logo: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Uploaded file (PNG/JPG/SVG) - path or URL'
  },

  header_text: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Facility header info'
  },

  footer_text: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Legal or disclaimer text'
  },

  // ========== PACS/RIS Integration (optional) ==========
  pacs_ae_title: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Application Entity title for PACS'
  },

  pacs_ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true,
    comment: 'PACS server IP'
  },

  pacs_port: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Communication port'
  },

  ris_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Linked RIS endpoint'
  },

  integration_status: {
    type: DataTypes.ENUM('Connected', 'Pending', 'Failed'),
    defaultValue: 'Pending',
    allowNull: true,
    comment: 'Connected / Pending / Failed'
  },

  // ========== Status ==========
  status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Suspended'),
    defaultValue: 'Active',
    allowNull: true,
    comment: 'Active / Inactive / Suspended'
  },
   
  // ========== Audit Info ==========

}, {
  tableName: 'facilities',
  timestamps: true,  // Auto-creates created_at and updated_at
  underscored: true, // Use snake_case (created_at, updated_at)
  comment: 'Facilities/Branches - Hospitals, Diagnostic Centers, Clinics',
  indexes: [
    {
      unique: true,
      fields: ['facility_code'],
      name: 'facilities_facility_code_unique'
    }
  ]
});

// Note: Associations are defined in models/index.js

module.exports = Facility;
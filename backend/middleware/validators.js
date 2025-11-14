const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

exports.validateUser = [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('gender').notEmpty().withMessage('Gender is required'),
  body('date_of_birth').notEmpty().withMessage('Date of birth is required'),
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('mobile_number')
    .isNumeric().withMessage('Mobile must be numeric')
    .isLength({ min: 10, max: 10 }).withMessage('Mobile must be 10 digits'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a number')
    .matches(/[@$!%*?&#]/).withMessage('Password must contain a special character'),
  body('role')
    .notEmpty().withMessage('Role selection is mandatory')
    .isIn(['Technician', 'FrontDesk', 'Radiologist']).withMessage('Invalid role'),
  body('facility_id').notEmpty().withMessage('Facility is required'),
  validate
];


exports.validateUserUpdate = [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('gender').notEmpty().withMessage('Gender is required'),
  body('date_of_birth').notEmpty().withMessage('Date of birth is required'),
  body('role')
    .notEmpty().withMessage('Role selection is mandatory')
    .isIn(['Technician', 'FrontDesk', 'Radiologist']).withMessage('Invalid role'),
  body('facility_id').notEmpty().withMessage('Facility is required'),
  validate
];

exports.validateLogin = [
  body('username')
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate
];

exports.validateRegister = exports.validateUser; // Alias for backward compatibility

/**
 * Facility Validation Rules
 */

// Create Facility Validation
exports.validateFacility = [
  body('facility_name')
    .trim()
    .notEmpty().withMessage('Facility name is required')
    .isLength({ min: 3, max: 200 }).withMessage('Facility name must be between 3-200 characters'),
  
  body('facility_code')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Facility code cannot exceed 50 characters')
    .isAlphanumeric().withMessage('Facility code must be alphanumeric'),
  
  body('facility_type')
    .notEmpty().withMessage('Facility type is required')
    .isIn(['Hospital', 'Diagnostic Center', 'Clinic']).withMessage('Invalid facility type'),
  
  body('facility_description')
    .optional()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  
  // Address fields (optional)
  body('address_line_1')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('Address line 1 cannot exceed 255 characters'),
  
  body('address_line_2')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('Address line 2 cannot exceed 255 characters'),
  
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('City name cannot exceed 100 characters'),
  
  body('state')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('State name cannot exceed 100 characters'),
  
  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Country name cannot exceed 100 characters'),
  
  body('pincode')
    .optional()
    .trim()
    .isLength({ min: 4, max: 10 }).withMessage('Pincode must be between 4-10 characters')
    .matches(/^[A-Za-z0-9\s-]+$/).withMessage('Invalid pincode format'),
  
  body('contact_number')
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 }).withMessage('Contact number must be between 10-15 characters')
    .matches(/^[0-9+\-\s()]+$/).withMessage('Invalid contact number format'),
  
  body('email_id')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  // Letterhead fields (optional)
  body('letterhead_logo')
    .optional()
    .isLength({ max: 500 }).withMessage('Letterhead logo path cannot exceed 500 characters'),
  
  body('header_text')
    .optional()
    .isLength({ max: 1000 }).withMessage('Header text cannot exceed 1000 characters'),
  
  body('footer_text')
    .optional()
    .isLength({ max: 1000 }).withMessage('Footer text cannot exceed 1000 characters'),
  
  // PACS/RIS fields (optional)
  body('pacs_ae_title')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('PACS AE Title cannot exceed 50 characters'),
  
  body('pacs_ip_address')
    .optional()
    .trim()
    .isIP().withMessage('Invalid IP address'),
  
  body('pacs_port')
    .optional()
    .isInt({ min: 1, max: 65535 }).withMessage('Port must be between 1-65535'),
  
  body('ris_url')
    .optional()
    .trim()
    .isURL().withMessage('Invalid RIS URL'),
  
  body('integration_status')
    .optional()
    .isIn(['Connected', 'Pending', 'Failed']).withMessage('Invalid integration status'),
  
  body('status')
    .optional()
    .isIn(['Active', 'Inactive', 'Suspended']).withMessage('Invalid status'),
  
  validate
];

// Update Facility Validation (more lenient - all fields optional except those being updated)
exports.validateFacilityUpdate = [
  body('facility_name')
    .optional()
    .trim()
    .notEmpty().withMessage('Facility name cannot be empty')
    .isLength({ min: 3, max: 200 }).withMessage('Facility name must be between 3-200 characters'),
  
  body('facility_code')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Facility code cannot exceed 50 characters')
    .isAlphanumeric().withMessage('Facility code must be alphanumeric'),
  
  body('facility_type')
    .optional()
    .isIn(['Hospital', 'Diagnostic Center', 'Clinic']).withMessage('Invalid facility type'),
  
  body('facility_description')
    .optional()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  
  body('email_id')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('contact_number')
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 }).withMessage('Contact number must be between 10-15 characters')
    .matches(/^[0-9+\-\s()]+$/).withMessage('Invalid contact number format'),
  
  body('pincode')
    .optional()
    .trim()
    .isLength({ min: 4, max: 10 }).withMessage('Pincode must be between 4-10 characters'),
  
  body('pacs_ip_address')
    .optional()
    .trim()
    .isIP().withMessage('Invalid IP address'),
  
  body('pacs_port')
    .optional()
    .isInt({ min: 1, max: 65535 }).withMessage('Port must be between 1-65535'),
  
  body('ris_url')
    .optional()
    .trim()
    .isURL().withMessage('Invalid RIS URL'),
  
  body('integration_status')
    .optional()
    .isIn(['Connected', 'Pending', 'Failed']).withMessage('Invalid integration status'),
  
  body('status')
    .optional()
    .isIn(['Active', 'Inactive', 'Suspended']).withMessage('Invalid status'),
  
  validate
];

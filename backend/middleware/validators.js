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

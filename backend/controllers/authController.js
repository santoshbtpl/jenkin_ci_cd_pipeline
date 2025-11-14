const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

/**
 * @desc    Register new user
 * @route   POST /ris/api/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res) => {
  const {
    full_name,
    gender,
    date_of_birth,
    username,
    email,
    mobile_number,
    password,
    role,
    facility_id,
    // Role-specific fields
    employee_id,
    department,
    qualification,
    experience_years,
    reporting_supervisor,
    assigned_counter,
    shift_timing,
    doctor_id,
    registration_number,
    specialty,
    signature,
    peer_reviewer,
    reporting_modality_access
  } = req.body;

  console.log('email', mobile_number);

  // Check if user with email already exists
  const existingUser = await User.findOne({
    where: { email },
  });

  console.log('existingUser', existingUser);

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }

  // Check if mobile number already exists
  const duplicateMobile = await User.findOne({
    where: { mobile_number }
  });

  if (duplicateMobile) {
    return res.status(400).json({
      success: false,
      message: 'Mobile number already exists'
    });
  }

  // Check if username already exists
  const duplicateUsername = await User.findOne({
    where: { username }
  });

  if (duplicateUsername) {
    return res.status(400).json({
      success: false,
      message: 'Username already exists'
    });
  }

  // Create user object with common fields
  const userData = {
    full_name,
    gender,
    date_of_birth,
    username,
    email,
    mobile_number,
    password,
    role,
    facility_id,
    status: 'Active'
  };

  // Add role-specific fields based on role
  if (role === 'Technician') {
    userData.employee_id = employee_id;
    userData.department = department;
    userData.qualification = qualification;
    userData.experience_years = experience_years;
    userData.reporting_supervisor = reporting_supervisor;
  } else if (role === 'FrontDesk') {
    userData.assigned_counter = assigned_counter;
    userData.shift_timing = shift_timing;
  } else if (role === 'Radiologist') {
    userData.doctor_id = doctor_id;
    userData.registration_number = registration_number;
    userData.specialty = specialty;
    userData.signature = signature;
    userData.peer_reviewer = peer_reviewer;
    userData.reporting_modality_access = reporting_modality_access;
  }

  // Create user in database
  const newUser = await User.create(userData);

  // Remove password from response
  const userResponse = newUser.toJSON();
  delete userResponse.password;

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: userResponse
  });
});


exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password, 'login data here');

  // Find user by username
  const user = await User.findOne({
    where: { username }
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if user is active
  if (user.status !== 'Active') {
    return res.status(403).json({
      success: false,
      message: 'Your account is inactive. Please contact administrator.'
    });
  }

  // Check if user is deleted
  if (user.is_deleted) {
    return res.status(403).json({
      success: false,
      message: 'Account not found'
    });
  }

  // Verify password using bcrypt
  const bcrypt = require('bcryptjs');
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // TODO: Generate JWT token
  const token = 'your_jwt_token_here';

  // Remove password from response
  const userResponse = user.toJSON();
  delete userResponse.password;

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token: token,
    data: userResponse
  });
});

/**
 * @desc    Logout user
 * @route   POST /ris/api/auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res) => {
  // TODO: Implement logout logic
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

/**
 * @desc    Get current user
 * @route   GET /ris/api/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res) => {
  // TODO: Get user from token
  res.status(200).json({
    success: true,
    data: req.user || null
  });
});


exports.getUser = asyncHandler(async (req, res) => {
  // TODO: Get user from token
  res.status(200).json({
    success: true,
    data: req.user || null
  });
});


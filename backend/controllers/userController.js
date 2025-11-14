const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const { Op } = require('sequelize');

/**
 * @desc    Get all users
 * @route   GET /ris/api/users
 * @access  Private
 */
exports.getAllUsers = asyncHandler(async (req, res) => {
  // Extract query parameters for filtering and pagination
  const {
    page = 1,
    limit = 10,
    role,
    status,
    facility_id,
    search
  } = req.query;

  // Build where clause for filtering
  const whereClause = {
    is_deleted: false // Only fetch non-deleted users
  };

  // Filter by role
  if (role) {
    whereClause.role = role;
  }

  // Filter by status
  if (status) {
    whereClause.status = status;
  }

  // Filter by facility
  if (facility_id) {
    whereClause.facility_id = facility_id;
  }

  // Search by name, email, or username
  if (search) {
    whereClause[Op.or] = [
      { full_name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
      { username: { [Op.iLike]: `%${search}%` } }
    ];
  }

  // Calculate offset for pagination
  const offset = (page - 1) * limit;

  // Fetch users with pagination
  const { count, rows: users } = await User.findAndCountAll({
    where: whereClause,
    attributes: { exclude: ['password'] }, // Exclude password from response
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']]
  });

  // Calculate pagination info
  const totalPages = Math.ceil(count / limit);

  res.status(200).json({
    success: true,
    message: 'Users fetched successfully',
    data: users,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalUsers: count,
      usersPerPage: parseInt(limit),
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
});

/**
 * @desc    Get user by ID
 * @route   GET /ris/api/users/:id
 * @access  Private
 */
exports.getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find user by ID
  const user = await User.findOne({
    where: { 
      id,
      is_deleted: false 
    },
    attributes: { exclude: ['password'] } // Exclude password
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'User fetched successfully',
    data: user
  });
});

/**
 * @desc    Create new user
 * @route   POST /ris/api/users
 * @access  Private
 */
exports.createUser = asyncHandler(async (req, res) => {
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

  // Check if user with email already exists
  const existingUser = await User.findOne({
    where: { email },
  });

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
    message: 'User created successfully',
    data: userResponse
  });
});

/**
 * @desc    Update user
 * @route   PUT /ris/api/users/:id
 * @access  Private
 */
exports.updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Find user
  const user = await User.findOne({
    where: { 
      id,
      is_deleted: false 
    }
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // If updating email, check if it's already taken by another user
  if (updateData.email && updateData.email !== user.email) {
    const emailExists = await User.findOne({
      where: { 
        email: updateData.email,
        id: { [Op.ne]: id }
      }
    });

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
  }

  // If updating mobile, check if it's already taken by another user
  if (updateData.mobile_number && updateData.mobile_number !== user.mobile_number) {
    const mobileExists = await User.findOne({
      where: { 
        mobile_number: updateData.mobile_number,
        id: { [Op.ne]: id }
      }
    });

    if (mobileExists) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number already exists'
      });
    }
  }

  // If updating username, check if it's already taken by another user
  if (updateData.username && updateData.username !== user.username) {
    const usernameExists = await User.findOne({
      where: { 
        username: updateData.username,
        id: { [Op.ne]: id }
      }
    });

    if (usernameExists) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }
  }

  // Don't allow updating certain fields
  delete updateData.id;
  delete updateData.is_deleted;
  delete updateData.deleted_at;

  // If password is being updated, it will be hashed automatically by the model hook
  // Update user
  await user.update(updateData);

  // Remove password from response
  const userResponse = user.toJSON();
  delete userResponse.password;

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: userResponse
  });
});

/**
 * @desc    Delete user (Soft delete)
 * @route   DELETE /ris/api/users/:id
 * @access  Private
 */
exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find user
  const user = await User.findOne({
    where: { 
      id,
      is_deleted: false 
    }
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Soft delete - mark as deleted instead of actually deleting
  await user.update({
    is_deleted: true,
    deleted_at: new Date(),
    status: 'Inactive'
  });

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});


const asyncHandler = require('../utils/asyncHandler');
const { Facility, User } = require('../models');
const { Op, fn, col } = require('sequelize');

/**
 * @desc    Get all facilities
 * @route   GET /ris/api/facilities
 * @access  Private
 */
exports.getAllFacilities = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    facility_type,
    status,
    integration_status,
    search
  } = req.query;

  // Build where clause
  const whereClause = {};

  // Filter by facility type
  if (facility_type) {
    whereClause.facility_type = facility_type;
  }

  // Filter by status
  if (status) {
    whereClause.status = status;
  }

  // Filter by integration status
  if (integration_status) {
    whereClause.integration_status = integration_status;
  }

  // Search by name, code, or city
  if (search) {
    whereClause[Op.or] = [
      { facility_name: { [Op.iLike]: `%${search}%` } },
      { facility_code: { [Op.iLike]: `%${search}%` } },
      { city: { [Op.iLike]: `%${search}%` } }
    ];
  }

  // Calculate offset
  const offset = (page - 1) * limit;

  // Fetch facilities with pagination
  const { count, rows: facilities } = await Facility.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['created_at', 'DESC']]
  });

  // Calculate pagination
  const totalPages = Math.ceil(count / limit);

  res.status(200).json({
    success: true,
    message: 'Facilities fetched successfully',
    data: facilities,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalFacilities: count,
      facilitiesPerPage: parseInt(limit),
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
});

/**
 * @desc    Get facility by ID
 * @route   GET /ris/api/facilities/:id
 * @access  Private
 */
exports.getFacilityById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const facility = await Facility.findOne({
    where: { id },
    include: [
      {
        model: User,
        as: 'CreatedBy',
        attributes: ['id', 'full_name', 'email', 'role']
      },
      {
        model: User,
        as: 'ModifiedBy',
        attributes: ['id', 'full_name', 'email', 'role']
      }
    ]
  });

  if (!facility) {
    return res.status(404).json({
      success: false,
      message: 'Facility not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Facility fetched successfully',
    data: facility
  });
});

/**
 * @desc    Create new facility
 * @route   POST /ris/api/facilities
 * @access  Private (Super Admin only)
 */
exports.createFacility = asyncHandler(async (req, res) => {
  const {
    facility_name,
    facility_code,
    facility_type,
    facility_description,
    address_line_1,
    address_line_2,
    city,
    state,
    country,
    pincode,
    contact_number,
    email_id,
    letterhead_logo,
    header_text,
    footer_text,
    pacs_ae_title,
    pacs_ip_address,
    pacs_port,
    ris_url,
    integration_status,
    status
  } = req.body;

  // Check if facility code already exists (if provided)
  if (facility_code) {
    const existingCode = await Facility.findOne({
      where: { facility_code }
    });

    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: 'Facility code already exists'
      });
    }
  }

  // Check if facility name already exists
  const existingName = await Facility.findOne({
    where: { 
      facility_name: {
        [Op.iLike]: facility_name // Case-insensitive check
      }
    }
  });

  if (existingName) {
    return res.status(400).json({
      success: false,
      message: 'Facility with this name already exists'
    });
  }

  // Create facility
  const facility = await Facility.create({
    facility_name,
    facility_code,
    facility_type,
    facility_description,
    address_line_1,
    address_line_2,
    city,
    state,
    country,
    pincode,
    contact_number,
    email_id,
    letterhead_logo,
    header_text,
    footer_text,
    pacs_ae_title,
    pacs_ip_address,
    pacs_port,
    ris_url,
    integration_status: integration_status || 'Pending',
    status: status || 'Active',
    created_by: req.user.id // From auth middleware
  });

  // Fetch with creator info
  const facilityWithCreator = await Facility.findOne({
    where: { id: facility.id },
    include: [
      {
        model: User,
        as: 'CreatedBy',
        attributes: ['id', 'full_name', 'email']
      }
    ]
  });

  res.status(201).json({
    success: true,
    message: 'Facility created successfully',
    data: facilityWithCreator
  });
});

/**
 * @desc    Update facility
 * @route   PUT /ris/api/facilities/:id
 * @access  Private
 */
exports.updateFacility = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Find facility
  const facility = await Facility.findOne({
    where: { id }
  });

  if (!facility) {
    return res.status(404).json({
      success: false,
      message: 'Facility not found'
    });
  }

  // Check if facility_code is being updated and already exists
  if (updateData.facility_code && updateData.facility_code !== facility.facility_code) {
    const existingCode = await Facility.findOne({
      where: {
        facility_code: updateData.facility_code,
        id: { [Op.ne]: id }
      }
    });

    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: 'Facility code already exists'
      });
    }
  }

  // Check if facility_name is being updated and already exists
  if (updateData.facility_name && updateData.facility_name !== facility.facility_name) {
    const existingName = await Facility.findOne({
      where: {
        facility_name: {
          [Op.iLike]: updateData.facility_name
        },
        id: { [Op.ne]: id }
      }
    });

    if (existingName) {
      return res.status(400).json({
        success: false,
        message: 'Facility with this name already exists'
      });
    }
  }

  // Add modified_by
  updateData.modified_by = req.user.id;

  // Don't allow updating certain fields
  delete updateData.id;
  delete updateData.created_by;
  delete updateData.created_at;

  // Update facility
  await facility.update(updateData);

  // Fetch updated facility with user info
  const updatedFacility = await Facility.findOne({
    where: { id },
    include: [
      {
        model: User,
        as: 'CreatedBy',
        attributes: ['id', 'full_name', 'email']
      },
      {
        model: User,
        as: 'ModifiedBy',
        attributes: ['id', 'full_name', 'email']
      }
    ]
  });

  res.status(200).json({
    success: true,
    message: 'Facility updated successfully',
    data: updatedFacility
  });
});

/**
 * @desc    Delete facility
 * @route   DELETE /ris/api/facilities/:id
 * @access  Private (Super Admin only)
 */
exports.deleteFacility = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const facility = await Facility.findOne({
    where: { id }
  });

  if (!facility) {
    return res.status(404).json({
      success: false,
      message: 'Facility not found'
    });
  }

  // Check if there are users associated with this facility
  const associatedUsers = await User.count({
    where: { facility_id: id }
  });

  if (associatedUsers > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete facility. ${associatedUsers} user(s) are associated with this facility.`,
      associatedUsers
    });
  }

  // Delete facility (hard delete)
  await facility.destroy();

  res.status(200).json({
    success: true,
    message: 'Facility deleted successfully'
  });
});

/**
 * @desc    Get facility statistics
 * @route   GET /ris/api/facilities/stats/summary
 * @access  Private
 */
exports.getFacilityStats = asyncHandler(async (req, res) => {
  // Count by facility type
  const byType = await Facility.findAll({
    attributes: [
      'facility_type',
      [fn('COUNT', col('id')), 'count']
    ],
    group: ['facility_type']
  });

  // Count by status
  const byStatus = await Facility.findAll({
    attributes: [
      'status',
      [fn('COUNT', col('id')), 'count']
    ],
    group: ['status']
  });

  // Count by integration status
  const byIntegrationStatus = await Facility.findAll({
    attributes: [
      'integration_status',
      [fn('COUNT', col('id')), 'count']
    ],
    group: ['integration_status']
  });

  // Total count
  const totalFacilities = await Facility.count();

  res.status(200).json({
    success: true,
    message: 'Facility statistics fetched successfully',
    data: {
      total: totalFacilities,
      byType,
      byStatus,
      byIntegrationStatus
    }
  });
});

/**
 * @desc    Get facilities by type
 * @route   GET /ris/api/facilities/type/:type
 * @access  Private
 */
exports.getFacilitiesByType = asyncHandler(async (req, res) => {
  const { type } = req.params;

  // Validate type
  const validTypes = ['Hospital', 'Diagnostic Center', 'Clinic'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid facility type. Must be: Hospital, Diagnostic Center, or Clinic'
    });
  }

  const facilities = await Facility.findAll({
    where: { 
      facility_type: type,
      status: 'Active'
    },
    attributes: ['id', 'facility_name', 'facility_code', 'city', 'status'],
    order: [['facility_name', 'ASC']]
  });

  res.status(200).json({
    success: true,
    message: `${type} facilities fetched successfully`,
    count: facilities.length,
    data: facilities
  });
});

// module.exports = {
//   getAllFacilities,
//   getFacilityById,
//   createFacility,
//   updateFacility,
//   deleteFacility,
//   getFacilityStats,
//   getFacilitiesByType
// };


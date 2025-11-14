const express = require('express');
const router = express.Router();
const facilityController = require('../controllers/facilityController');
const { authenticate } = require('../middleware/auth');
const { validateFacility, validateFacilityUpdate } = require('../middleware/validators');


router.get('/stats/summary', authenticate, facilityController.getFacilityStats);

// Get facilities by type (must be before /:id)
router.get('/type/:type', authenticate, facilityController.getFacilitiesByType);

// CRUD routes
router.get('/', facilityController.getAllFacilities);
router.get('/:id', facilityController.getFacilityById);
router.post('/', validateFacility, facilityController.createFacility);
router.put('/:id', validateFacilityUpdate, facilityController.updateFacility);
router.delete('/:id', facilityController.deleteFacility);

module.exports = router;


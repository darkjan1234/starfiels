const express = require('express');
const locationController = require('../controllers/locationController');

const router = express.Router();

router.get('/regions', locationController.getRegions);
router.get('/regions/:regionId/provinces', locationController.getProvinces);
router.get('/provinces/:provinceId/cities', locationController.getCities);
router.get('/cities/:cityId/barangays', locationController.getBarangays);
router.get('/hierarchy', locationController.getLocationHierarchy);
router.get('/search', locationController.searchLocations);

module.exports = router;

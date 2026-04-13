const express = require('express');
const hotelController = require('../controllers/hotelController');
const { authenticate, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, hotelController.getHotels);
router.get('/:id', optionalAuth, hotelController.getHotel);
router.get('/:hotelId/availability', hotelController.checkAvailability);

router.post('/bookings', authenticate, hotelController.createBooking);
router.get('/bookings/my', authenticate, hotelController.getUserBookings);

module.exports = router;

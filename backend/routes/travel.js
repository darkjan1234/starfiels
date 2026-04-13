const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth');
const router = express.Router();

const getTourPackages = async (req, res) => {
  res.json({ message: 'Get tour packages endpoint', packages: [] });
};

const getTourPackage = async (req, res) => {
  res.json({ message: 'Get tour package endpoint', package: {} });
};

const createTourBooking = async (req, res) => {
  res.json({ message: 'Create tour booking endpoint' });
};

const getTransportServices = async (req, res) => {
  res.json({ message: 'Get transport services endpoint', services: [] });
};

router.get('/tours', optionalAuth, getTourPackages);
router.get('/tours/:id', optionalAuth, getTourPackage);
router.post('/tours/bookings', authenticate, createTourBooking);
router.get('/transport', optionalAuth, getTransportServices);

module.exports = router;

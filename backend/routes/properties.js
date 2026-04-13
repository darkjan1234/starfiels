const express = require('express');
const { body } = require('express-validator');
const propertyController = require('../controllers/propertyController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', optionalAuth, propertyController.getProperties);
router.get('/:id', optionalAuth, propertyController.getProperty);

// Protected routes
router.post('/',
  authenticate,
  upload.array('images', 30),
  propertyController.createProperty
);

router.put('/:id', authenticate, propertyController.updateProperty);
router.delete('/:id', authenticate, propertyController.deleteProperty);

router.post('/:id/favorite', authenticate, propertyController.toggleFavorite);

router.post('/:id/reviews',
  authenticate,
  [
    body('rating').isInt({ min: 1, max: 5 }),
    body('title').optional().trim(),
    body('review').trim()
  ],
  propertyController.addReview
);

module.exports = router;

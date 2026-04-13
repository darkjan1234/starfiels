const express = require('express');
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/favorites', authenticate, userController.getFavorites);
router.get('/properties', authenticate, userController.getUserProperties);
router.get('/stats', authenticate, userController.getUserStats);
router.post('/avatar', authenticate, upload.single('avatar'), userController.uploadAvatar);
router.get('/search', authenticate, authorize('admin', 'property_manager', 'unit_manager'), userController.searchUsers);

module.exports = router;

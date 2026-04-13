const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty()
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

const passwordValidation = [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
];

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

router.get('/me', authenticate, authController.getMe);
router.put('/me', authenticate, authController.updateProfile);
router.put('/password', authenticate, passwordValidation, authController.changePassword);

module.exports = router;

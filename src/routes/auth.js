const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticateToken, authRateLimit } = require('../middleware/auth');

// Public routes (with rate limiting)
router.post('/register', authRateLimit, AuthController.register);
router.post('/login', authRateLimit, AuthController.login);
router.post('/firebase-auth', authRateLimit, AuthController.firebaseAuth);
router.post('/forgot-password', authRateLimit, AuthController.forgotPassword);
router.get('/verify-email/:token', AuthController.verifyEmail);

// Protected routes (require authentication)
router.get('/profile', authenticateToken, AuthController.getProfile);
router.put('/profile', authenticateToken, AuthController.updateProfile);
router.put('/change-password', authenticateToken, AuthController.changePassword);
router.post('/logout', authenticateToken, AuthController.logout);

module.exports = router;

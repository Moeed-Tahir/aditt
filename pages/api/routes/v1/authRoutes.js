const express = require('express');
const authController = require('../../controllers/v1/authControllers');

const router = express.Router();

router.post('/api/auth/signup', authController.signUp);
router.post('/api/auth/verify-otp', authController.verifyOTP);

module.exports = router;

const express = require('express');
const { requestOtp, verifyOtp, register, login, requestPasswordResetOtp, verifyPasswordResetOtp, resetPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', requestPasswordResetOtp);
router.post('/verify-reset-otp', verifyPasswordResetOtp);
router.post('/reset-password', resetPassword);

module.exports = router;

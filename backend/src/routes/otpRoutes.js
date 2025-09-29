import express from 'express';
import { sendOTPController, verifyOTPAndChangePassword } from '../controllers/otpController.js';

const router = express.Router();

// Route to send OTP
router.post('/send-otp', sendOTPController);

// Route to verify OTP and change password
router.post('/change-password', verifyOTPAndChangePassword);

export default router;
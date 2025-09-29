import express from 'express';
import {
    createRazorpayOrder,
    verifyPayment,
    getPaymentDetails,
    refundPayment
} from '../controllers/paymentController.js';

const router = express.Router();

// Create Razorpay order
router.post('/create-order', createRazorpayOrder);

// Verify payment
router.post('/verify', verifyPayment);

// Get payment details
router.get('/details/:payment_id', getPaymentDetails);

// Process refund
router.post('/refund/:payment_id', refundPayment);

export default router;

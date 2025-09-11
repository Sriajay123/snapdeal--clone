import { instance } from '../index.js';
import crypto from 'crypto';
import Order from '../models/orderSchema.js';

// Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;

        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
            notes: {
                description: 'Snapdeal Order Payment'
            }
        };

        const razorpayOrder = await instance.orders.create(options);

        res.status(200).json({
            success: true,
            order: razorpayOrder,
            key_id: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order',
            error: error.message
        });
    }
};

// Verify Razorpay Payment
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderNumber // Our internal order number
        } = req.body;

        console.log('Payment verification request:', {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderNumber
        });

        // Create signature for verification
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Payment is verified - update order status
            if (orderNumber) {
                const order = await Order.findOne({ orderNumber });
                if (order) {
                    order.paymentInfo.status = 'completed';
                    order.paymentInfo.transactionId = razorpay_payment_id;
                    order.paymentInfo.paymentDate = new Date();
                    order.orderStatus = 'confirmed';
                    
                    // Add to status history
                    order.statusHistory.push({
                        status: 'confirmed',
                        message: 'Payment completed successfully'
                    });

                    await order.save();
                    
                    console.log(`Payment verified and order ${orderNumber} updated`);
                }
            }

            res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                payment_id: razorpay_payment_id
            });

        } else {
            console.log('Payment verification failed - signature mismatch');
            res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }

    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification error',
            error: error.message
        });
    }
};

// Get payment details
export const getPaymentDetails = async (req, res) => {
    try {
        const { payment_id } = req.params;

        const payment = await instance.payments.fetch(payment_id);

        res.status(200).json({
            success: true,
            payment
        });

    } catch (error) {
        console.error('Error fetching payment details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment details',
            error: error.message
        });
    }
};

// Refund payment
export const refundPayment = async (req, res) => {
    try {
        const { payment_id } = req.params;
        const { amount, reason = 'Customer request' } = req.body;

        const refund = await instance.payments.refund(payment_id, {
            amount: amount * 100, // Convert to paise
            notes: {
                reason
            }
        });

        res.status(200).json({
            success: true,
            refund,
            message: 'Refund processed successfully'
        });

    } catch (error) {
        console.error('Error processing refund:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process refund',
            error: error.message
        });
    }
};

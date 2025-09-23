import { useState } from 'react';
import api from '../api/api';

export const useRazorpay = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createOrder = async (amount, orderNumber) => {
        try {
            setLoading(true);
            setError(null);

            // Validate input parameters
            if (!amount || amount <= 0) {
                throw new Error('Invalid amount specified');
            }

            if (!orderNumber) {
                throw new Error('Order number is required');
            }

            const response = await api.post('/api/payment/create-order', {
                amount: Math.round(amount * 100), // Razorpay expects amount in paise
                currency: 'INR',
                receipt: `receipt_${orderNumber}_${Date.now()}`
            });

            if (response.data && response.data.success) {
                console.log('Order created successfully:', response.data);
                return {
                    orderId: response.data.order.id,
                    amount: response.data.order.amount,
                    currency: response.data.order.currency,
                    keyId: response.data.key_id || process.env.RAZORPAY_KEY_ID
                };
            } else {
                throw new Error(response.data?.message || 'Failed to create payment order');
            }
        } catch (error) {
            console.error('Error creating payment order:', error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                setError(`Server Error: ${error.response.data?.message || 'Failed to create order'}`);
                throw new Error(`Server Error: ${error.response.data?.message || 'Failed to create order'}`);
            } else if (error.request) {
                // The request was made but no response was received
                setError('Network Error: Could not reach the payment server');
                throw new Error('Network Error: Could not reach the payment server');
            } else {
                // Something happened in setting up the request that triggered an Error
                setError(error.message || 'Error setting up payment');
                throw error;
            }
        } finally {
            setLoading(false);
        }
    };

    const verifyPayment = async (paymentData, orderNumber) => {
        try {
            setLoading(true);
            setError(null);

            if (!paymentData.razorpay_payment_id || !paymentData.razorpay_order_id || !paymentData.razorpay_signature) {
                throw new Error('Invalid payment data received from Razorpay');
            }

            const response = await api.post('/api/payment/verify', {
                ...paymentData,
                orderNumber,
                amount: paymentData.amount // Include amount for additional verification
            });

            if (!response.data) {
                throw new Error('No response received from server');
            }

            if (response.data.success) {
                return response.data;
            } else {
                throw new Error(response.data.message || 'Payment verification failed');
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
            if (error.response) {
                // Server responded with an error
                setError(error.response.data?.message || 'Payment verification failed on server');
                throw new Error(error.response.data?.message || 'Payment verification failed on server');
            } else if (error.request) {
                // Request was made but no response received
                setError('Unable to reach payment verification server');
                throw new Error('Unable to reach payment verification server');
            } else {
                // Error in request setup
                setError(error.message || 'Error setting up payment verification');
                throw error;
            }
        } finally {
            setLoading(false);
        }
    };

    const initiatePayment = async ({
        amount,
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        onSuccess,
        onFailure
    }) => {
        try {
            // Create Razorpay order
            const orderData = await createOrder(amount, orderNumber);

            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Snapdeal',
                description: `Order #${orderNumber}`,
                order_id: orderData.orderId,
                prefill: {
                    name: customerName,
                    email: customerEmail,
                    contact: customerPhone
                },
                theme: {
                    color: '#e40046'
                },
                handler: async function (response) {
                    try {
                        // Verify that we received all required fields from Razorpay
                        if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
                            throw new Error('Incomplete payment data received from Razorpay');
                        }

                        // Add amount to verification data
                        const verificationData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            amount: orderData.amount // Include original amount for verification
                        };

                        // Verify payment on backend
                        const verificationResult = await verifyPayment(verificationData, orderNumber);

                        if (verificationResult.success) {
                            console.log('Payment successful and verified:', response);
                            if (onSuccess) {
                                onSuccess(response);
                            }
                        } else {
                            throw new Error(verificationResult.message || 'Payment verification failed');
                        }
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        if (onFailure) {
                            onFailure(error);
                        }
                    }
                },
                modal: {
                    ondismiss: function () {
                        console.log('Payment modal closed');
                        if (onFailure) {
                            onFailure(new Error('Payment cancelled by user'));
                        }
                    }
                }
            };

            // Open Razorpay checkout
            if (window.Razorpay) {
                const razorpay = new window.Razorpay(options);
                razorpay.open();
            } else {
                throw new Error('Razorpay SDK not loaded');
            }

        } catch (error) {
            console.error('Error initiating payment:', error);
            if (onFailure) {
                onFailure(error);
            }
        }
    };

    return {
        initiatePayment,
        createOrder,
        verifyPayment,
        loading,
        error
    };
};

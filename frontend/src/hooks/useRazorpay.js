import { useState } from 'react';
import api from '../api/api';

export const useRazorpay = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createOrder = async (amount, orderNumber) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.post('/payment/create-order', {
                amount,
                currency: 'INR',
                receipt: `receipt_${orderNumber}_${Date.now()}`
            });

            if (response.data.success) {
                return {
                    orderId: response.data.order.id,
                    amount: response.data.order.amount,
                    currency: response.data.order.currency,
                    keyId: response.data.key_id
                };
            } else {
                throw new Error('Failed to create payment order');
            }
        } catch (error) {
            console.error('Error creating payment order:', error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const verifyPayment = async (paymentData, orderNumber) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.post('/payment/verify', {
                ...paymentData,
                orderNumber
            });

            if (response.data.success) {
                return response.data;
            } else {
                throw new Error(response.data.message || 'Payment verification failed');
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
            setError(error.message);
            throw error;
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
                        // Verify payment on backend
                        await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }, orderNumber);

                        console.log('Payment successful:', response);
                        if (onSuccess) {
                            onSuccess(response);
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

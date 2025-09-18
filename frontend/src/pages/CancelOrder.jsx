import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

function CancelOrder() {
    const { suborderCode } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedReason, setSelectedReason] = useState('');
    const [comments, setComments] = useState('');
    const [cancellationSuccess, setCancellationSuccess] = useState(false);

    const cancelReasons = [
        "I'll not be able to take delivery",
        "I need to change shipping address",
        "I placed the order by mistake",
        "I'm getting better price elsewhere",
        "I want to change my payment method",
        "Product specifications are different",
        "Other reasons"
    ];

    useEffect(() => {
        fetchOrderDetails();
    }, [suborderCode]);

    const fetchOrderDetails = async () => {
        try {
            const response = await api.get(`/api/orders/order/${suborderCode}`);
            if (response.data.success) {
                setOrder(response.data.order);
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedReason) {
            alert('Please select a reason for cancellation');
            return;
        }

        try {
            const response = await api.put(`/api/orders/${suborderCode}/cancel`, {
                reason: selectedReason,
                comments: comments
            });

            if (response.data.success) {
                setCancellationSuccess(true);
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Failed to cancel order. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e40046]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Navbar />

            {/* Breadcrumb */}
            <div className="bg-white px-4 py-2">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span
                            className="hover:text-[#e40046] cursor-pointer"
                            onClick={() => navigate('/')}
                        >
                            Home
                        </span>
                        <span>›</span>
                        <span
                            className="hover:text-[#e40046] cursor-pointer"
                            onClick={() => navigate('/my-orders')}
                        >
                            My Account
                        </span>
                        <span>›</span>
                        <span
                            className="hover:text-[#e40046] cursor-pointer"
                            onClick={() => navigate('/my-orders')}
                        >
                            My Orders
                        </span>
                        <span>›</span>
                        <span className="text-[#e40046]">Cancel</span>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        {cancellationSuccess ? (
                            <>
                                <div className="mb-8">
                                    {/* Product Info */}
                                    <div className="flex gap-6 mb-6">
                                        <div className="w-24 h-32 bg-gray-100 rounded">
                                            <img
                                                src={order.items[0]?.productDetails?.image || order.items[0]?.product?.image || "https://placehold.co/96x128/f0f0f0/999999/png?text=No+Image"}
                                                alt={order.items[0]?.productDetails?.name || "Product"}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-lg font-medium text-gray-800 mb-2">
                                                {order.items[0]?.productDetails?.name || order.items[0]?.product?.name}
                                            </h2>
                                            <div className="text-sm text-gray-600 mb-1">
                                                Suborder ID: {suborderCode}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Order Placed on: {formatDate(order.createdAt)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cancellation Success Info */}
                                    <div className="flex items-center mb-4">
                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                                                <span className="text-gray-600 text-xs">1</span>
                                            </div>
                                            <span className="text-sm">Reason for Cancellation - I'll not be able to take delivery</span>
                                            <span className="text-blue-500 text-xs ml-2 cursor-pointer">[View]</span>
                                        </div>
                                    </div>

                                    {/* Success Message */}
                                    <div className="flex items-start mb-8">
                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-green-500 font-medium">REQUEST SUCCESSFUL!</h2>
                                            <p className="text-gray-600 text-sm">Thank you! You will receive an email shortly confirming the same.</p>
                                        </div>
                                    </div>

                                    {/* Back Button */}
                                    <button
                                        onClick={() => navigate('/my-orders')}
                                        className="bg-gray-800 text-white px-6 py-2 text-sm font-medium rounded uppercase hover:bg-gray-700 transition-colors"
                                    >
                                        BACK TO MY ORDERS
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="text-2xl font-semibold text-[#e40046] mb-6">CANCEL IN 1 EASY STEP</h1>
                                {order && (
                            <div className="mb-8">
                                {/* Product Info */}
                                <div className="flex gap-6 mb-6">
                                    <div className="w-24 h-32 bg-gray-100 rounded">
                                        <img
                                            src={order.items[0]?.productDetails?.image || order.items[0]?.product?.image || "https://placehold.co/96x128/f0f0f0/999999/png?text=No+Image"}
                                            alt={order.items[0]?.productDetails?.name || "Product"}
                                            className="w-full h-full object-cover rounded"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-lg font-medium text-gray-800 mb-2">
                                            {order.items[0]?.productDetails?.name || order.items[0]?.product?.name}
                                        </h2>
                                        <div className="text-sm text-gray-600 mb-2">
                                            Suborder ID: {suborderCode}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Order Placed on: {formatDate(order.createdAt)}
                                        </div>
                                    </div>
                                </div>

                                {/* Cancellation Reason */}
                                <div className="border-t border-gray-200 pt-6">
                                    <div className="mb-4">
                                        <h3 className="flex items-center text-lg font-medium text-gray-800 mb-4">
                                            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-gray-600">1</span>
                                            Reason for Cancellation
                                        </h3>
                                        
                                        <div className="w-full">
                                            <div className="relative">
                                                <select
                                                    value={selectedReason}
                                                    onChange={(e) => setSelectedReason(e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded text-gray-600 appearance-none focus:outline-none focus:border-[#e40046]"
                                                >
                                                    <option value="">Select Reason</option>
                                                    {cancelReasons.map((reason, index) => (
                                                        <option key={index} value={reason}>
                                                            {reason}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                                            {/* Comments Section - Only shown when reason is selected */}
                                            {selectedReason && (
                                                <div className="mt-6">
                                                    <h3 className="text-lg font-medium text-gray-800 mb-3">Comments:</h3>
                                                    <textarea
                                                        value={comments}
                                                        onChange={(e) => setComments(e.target.value)}
                                                        className="w-full p-3 border border-gray-300 rounded text-gray-600 focus:outline-none focus:border-[#e40046] min-h-[100px]"
                                                        placeholder="Additional comments (optional)"
                                                    />
                                                    
                                                    {/* Submit Button */}
                                                    <div className="mt-6">
                                                        <button
                                                            onClick={handleSubmit}
                                                            className="bg-gray-800 text-white px-8 py-2 rounded font-medium hover:bg-gray-700 transition-colors"
                                                        >
                                                            SUBMIT
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CancelOrder;
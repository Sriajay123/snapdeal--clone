import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Header from "../components/Header";

function OrderDetails() {
    const { orderNumber } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrderDetails();
    }, [orderNumber]);

    const fetchOrderDetails = async () => {
        try {
            const response = await api.get(`/orders/order/${orderNumber}`);
            if (response.data.success) {
                setOrder(response.data.order);
            } else {
                setError('Order not found');
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            setError('Failed to fetch order details');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    const formatLastUpdated = (dateString) => {
        const date = new Date(dateString);
        const time = date.toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
        });
        return `${time}, Today`;
    };

    const calculateEstimatedDelivery = (orderDate) => {
        const order = new Date(orderDate);
        const deliveryStart = new Date(order);
        const deliveryEnd = new Date(order);
        
        deliveryStart.setDate(order.getDate() + 1);
        deliveryEnd.setDate(order.getDate() + 2);
        
        const startDate = deliveryStart.toLocaleDateString('en-IN', { 
            day: '2-digit', 
            month: 'short' 
        });
        const endDate = deliveryEnd.toLocaleDateString('en-IN', { 
            day: '2-digit', 
            month: 'short',
            year: 'numeric'
        });
        
        return `${startDate} - ${endDate}`;
    };

    const calculateTotal = () => {
        if (!order || !order.items) return 993;
        return order.items.reduce((total, item) => {
            const price = item?.productDetails?.price || item?.product?.price || 855;
            const quantity = item?.quantity || 1;
            return total + (price * quantity);
        }, 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e40046]"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button 
                            onClick={() => navigate('/my-orders')}
                            className="bg-[#e40046] text-white px-6 py-2 rounded hover:bg-[#c2003d] transition-colors"
                        >
                            Back to Orders
                        </button>
                    </div>
                </div>
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
                        <span className="text-[#e40046]">Order Details</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6">
                        {/* Header */}
                        <h1 className="text-xl font-bold text-[#e40046] mb-6">ORDER DETAILS</h1>
                        
                        {/* Order Info */}
                        <div className="text-gray-600 text-sm mb-8">
                            Order ID: <span className="font-semibold text-gray-800">{order.orderNumber}</span> ({order.items?.length || 2} Items). Placed On {formatDate(order.createdAt)}
                        </div>

                        {/* Three Column Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            {/* Customer Information */}
                            <div>
                                <h3 className="text-base font-semibold text-gray-800 mb-3">Customer Information</h3>
                                <div className="text-sm text-gray-600">
                                    Email: <span className="text-gray-800">{order.customerEmail || 'sriajaysnipni047@gmail.com'}</span>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <h3 className="text-base font-semibold text-gray-800 mb-3">Payment Method</h3>
                                <div className="text-sm text-gray-800">
                                    {order.paymentMethod || 'Cash on Delivery'}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="text-right">
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Total</span>
                                        <span className="text-lg font-bold text-gray-800">Rs. {calculateTotal()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Delivery Charges</span>
                                        <span className="text-sm font-semibold text-green-600">FREE</span>
                                    </div>
                                    <div className="border-t border-gray-300 pt-2 mt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-800">Payable Amount</span>
                                            <span className="text-lg font-bold text-gray-800">Rs. {calculateTotal()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Items */}
                        <div className="space-y-6">
                            {order.items?.map((item, index) => (
                                <div key={index} className="border border-gray-300 rounded-lg p-6">
                                    {/* Suborder ID */}
                                    <div className="text-sm text-gray-600 mb-4">
                                        Suborder Id: <span className="font-medium text-gray-800">66649697423</span>
                                    </div>
                                    
                                    {/* Product Row */}
                                    <div className="flex items-start gap-4 mb-6">
                                        {/* Product Image */}
                                        <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                            <img
                                                src={item?.productDetails?.image || item?.product?.image || "https://via.placeholder.com/80x80?text=No+Image"}
                                                alt={item?.productDetails?.name || item?.product?.name || "Product"}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                                                }}
                                            />
                                        </div>
                                        
                                        {/* Product Details */}
                                        <div className="flex-1">
                                            <div className="mb-3">
                                                <span className="text-xs text-gray-500 block mb-1">Item {index + 1}</span>
                                                <h4 className="font-medium text-gray-800 text-sm leading-tight">
                                                    {item?.productDetails?.name || item?.product?.name || "Turnx Sports Hockey-01_White-Blue Blue Men's Sports Running ..."}
                                                </h4>
                                            </div>
                                            
                                            <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                                                <span>Size: <span className="font-medium text-gray-800">{item?.productDetails?.selectedSize || item?.selectedSize || '9'}</span></span>
                                                <span>Color: <span className="font-medium text-gray-800">{item?.productDetails?.selectedColor || item?.selectedColor || 'Blue'}</span></span>
                                            </div>
                                            
                                            <div className="flex items-center gap-4">
                                                <button className="border border-gray-400 text-gray-700 px-4 py-1 text-sm rounded hover:bg-gray-50 transition-colors">
                                                    CANCEL
                                                </button>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 bg-black rounded-full"></div>
                                                    <span className="text-sm text-gray-600 hover:underline cursor-pointer">Need help?</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Price */}
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                                Rs. {item?.productDetails?.price || item?.product?.price || 855}
                                                <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Status Section */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="text-sm text-gray-600 mb-1">
                                                    Status: <span className="font-semibold text-green-600">
                                                        Processing Order
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Last updated at {formatLastUpdated(order.createdAt)}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-gray-600">
                                                    Est. Delivery: <span className="font-medium text-gray-800">{calculateEstimatedDelivery(order.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress Tracker */}
                                        <div className="mb-6">
                                            <div className="flex justify-between items-center mb-3">
                                                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                                <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
                                                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                                                <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
                                                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                                                <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
                                                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                                                <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
                                                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                                            </div>
                                            
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>Confirmed</span>
                                                <span>Packed</span>
                                                <span>Shipped</span>
                                                <span>Out For Delivery</span>
                                                <span>Delivered</span>
                                            </div>
                                        </div>

                                        {/* Track Button */}
                                        <div>
                                            <button className="border border-gray-400 text-gray-700 px-6 py-2 text-sm rounded hover:bg-gray-50 transition-colors">
                                                TRACK
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Shipping Information */}
                        <div className="mt-8 bg-gray-100 rounded-lg p-6">
                            <h3 className="text-base font-semibold text-gray-800 mb-4">Shipping Information</h3>
                            <div className="text-sm">
                                <div className="font-medium text-gray-800 mb-2">
                                    {order.customerName || 'Sriajay S'}
                                </div>
                                <div className="text-gray-600 mb-2">
                                    Rajajinagar, Male, Bangalore Urban - 560010, Raichur
                                </div>
                                <div className="text-gray-600 mb-2">
                                    KARNATAKA - 584128
                                </div>
                                <div className="text-gray-600">
                                    Mobile No: <span className="font-medium text-gray-800">{order.customerPhone || '9591933353'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;

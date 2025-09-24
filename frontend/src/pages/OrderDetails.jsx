import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { Link } from "react-router-dom";

function OrderDetails() {
    const { orderNumber } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    let user=localStorage.getItem('user');
     user = JSON.parse(user);

    useEffect(() => {
        const intervalId = setInterval(fetchOrderDetails, 5000); // Refresh every 5 seconds
        fetchOrderDetails();
        
        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [orderNumber]);

    const fetchOrderDetails = async () => {
        try {
            const response = await api.get(`/api/orders/order/${orderNumber}`);
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
        
        const today = new Date();
        const diffTime = Math.abs(today - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        let dateText = "Today";
        if (diffDays === 1) {
            dateText = "Yesterday";
        } else if (diffDays > 1) {
            dateText = date.toLocaleDateString('en-IN', { 
                day: '2-digit', 
                month: 'short' 
            });
        }
        
        return `${time}, ${dateText}`;
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
        if (!order) return 0;
        
        // Use order summary if available, otherwise calculate from items
        if (order.orderSummary?.totalAmount) {
            return order.orderSummary.totalAmount;
        }
        
        if (!order.items) return 0;
        return order.items.reduce((total, item) => {
            const price = item?.productDetails?.price || item?.product?.price || 0;
            const quantity = item?.quantity || 1;
            return total + (price * quantity);
        }, 0);
    };

    const getDeliveryCharges = () => {
        if (order?.orderSummary?.deliveryCharges !== undefined) {
            return order.orderSummary.deliveryCharges;
        }
        return 0; // Default to free delivery
    };

    const getSubtotal = () => {
        if (order?.orderSummary?.subtotal) {
            return order.orderSummary.subtotal;
        }
        return calculateTotal() - getDeliveryCharges();
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
                                <div className="text-sm text-gray-600 space-y-1">
                                 
                                    <div>Email: <span className="text-gray-800">{order.customerInfo?.email || user.email || 'Email not available'}</span></div>
                              
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <h3 className="text-base font-semibold text-gray-800 mb-3">Payment Method</h3>
                                <div className="text-sm text-gray-800">
                                    {order.paymentInfo?.method === 'cod' ? 'Cash on Delivery' :
                                     order.paymentInfo?.method === 'card' ? 'Credit/Debit Card' :
                                     order.paymentInfo?.method === 'upi' ? 'UPI' :
                                     order.paymentInfo?.method === 'netbanking' ? 'Net Banking' :
                                     order.paymentInfo?.method === 'online' ? 'Online Payment' :
                                     order.paymentMethod || 'Cash on Delivery'}
                                </div>
                                {order.paymentInfo?.status && (
                                    <div className="text-xs text-gray-600 mt-1">
                                      
                                     {/* {order.paymentInfo.status.charAt(0).toUpperCase() + order.paymentInfo.status.slice(1)} */}
                                       
                                    </div>
                                )}
                            </div>

                            {/* Order Summary */}
                            <div className="text-right">
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Subtotal</span>
                                        <span className="text-sm font-medium text-gray-800">Rs. {getSubtotal()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Delivery Charges</span>
                                        <span className={`text-sm font-semibold ${getDeliveryCharges() === 0 ? 'text-gray-600' : 'text-gray-800'}`}>
                                            {getDeliveryCharges() === 0 ? 'FREE' : `Rs. ${getDeliveryCharges()}`}
                                        </span>
                                    </div>
                                    <div className="border-t border-gray-300 pt-2 mt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-800">Total Amount</span>
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
                                        Suborder Id: <span className="font-medium text-gray-800">{order.orderNumber}</span>
                                    </div>
                                    
                                    {/* Product Row */}
                                    <div className="flex items-start gap-4 mb-6">
                                        {/* Product Image */}
                                        <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                            <Link to ={`/product/${item?.productDetails?.keyword?.toLowerCase().replace(/\s+/g, '-') || item?.product?.keyword?.toLowerCase().replace(/\s+/g, '-')}/${item?.productDetails?._id || item?.product?._id}`}>
                                            <img
                                                src={item?.productDetails?.image || item?.product?.images[0] || "https://placehold.co/80x80/f0f0f0/999999/png?text=No+Image"}
                                                alt={item?.productDetails?.name || item?.product?.name || "Product"}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = "https://placehold.co/80x80/f0f0f0/999999/png?text=No+Image";
                                                }}
                                            />
                                            </Link>
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
                                {(item?.productDetails?.selectedSize || item?.selectedSize) && (
                                    <span>Size: <span className="font-medium text-gray-800">{item?.productDetails?.selectedSize || item?.selectedSize}</span></span>
                                )}
                                {(item?.productDetails?.selectedColor || item?.selectedColor) && (
                                    <span>Color: <span className="font-medium text-gray-800">{item?.productDetails?.selectedColor || item?.selectedColor}</span></span>
                                )}
                            </div>                                            <div className="flex items-center gap-4">
                                                <button 
                                                    onClick={() => navigate(`/myorders/cancelOrder/${order.orderNumber}`)}
                                                    className="border border-gray-400 text-gray-700 px-4 py-1 text-sm rounded hover:bg-gray-50 transition-colors"
                                                    disabled={['cancelled', 'delivered'].includes(order.orderStatus)}
                                                >
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
                                                    Status: <span className={`font-semibold uppercase ${
                                                        order.orderStatus === 'delivered' ? 'text-green-600' :
                                                        order.orderStatus === 'cancelled' ? 'text-green-600' :
                                                        order.orderStatus === 'shipped' ? 'text-green-600' :
                                                        'text-green-600'
                                                    }`}>
                                                        {order.orderStatus === 'cancelled' ? 'ORDER CANCELLED' : 
                                                         order.orderStatus === 'delivered' ? 'ORDER DELIVERED' :
                                                         order.orderStatus === 'shipped' ? 'ORDER SHIPPED' :
                                                         order.orderStatus === 'packed' ? 'ORDER PACKED' :
                                                         order.orderStatus === 'out_for_delivery' ? 'OUT FOR DELIVERY' :
                                                         'ORDER CONFIRMED'}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Last updated at {formatLastUpdated(order.updatedAt || order.statusHistory?.[order.statusHistory.length - 1]?.date || order.createdAt)}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {order.orderStatus === 'cancelled' ? (
                                                    <div className="text-sm text-red-600">
                                                        Cancelled: <span className="font-medium">{formatDate(order.updatedAt || order.statusHistory?.[order.statusHistory.length - 1]?.date || order.createdAt)}</span>
                                                    </div>
                                                ) : order.orderStatus === 'delivered' ? (
                                                    <div className="text-sm text-green-600">
                                                        Delivered: <span className="font-medium">{formatDate(order.updatedAt || order.statusHistory?.[order.statusHistory.length - 1]?.date || order.createdAt)}</span>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-gray-600">
                                                        Est. Delivery: <span className="font-medium text-gray-800">{calculateEstimatedDelivery(order.createdAt)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Progress Tracker */}
                                        <div className="mb-6">
                                            <div className="flex justify-between items-center mb-3">
                                                {/* Confirmed */}
                                                <div className={`w-4 h-4 rounded-full ${
                                                    order.orderStatus === 'cancelled' ? 'bg-red-500' : 'bg-green-500'
                                                }`}></div>
                                                
                                                {/* Line to Packed */}
                                                <div className={`flex-1 h-0.5 ${
                                                    ['packed', 'shipped', 'out_for_delivery', 'delivered'].includes(order.orderStatus) 
                                                    ? 'bg-green-500' : 'bg-gray-300'
                                                } mx-2`}></div>
                                                
                                                {/* Packed */}
                                                <div className={`w-4 h-4 rounded-full ${
                                                    ['packed', 'shipped', 'out_for_delivery', 'delivered'].includes(order.orderStatus)
                                                    ? 'bg-green-500' : 'bg-gray-300'
                                                }`}></div>
                                                
                                                {/* Line to Shipped */}
                                                <div className={`flex-1 h-0.5 ${
                                                    ['shipped', 'out_for_delivery', 'delivered'].includes(order.orderStatus)
                                                    ? 'bg-green-500' : 'bg-gray-300'
                                                } mx-2`}></div>
                                                
                                                {/* Shipped */}
                                                <div className={`w-4 h-4 rounded-full ${
                                                    ['shipped', 'out_for_delivery', 'delivered'].includes(order.orderStatus)
                                                    ? 'bg-green-500' : 'bg-gray-300'
                                                }`}></div>
                                                
                                                {/* Line to Out For Delivery */}
                                                <div className={`flex-1 h-0.5 ${
                                                    ['out_for_delivery', 'delivered'].includes(order.orderStatus)
                                                    ? 'bg-green-500' : 'bg-gray-300'
                                                } mx-2`}></div>
                                                
                                                {/* Out For Delivery */}
                                                <div className={`w-4 h-4 rounded-full ${
                                                    ['out_for_delivery', 'delivered'].includes(order.orderStatus)
                                                    ? 'bg-green-500' : 'bg-gray-300'
                                                }`}></div>
                                                
                                                {/* Line to Delivered */}
                                                <div className={`flex-1 h-0.5 ${
                                                    order.orderStatus === 'delivered'
                                                    ? 'bg-green-500' : 'bg-gray-300'
                                                } mx-2`}></div>
                                                
                                                {/* Delivered */}
                                                <div className={`w-4 h-4 rounded-full ${
                                                    order.orderStatus === 'delivered'
                                                    ? 'bg-green-500' : 'bg-gray-300'
                                                }`}></div>
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
                                    {order.shippingAddress?.fullName || order.customerInfo?.name || order.customerName || 'Name not available'}
                                </div>
                                <div className="text-gray-600 mb-2">
                                    {order.shippingAddress?.addressLine1 || 'Address not available'}
                                    {order.shippingAddress?.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                                </div>
                                <div className="text-gray-600 mb-2">
                                    {order.shippingAddress?.city || 'City not available'}, {order.shippingAddress?.state || 'State not available'} - {order.shippingAddress?.pincode || 'Pincode not available'}
                                </div>
                                <div className="text-gray-600">
                                    Mobile No: <span className="font-medium text-gray-800">
                                        {order.shippingAddress?.phone || order.customerInfo?.phone || order.customerPhone || 'Phone not available'}
                                    </span>
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

 import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Header from "../components/Header";

function MyOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customerPhone, setCustomerPhone] = useState("+919591933353"); // Default phone for demo

    useEffect(() => {
        // Try to get phone from user data if logged in
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user.phone) {
                    setCustomerPhone(user.phone);
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
        fetchOrders();
    }, [customerPhone]);

    const fetchOrders = async () => {
        try {
            console.log("Fetching orders for phone:", customerPhone);
            const response = await api.get(`/orders/customer/${customerPhone}`);
            console.log("Orders response:", response.data);
            
            if (response.data.success) {
                setOrders(response.data.orders);
                console.log("Orders set:", response.data.orders);
                
                // Detailed debugging for each order
                response.data.orders.forEach((order, index) => {
                    console.log(`Order ${index}:`, order);
                    console.log(`Order ${index} items:`, order.items);
                    if (order.items && order.items.length > 0) {
                        console.log(`Order ${index} first item:`, order.items[0]);
                        console.log(`Order ${index} first item productDetails:`, order.items[0].productDetails);
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
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
        const orderDate = new Date(dateString);
        
        const diffTime = Math.abs(today - orderDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        let dateText = "Today";
        if (diffDays === 1) {
            dateText = "Yesterday";
        } else if (diffDays > 1) {
            dateText = orderDate.toLocaleDateString('en-IN', { 
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
        
        deliveryStart.setDate(order.getDate() + 1); // Next day
        deliveryEnd.setDate(order.getDate() + 2); // Day after next
        
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e40046]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Header */}
             <Header/>
             <Navbar/>
             

            {/* Breadcrumb */}
            <div className="bg-white rounded-sm ml-33 w-[998px] px-4 py-2">
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
                            onClick={() => navigate(0)}
                        >
                            My Account
                        </span>
                        <span>›</span>
                        <span className="text-[#e40046]">My Orders</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded">
                            {/* My Account Section */}
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-[#e40046] mb-4">MY ACCOUNT</h2>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
                                        <i className="fas fa-user text-white text-lg"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">Sri Ajay S</h3>
                                        <p className="text-sm text-gray-500">sriajaysnipni047@gmail.com</p>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-gray-600">
                                    You might be logged in on other devices. To sign out from all devices{' '}
                                    <span className="text-blue-600 cursor-pointer font-medium">CLICK HERE</span>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="p-6">
                                {/* Orders Section */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 text-gray-700 mb-3">
                                        <i className="fas fa-shopping-bag text-gray-600"></i>
                                        <span className="font-medium">ORDERS</span>
                                    </div>
                                    <div className="ml-6">
                                        <div className="text-sm text-[#e40046] font-medium cursor-pointer">Orders</div>
                                    </div>
                                </div>

                                {/* Profile Section */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 text-gray-700 mb-3">
                                        <i className="fas fa-user text-gray-600"></i>
                                        <span className="font-medium">PROFILE</span>
                                    </div>
                                    <div className="ml-6 space-y-2">
                                        <div className="text-sm text-gray-600 cursor-pointer hover:text-[#e40046]">Saved Addresses</div>
                                        <div className="text-sm text-gray-600 cursor-pointer hover:text-[#e40046]">Saved Cards</div>
                                        <div className="text-sm text-gray-600 cursor-pointer hover:text-[#e40046]">Change Password</div>
                                    </div>
                                </div>

                                {/* Payments Section */}
                                <div>
                                    <div className="flex items-center gap-2 text-gray-700 mb-3">
                                        <i className="fas fa-credit-card text-gray-600"></i>
                                        <span className="font-medium">PAYMENTS</span>
                                    </div>
                                    <div className="ml-6">
                                        <div className="text-sm text-gray-600 cursor-pointer hover:text-[#e40046]">E-Gift Voucher Balance</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Orders */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded">
                            <div className="bg-gray-50 px-6 py-4">
                                <h2 className="text-xl font-bold text-gray-800">MY ORDERS</h2>
                            </div>

                            <div className="p-6">
                                {orders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <i className="fas fa-shopping-bag text-4xl text-gray-300 mb-4"></i>
                                        <p className="text-gray-600 text-lg mb-2">No orders found</p>
                                        <p className="text-gray-500 text-sm mb-4">Start shopping to see your orders here!</p>
                                        <button 
                                            onClick={() => navigate('/')}
                                            className="bg-[#e40046] text-white px-6 py-2 rounded hover:bg-[#c2003d] transition-colors"
                                        >
                                            Start Shopping
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {orders.map((order, orderIndex) => (
                                            <div key={order._id} className="space-y-4">
                                                {/* Single Order Header */}
                                                <div className="bg-white rounded-lg shadow-sm">
                                                    <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-800 text-lg">
                                                                Order ID: {order.orderNumber} ({(order.items && order.items.length) || 0} Items)
                                                            </h3>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                Placed on {formatDate(order.createdAt)}
                                                            </p>
                                                        </div>
                                                        <button 
                                                            onClick={() => navigate(`/order-details/${order.orderNumber}`)}
                                                            className="bg-gray-700 text-white px-6 py-2 text-sm font-semibold rounded hover:bg-gray-800 transition-colors"
                                                        >
                                                            DETAILS
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Separate Product Cards */}
                                                {order.items && order.items.length > 0 ? (
                                                    order.items.map((item, itemIndex) => (
                                                        <div key={`${order._id}-${itemIndex}`} className="bg-white rounded-lg shadow-sm">
                                                            {/* Product Content */}
                                                            <div className="p-6">
                                                                <div className="flex gap-4 mb-6">
                                                                    {/* Product Image */}
                                                                    <div className="w-24 h-24 rounded bg-white flex-shrink-0 overflow-hidden">
                                                                        <img
                                                                            src={item?.productDetails?.image || item?.product?.image || "https://via.placeholder.com/96x96?text=No+Image"}
                                                                            alt={item?.productDetails?.name || item?.product?.name || "Product"}
                                                                            className="w-full h-full object-cover"
                                                                            onError={(e) => {
                                                                                e.target.src = "https://via.placeholder.com/96x96?text=No+Image";
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    
                                                                    {/* Product Details */}
                                                                    <div className="flex-1">
                                                                        <div className="mb-2">
                                                                            <span className="text-sm text-gray-500 block">Item {itemIndex + 1}</span>
                                                                            <h4 className="font-medium text-gray-800 text-lg mt-1">
                                                                                {item?.productDetails?.name || item?.product?.name || "Product Name"}
                                                                            </h4>
                                                                        </div>
                                                                        
                                                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                                            {(item?.productDetails?.selectedSize || item?.selectedSize) && (
                                                                                <span>Size: <span className="font-medium text-gray-800">{item?.productDetails?.selectedSize || item?.selectedSize}</span></span>
                                                                            )}
                                                                            {(item?.productDetails?.selectedColor || item?.selectedColor) && (
                                                                                <span>Color: <span className="font-medium text-gray-800">{item?.productDetails?.selectedColor || item?.selectedColor}</span></span>
                                                                            )}
                                                                        </div>
                                                                        
                                                                        <div className="flex items-center gap-4">
                                                                            <button className="text-gray-700 px-4 py-2 text-sm font-medium rounded hover:bg-gray-50 transition-colors">
                                                                                CANCEL
                                                                            </button>
                                                                            <div className="flex items-center gap-2">
                                                                                <i className="fas fa-question-circle text-gray-400 text-sm"></i>
                                                                                <span className="text-sm text-blue-600 cursor-pointer hover:underline">Need help?</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Order Status Section */}
                                                                <div className="bg-white pt-6 border-t border-gray-100">
                                                                    <div className="flex justify-between items-start mb-4">
                                                                        <div>
                                                                            <div className="text-sm text-gray-600 mb-1">
                                                                                Status: <span className={`font-semibold uppercase ${
                                                                                    order.orderStatus === 'delivered' ? 'text-green-600' :
                                                                                    order.orderStatus === 'cancelled' ? 'text-red-600' :
                                                                                    order.orderStatus === 'shipped' ? 'text-blue-600' :
                                                                                    'text-green-600'
                                                                                }`}>
                                                                                    {order.orderStatus === 'cancelled' ? 'ORDER CANCELLED' : 
                                                                                     order.orderStatus === 'delivered' ? 'ORDER DELIVERED' :
                                                                                     order.orderStatus === 'shipped' ? 'ORDER SHIPPED' :
                                                                                     'ORDER CONFIRMED'}
                                                                                </span>
                                                                            </div>
                                                                            <div className="text-xs text-gray-500">
                                                                                Last updated at {formatLastUpdated(order.createdAt)}
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <div className="text-sm text-gray-600">
                                                                                Est. Delivery: <span className="font-medium">{calculateEstimatedDelivery(order.createdAt)}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Progress Indicator */}
                                                                    <div className="relative mb-6">
                                                                        {/* Progress Line Background */}
                                                                        <div className="absolute top-2 left-0 right-0 h-0.5 bg-gray-200"></div>
                                                                        
                                                                        {/* Progress Line Fill */}
                                                                        <div 
                                                                            className={`absolute top-2 left-0 h-0.5 ${
                                                                                order.orderStatus === 'delivered' ? 'bg-green-500' :
                                                                                order.orderStatus === 'cancelled' ? 'bg-red-500' :
                                                                                order.orderStatus === 'shipped' ? 'bg-blue-500' :
                                                                                'bg-green-500'
                                                                            }`}
                                                                            style={{ 
                                                                                width: order.orderStatus === 'cancelled' || order.orderStatus === 'delivered' ? '100%' : 
                                                                                       order.orderStatus === 'shipped' ? '50%' :
                                                                                       '0%' 
                                                                            }}
                                                                        ></div>
                                                                        
                                                                        {/* Progress Points */}
                                                                        <div className="flex justify-between items-center relative">
                                                                            {/* Placed */}
                                                                            <div className={`w-4 h-4 rounded-full border-2 ${
                                                                                order.orderStatus !== 'cancelled' ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-500'
                                                                            } flex items-center justify-center`}>
                                                                            </div>
                                                                            
                                                                            {/* Packed */}
                                                                            <div className={`w-4 h-4 rounded-full border-2 ${
                                                                                ['packed', 'shipped', 'delivered'].includes(order.orderStatus) 
                                                                                ? 'bg-gray-500 border-gray-500' : 'bg-gray-200 border-gray-300'
                                                                            } flex items-center justify-center`}>
                                                                            </div>
                                                                            
                                                                            {/* Shipped */}
                                                                            <div className={`w-4 h-4 rounded-full border-2 ${
                                                                                ['shipped', 'delivered'].includes(order.orderStatus) 
                                                                                ? 'bg-blue-500 border-blue-500' : 'bg-gray-200 border-gray-300'
                                                                            } flex items-center justify-center`}>
                                                                            </div>
                                                                            
                                                                            {/* Out For Delivery */}
                                                                            <div className={`w-4 h-4 rounded-full border-2 ${
                                                                                ['out_for_delivery', 'delivered'].includes(order.orderStatus) 
                                                                                ? 'bg-blue-500 border-blue-500' : 'bg-gray-200 border-gray-300'
                                                                            } flex items-center justify-center`}>
                                                                            </div>
                                                                            
                                                                            {/* Delivered */}
                                                                            <div className={`w-4 h-4 rounded-full border-2 ${
                                                                                order.orderStatus === 'delivered' ? 'bg-gray-600 border-gray-600' : 'bg-gray-200 border-gray-300'
                                                                            } flex items-center justify-center`}>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        {/* Labels */}
                                                                        <div className="flex justify-between mt-3 text-xs text-gray-500">
                                                                            <span>Placed</span>
                                                                            <span>Packed</span>
                                                                            <span>Shipped</span>
                                                                            <span>Out For Delivery</span>
                                                                            <span>Delivered</span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Action Button */}
                                                                    <div className="flex justify-start">
                                                                        <button className="text-gray-700 px-6 py-2 text-sm font-medium rounded hover:bg-gray-50 transition-colors">
                                                                            TRACK
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="bg-white rounded-lg shadow-sm">
                                                        <div className="text-center py-8 text-gray-500">
                                                            <p>No items found in this order</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyOrders;

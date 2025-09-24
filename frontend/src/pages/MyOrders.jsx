import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import PaymentFooter from "../components/PaymentFooter.jsx";
import ContentFooter from "../components/ContentFooter.jsx";
import CustomerTrustSection from "../components/CustomerTrustSection.jsx";

// Constants
const ORDERS_PER_PAGE = 4;

function MyOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllOrders, setShowAllOrders] = useState(false);
    const [customerPhone, setCustomerPhone] = useState("");
    let user = localStorage.getItem('user');
    user = JSON.parse(user);
    
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
            const response = await api.get(`/api/orders/customer/${customerPhone}`);
            console.log("Orders response:", response.data);

            if (response.data.success) {
                // Sort orders by date (newest first)
                const sortedOrders = response.data.orders.sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setOrders(sortedOrders);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e40046]"></div>
            </div>
        );
    }

    return (
        <>
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Navbar />

            <div className="bg-white rounded-sm ml-33 w-[998px] px-4 py-2">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="hover:text-[#e40046] cursor-pointer" onClick={() => navigate('/')}>
                            Home
                        </span>
                        <span>/</span>
                        <span className="hover:text-[#e40046] cursor-pointer" onClick={() => navigate(0)}>
                            My Account
                        </span>
                        <span>/</span>
                        <span className="text-[#e40046]">My Orders</span>
                    </div>
                </div>
            </div>
            {/*Sidebar and Orders Section */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded">
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-[#e40046] mb-4">MY ACCOUNT</h2>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
                                        <i className="fas fa-user text-white text-lg"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">{user.name}</h3>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-gray-600">
                                    You might be logged in on other devices. To sign out from all devices{' '}
                                    <span className="text-blue-600 cursor-pointer font-medium">CLICK HERE</span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 text-gray-700 mb-3">
                                        <i className="fas fa-shopping-bag text-gray-600"></i>
                                        <span className="font-medium">ORDERS</span>
                                    </div>
                                    <div className="ml-6">
                                        <div className="text-sm text-[#e40046] font-medium cursor-pointer">Orders</div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-center gap-2 text-gray-700 mb-3">
                                        <i className="fas fa-user text-gray-600"></i>
                                        <span className="font-medium">PROFILE</span>
                                    </div>
                                    <div className="ml-6 space-y-2">
                                        <Link to="/saved-addresses">
                                            <div className="text-sm text-gray-600 cursor-pointer hover:text-[#e40046]">
                                                Saved Addresses
                                            </div>
                                        </Link>
                                        <Link to ="/saved-cards">
                                        <div className="text-sm text-gray-600 cursor-pointer hover:text-[#e40046]">
                                            Saved Cards
                                        </div>
                                        </Link>
                                        <Link to ="/change-password">
                                        <div className="text-sm text-gray-600 cursor-pointer hover:text-[#e40046]">
                                            Change Password
                                        </div>
                                        </Link>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-gray-700 mb-3">
                                        <i className="fas fa-credit-card text-gray-600"></i>
                                        <span className="font-medium">PAYMENTS</span>
                                    </div>
                                    <div className="ml-6">
                                        <Link to ="/egift-voucher-balance">
                                        <div className="text-sm text-gray-600 cursor-pointer hover:text-[#e40046]">
                                            E-Gift Voucher Balance
                                        </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

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
                                        {(showAllOrders ? orders.slice(ORDERS_PER_PAGE) : orders.slice(0, ORDERS_PER_PAGE)).map((order, orderIndex) => (
                                            <div key={order._id} className="space-y-4">
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

                                                {order.items && order.items.length > 0 ? (
                                                    order.items.map((item, itemIndex) => (
                                                        <div key={`${order._id}-${itemIndex}`} className="bg-white rounded-lg shadow-sm">
                                                            <div className="p-6">
                                                                <div className="flex gap-4 mb-6">
                                                                    <div className="w-24 h-24 rounded bg-white flex-shrink-0 overflow-hidden">
                                                                        <Link to ={`/product/${item?.productDetails?.keyword?.toLowerCase().replace(/\s+/g, '-') || item?.product?.keyword?.toLowerCase().replace(/\s+/g, '-')}/${item?.productDetails?._id || item?.product?._id}`}>
                                                                        <img
                                                                            src={item?.productDetails?.image || item?.product?.images[0] || "https://placehold.co/96x96/f0f0f0/999999/png?text=No+Image"}
                                                                            alt={item?.productDetails?.name || item?.product?.name || "Product"}
                                                                            className="w-full h-full object-cover"
                                                                            onError={(e) => {
                                                                                e.target.src = "https://placehold.co/96x96/f0f0f0/999999/png?text=No+Image";
                                                                            }}
                                                                        />
                                                                        </Link>
                                                                    </div>

                                                                    <div className="flex-1">
                                                                        <div className="mb-2">
                                                                            <span className="text-sm text-gray-500 block">Item {itemIndex + 1}</span>
                                                                            <h4 className="font-medium text-gray-800 text-lg mt-1">
                                                                                {item?.productDetails?.name || item?.product?.name || "Product Name"}
                                                                            </h4>
                                                                        </div>

                                                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                                            {(item?.productDetails?.selectedSize || item?.selectedSize) && (
                                                                                <span>Size: <span className="font-medium text-gray-800">
                                                                                    {item?.productDetails?.selectedSize || item?.selectedSize}
                                                                                </span></span>
                                                                            )}
                                                                            {(item?.productDetails?.selectedColor || item?.selectedColor) && (
                                                                                <span>Color: <span className="font-medium text-gray-800">
                                                                                    {item?.productDetails?.selectedColor || item?.selectedColor}
                                                                                </span></span>
                                                                            )}
                                                                        </div>

                                                                        <div className="flex items-center gap-4">
                                                                            <button 
                                                                                onClick={() => navigate(`/myorders/cancelOrder/${order.orderNumber}`)}
                                                                                className="text-gray-700 px-4 py-2 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
                                                                                disabled={['cancelled', 'delivered'].includes(order.orderStatus)}
                                                                            >
                                                                                CANCEL
                                                                            </button>
                                                                            <div className="flex items-center gap-2">
                                                                                <i className="fas fa-question-circle text-gray-400 text-sm"></i>
                                                                                <span className="text-sm text-blue-600 cursor-pointer hover:underline">
                                                                                    Need help?
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="bg-white pt-6 border-t border-gray-100">
                                                                    <div className="flex justify-between items-start mb-4">
                                                                        <div>
                                                                            <div className="text-md text-[#817c80] mb-1">
                                                                                Status: <span className={`font-semibold uppercase ${
                                                                                    order.orderStatus === 'delivered' ? 'text-green-600' :
                                                                                    order.orderStatus === 'cancelled' ? 'text-green-600' :
                                                                                    order.orderStatus === 'shipped' ? 'text-green-600' :
                                                                                    order.orderStatus === 'out_for_delivery' ? 'text-green-600' :
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
                                                                                Last updated at {formatLastUpdated(
                                                                                    order.updatedAt || 
                                                                                    order.statusHistory?.[order.statusHistory.length - 1]?.date || 
                                                                                    order.createdAt
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            {order.orderStatus === 'cancelled' ? (
                                                                                <div className="text-md text-[#817c80]">
                                                                                    Cancelled: <span className="font-medium text-green-600">
                                                                                        {formatDate(order.updatedAt || order.statusHistory?.[order.statusHistory.length - 1]?.date || order.createdAt)}
                                                                                    </span>
                                                                                </div>
                                                                            ) : order.orderStatus === 'delivered' ? (
                                                                                <div className="text-md text-[#817c80]">
                                                                                    Delivered: <span className="font-medium text-green-600">
                                                                                        {formatDate(order.updatedAt || order.statusHistory?.[order.statusHistory.length - 1]?.date || order.createdAt)}
                                                                                    </span>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="text-sm text-gray-600">
                                                                                    Est. Delivery: <span className="font-medium">
                                                                                        {calculateEstimatedDelivery(order.createdAt)}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <div className="mb-6">
                                                                        {order.orderStatus === 'cancelled' ? (
                                                                            <>
                                                                                <div className="flex justify-between items-center mb-3">
                                                                                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                                                                    <div className="flex-1 h-0.5 bg-green-500 mx-2"></div>
                                                                                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                                                                </div>
                                                                                <div className="flex justify-between text-xs">
                                                                                    <span className="text-gray-500">Confirmed</span>
                                                                                    <span className="text-gray-500">Cancelled</span>
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <div className="flex justify-between items-center mb-3">
                                                                                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                                                                    <div className={`flex-1 h-0.5 ${['packed', 'shipped', 'out_for_delivery', 'delivered'].includes(order.orderStatus) ? 'bg-green-500' : 'bg-gray-300'} mx-2`}></div>
                                                                                    <div className={`w-4 h-4 rounded-full ${['packed', 'shipped', 'out_for_delivery', 'delivered'].includes(order.orderStatus) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                                                    <div className={`flex-1 h-0.5 ${['shipped', 'out_for_delivery', 'delivered'].includes(order.orderStatus) ? 'bg-green-500' : 'bg-gray-300'} mx-2`}></div>
                                                                                    <div className={`w-4 h-4 rounded-full ${['shipped', 'out_for_delivery', 'delivered'].includes(order.orderStatus) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                                                    <div className={`flex-1 h-0.5 ${['out_for_delivery', 'delivered'].includes(order.orderStatus) ? 'bg-green-500' : 'bg-gray-300'} mx-2`}></div>
                                                                                    <div className={`w-4 h-4 rounded-full ${['out_for_delivery', 'delivered'].includes(order.orderStatus) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                                                    <div className={`flex-1 h-0.5 ${order.orderStatus === 'delivered' ? 'bg-green-500' : 'bg-gray-300'} mx-2`}></div>
                                                                                    <div className={`w-4 h-4 rounded-full ${order.orderStatus === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                                                </div>
                                                                                <div className="flex justify-between text-xs text-gray-500">
                                                                                    <span>Confirmed</span>
                                                                                    <span>Packed</span>
                                                                                    <span>Shipped</span>
                                                                                    <span>Out For Delivery</span>
                                                                                    <span>Delivered</span>
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>

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
                                        
                                        {/* Pagination Buttons */}
                                        {orders.length > ORDERS_PER_PAGE && orders.slice(ORDERS_PER_PAGE).length > 0 && (
                                            <div className="flex justify-center space-x-4 mt-8">
                                                <button
                                                    onClick={() => {
                                                        setShowAllOrders(false);
                                                        window.scrollTo(0, 0);
                                                    }}
                                                    className={`px-6 py-2 border border-gray-300 rounded text-gray-700 ${
                                                        !showAllOrders ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                                                    }`}
                                                    disabled={!showAllOrders}
                                                >
                                                    NEWER
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowAllOrders(true);
                                                        window.scrollTo(0, 0);
                                                    }}
                                                    className={`px-6 py-2 border border-gray-300 rounded text-gray-700 ${
                                                        showAllOrders ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                                                    }`}
                                                    disabled={showAllOrders}
                                                >
                                                    OLDER
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen mt-10">
            <CustomerTrustSection/>
            <ContentFooter/>
            <PaymentFooter/>
            <div className='bg-white w-full  h-11 flex  items-center justify-between  text-xs text-[#949aa2] '>
          <span className=' mt-3 ml-10'>Copyright © 2021, Snapdeal Limited. All Rights Reserved</span>
          <span className='mr-15' >Made for Bharat 
           <i className="fa-solid fa-heart text-red-500 hover:scale-125 transition-transform duration-300 ml-2"></i>
            </span>
             </div> 
        </div>


    </>
    );
}

export default MyOrders;
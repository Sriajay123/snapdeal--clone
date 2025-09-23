import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import PaymentFooter from "../components/PaymentFooter.jsx";
import ContentFooter from "../components/ContentFooter.jsx";
import CustomerTrustSection from "../components/CustomerTrustSection.jsx";

function SavedCards() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white rounded-sm ml-33 w-[998px] px-4 py-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-[#e40046] cursor-pointer">
              Home
            </Link>
            <span>/</span>
            <Link to="/my-orders" className="hover:text-[#e40046] cursor-pointer">
              My Account
            </Link>
            <span>/</span>
            <span className="text-[#e40046]">My Cards</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded">
              {/* My Account Section */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-[#e40046] mb-4">MY ACCOUNT</h2>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-white text-lg"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{user?.name}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
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
                    <Link to="/my-orders" className="text-sm text-gray-600 hover:text-[#e40046]">Orders</Link>
                  </div>
                </div>

                {/* Profile Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-gray-700 mb-3">
                    <i className="fas fa-user text-gray-600"></i>
                    <span className="font-medium">PROFILE</span>
                  </div>
                  <div className="ml-6 space-y-2">
                    <Link to="/saved-addresses" className="block text-sm text-gray-600 hover:text-[#e40046] cursor-pointer">Saved Addresses</Link>
                    <Link to="/saved-cards" className="block text-sm text-[#e40046] cursor-pointer">Saved Cards</Link>
                    <Link to="/change-password" className="block text-sm text-gray-600 hover:text-[#e40046] cursor-pointer">Change Password</Link>
                  </div>
                </div>

                {/* Payments Section */}
                <div>
                  <div className="flex items-center gap-2 text-gray-700 mb-3">
                    <i className="fas fa-credit-card text-gray-600"></i>
                    <span className="font-medium">PAYMENTS</span>
                  </div>
                  <div className="ml-6">
                 <Link to ="/egift-voucher-balance"><div className="text-sm text-gray-600 cursor-pointer hover:text-[#e40046]">E-Gift Voucher Balance</div></Link>  
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="bg-white rounded">
              <div className="p-6">
                <div className="flex-1">
                  <h1 className="text-black text-lg font-medium mb-8 border-b border-gray-300">SAVED CARDS</h1>
              
                  <div className="text-gray-800">
                    You do not have any saved cards
                  </div>
                </div>
              </div>
            </div>

            {/* Saved VPAs Section */}
            <div className="bg-white rounded mt-6">
              <div className="p-6">
                <h2 className="text-black text-lg font-medium mb-6 border-b border-gray-300">SAVED VPAs</h2>
                <div className="text-gray-800">
                  You have no saved VPAs
                </div>
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

export default SavedCards;
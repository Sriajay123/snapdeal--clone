import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import PaymentFooter from "../components/PaymentFooter.jsx";
import ContentFooter from "../components/ContentFooter.jsx";
import CustomerTrustSection from "../components/CustomerTrustSection.jsx";

function SavedAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }

    // TODO: Fetch addresses from backend
    // For now, using dummy data
    setAddresses([
      {
        id: 1,
        name: 'Sriajay S',
        street: 'Kakatiya block',
        locality: 'Devanandhi...',
        city: 'Karnataka',
        pincode: '562110',
        phone: '8073929394',
        type: 'home'
      },
      {
        id: 2,
        name: 'Sriajay S',
        street: 'Pagadhini',
        locality: 'Raichur',
        city: 'KARNATAKA',
        pincode: '584128',
        phone: '9591933333',
        type: 'office'
      }
    ]);
  }, []);

  return (
    <>
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex text-sm">
            <Link to="/" className="text-gray-600 hover:text-[#e40046]">Home</Link>
            <span className="mx-2 text-gray-500">/</span>
            <Link to="/my-orders" className="text-gray-600 hover:text-[#e40046]">My Account</Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-800">My Address</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
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
                    <Link to="/saved-addresses" className="block text-sm text-[#e40046] cursor-pointer">Saved Addresses</Link>
                    <Link to="/saved-cards" className="block text-sm text-gray-600 hover:text-[#e40046] cursor-pointer">Saved Cards</Link>
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
                 <Link to ="/egift-voucher-balance">  <div className="text-sm text-gray-600 cursor-pointer hover:text-[#e40046]">E-Gift Voucher Balance</div></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="bg-white p-6 rounded shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl">SAVED ADDRESSES</h1>
               
              </div>

              {/* Addresses Grid */}
              <div className="grid grid-cols-2 gap-6">
                {addresses.map(address => (
                  <div key={address.id} className="border rounded p-4 relative">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{address.name}</span>
                      <span className="text-xs text-gray-500 uppercase bg-gray-100 px-2 py-1 rounded">
                        {address.type}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{address.street}</p>
                      <p>{address.locality}</p>
                      <p>{address.city}</p>
                      <p>Pin Code: {address.pincode}</p>
                      <p>Phone: {address.phone}</p>
                    </div>
                    <div className="absolute bottom-4 right-4 space-x-4">
                      <button className="text-gray-500 hover:text-gray-700">
                        <i className="far fa-trash-alt"></i> Delete
                      </button>
                      <button className="text-gray-500 hover:text-gray-700">
                        <i className="far fa-edit"></i> Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Address Button */}
              <div className="mt-6">
                <button className="w-full bg-[#e40046] text-white py-3 rounded hover:bg-[#d10042] transition-colors">
                  ADD NEW ADDRESS
                </button>
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

export default SavedAddresses;
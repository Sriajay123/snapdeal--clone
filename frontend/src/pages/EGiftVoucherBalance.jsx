import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import PaymentFooter from "../components/PaymentFooter.jsx";
import ContentFooter from "../components/ContentFooter.jsx";
import CustomerTrustSection from "../components/CustomerTrustSection.jsx";

function EGiftVoucherBalance() {
  const [user, setUser] = useState(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherPin, setVoucherPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showForgotPinPopup, setShowForgotPinPopup] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleCheckBalance = (e) => {
    e.preventDefault();
    // TODO: Implement balance check logic
  };

  const handleForgotPin = () => {
    // TODO: Implement forgot PIN logic
  };

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
            <span className="text-[#e40046]">My E-GIFT Voucher Balance</span>
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
                    <div className="text-sm text-[#e40046] cursor-pointer">E-Gift Voucher Balance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div >
              <div className="p-6">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-8">
                    
                    <div className="flex items-center gap-4">
                      <h2 className="text-gray-900 text-lg font-medium">CHECK E-GIFT VOUCHER BALANCE</h2>
                      <Link to="https://www.snapdeal.com/eGiftVoucher"   target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                        ABOUT E-GIFT VOUCHER {'>'}
                      </Link>
                    </div>
                  </div>
                  
                   <form onSubmit={handleCheckBalance} className="m">
                      <div className="mb-4 flex">
                        <label className="text-black mb-2 mt-1"> e-Gift Voucher Code </label>
                        <input
                          type="text"
                          value={voucherCode}
                          onChange={(e) => setVoucherCode(e.target.value)}
                          className="ml-2 border-b border-red-600 outline-none"
                          placeholder="Enter your VoucherCode"
                        />
                      </div>

                      {/* Fixed Password Input */}
                      <div className="flex mb-2 items-center">
                        <label className="text-gray-600">e-Gift Voucher Pin</label>
                        <input
                          type={showPin ? "text" : "password"}
                          value={voucherPin}
                          onChange={(e) => setVoucherPin(e.target.value)}
                          className="ml-5 border-b-2 border-red-600 focus:border-black focus:border-2 outline-none transition-colors px-2 py-1"
                          placeholder="Enter your Voucher Pin"
                        />
                        <i
                          className={`ml-2 mt-2 cursor-pointer text-gray-600 hover:text-black fa ${
                            showPin ? "fa-eye-slash" : "fa-eye"
                          }`}
                          onClick={() => setShowPin(!showPin)}
                        ></i>
                        <button
                          type="submit"
                          className="ml-2 py-1.5 px-8 bg-gray-800 text-white rounded hover:bg-black transition-colors"
                        >
                          CHECK BALANCE
                        </button>
                      </div>

                      <div className="mt-2">
                        <span className="text-xs text-[#787878] ml-40 underline cursor-pointer" onClick={() => setShowForgotPinPopup(true)}>Forgot e-Gift Voucher Pin</span>
                      </div>

                      {showForgotPinPopup && (
  <div className="absolute inset-0 top-90 flex flex-col items-center text-[#565656]">
    <div className="border border-gray-300  bg-white shadow-md px-2 border-b-2 border-b-black">
      <div className="flex justify-between items-center gap-4">
        <p className="text-sm">Please mail us at</p>
        <button
          onClick={() => setShowForgotPinPopup(false)}
          className="text-[#666] hover:text-black"
        >
          <i className="fa fa-times"></i>
        </button>
      </div>
      <p className="text-sm">giftvoucherhelpdesk@snapdeal.com</p>
      <p className="text-sm mb-2">for any e-gift voucher issues</p>
    </div>
  </div>
)}

                   

                    
                  </form>
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

export default EGiftVoucherBalance;
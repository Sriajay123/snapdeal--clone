import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import PaymentFooter from "../components/PaymentFooter.jsx";
import ContentFooter from "../components/ContentFooter.jsx";
import CustomerTrustSection from "../components/CustomerTrustSection.jsx";
import axios from 'axios';
import Secure from '../assets/Secure.png';
function ChangePassword() {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit button clicked');
    console.log('Current user data:', user);
    
    // Check if user exists and has email
    if (!user || !user.email) {
      console.log('No user data found');
      setError('Please login to change password');
      return;
    }

    // Password validation
    if (newPassword.length < 6 || !/\d/.test(newPassword) || !/[a-zA-Z]/.test(newPassword)) {
      console.log('Password validation failed');
      setError('Password should have a minimum of 6 characters, at least 1 numeric and 1 alphabet');
      return;
    }

    // Show OTP popup directly for now (temporary fix)
    setShowOtpPopup(true);
    setError('');

    // try {
    //   console.log('Sending OTP request to:', user.email);
      
    //   // Send OTP to user's email
    //   const response = await axios.post('http://localhost:5000/api/users/send-otp', {
    //     email: user.email
    //   });

    //   console.log('OTP response:', response.data);
      
    //   if (response.data.success) {
    //     setShowOtpPopup(true);
    //     setError('');
    //   } else {
    //     setError(response.data.message || 'Failed to send OTP');
    //   }
    // } catch (err) {
    //   console.error('OTP send error:', err);
    //   setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    // }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    console.log('OTP submit clicked');
    
    if (!otp) {
      setOtpError('Please enter OTP');
      return;
    }
    
    try {
      console.log('Verifying OTP and updating password');
      // Verify OTP and update password
      const response = await axios.post('http://localhost:5000/api/users/change-password', {
        email: user.email,
        newPassword,
        otp
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Password update response:', response.data);

      if (response.data.success) {
        setShowOtpPopup(false);
        setOtp('');
        setNewPassword('');
        alert('Password updated successfully!');
      } else {
        setOtpError(response.data.message || 'Failed to verify OTP');
      }
    } catch (err) {
      console.error('Password update error:', err);
      setOtpError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/send-otp', {
        email: user.email
      });
      if (response.data.success) {
        setOtpError('OTP resent successfully!');
        setTimeout(() => setOtpError(''), 3000);
      }
    } catch (err) {
      setOtpError('Failed to resend OTP. Please try again.');
    }
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
            <span className="text-[#e40046]">Change Password</span>
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
                    <Link to="/change-password" className="block text-sm text-[#e40046] cursor-pointer">Change Password</Link>
                  </div>
                </div>

                {/* Payments Section */}
                <div>
                  <div className="flex items-center gap-2 text-gray-700 mb-3">
                    <i className="fas fa-credit-card text-gray-600"></i>
                    <span className="font-medium">PAYMENTS</span>
                  </div>
                  <div className="ml-6">
                  <Link to="/egift-voucher-balance"> <div className="text-sm text-gray-600 cursor-pointer hover:text-[#e40046]">E-Gift Voucher Balance</div></Link>
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
                 
                  <h2 className="text-gray-900 text-lg font-medium mb-8 border-b border-gray-300">CHANGE PASSWORD</h2>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="max-w-md">
                      <div className="mb-6">
                        <label className="block text-gray-800 mb-2">
                          New Password <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:border-black focus:border-1 outline-none"
                          placeholder="Enter your new password"
                        />
                        {error && (
                          <p className="text-sm text-gray-500 mt-1">
                            Password should have a minimum of 6 characters, at least 1 numeric and 1 alphabet
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="px-8 py-2 bg-gray-800 text-white rounded hover:bg-black transition-colors"
                      >
                        SUBMIT
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* OTP Verification Popup */}
    {showOtpPopup && (
      <div className="fixed top-0 inset-0  flex items-center justify-center">
        <div className="bg-white w-[300px] shadow-lg">
          <div className="p-4 border-b border-b-gray-300">
            <div className="flex justify-between items-center">
              <h3 className="text-lg text-gray-800">Verify</h3>
              <button
                onClick={() => setShowOtpPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <img src={Secure} alt="Security Lock" className="w-100 h-40" />
            </div>
            <p className="text-center text-gray-600 text-sm mb-4">
              An OTP has been sent on your registered email & phone number
            </p>
            <form onSubmit={handleOtpSubmit}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="ml-9 py-1 border border-gray-300 rounded  mb-2 text-center"
                placeholder="code"
              />
              {otpError && (
                <p className="text-sm text-red-500 mb-2">{otpError}</p>
              )}
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-[#2874f0] text-sm text-center mb-4 ml-20"
              >
                Resend OTP
              </button>
              <button
                type="submit"
                className="w-full py-2 bg-[#e40046] text-white rounded hover:bg-[#d4003f]"
              >
                CONTINUE
              </button>
            </form>
          </div>
        </div>
      </div>
    )}

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

export default ChangePassword;
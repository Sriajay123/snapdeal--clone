import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import PaymentFooter from "../components/PaymentFooter.jsx";
import ContentFooter from "../components/ContentFooter.jsx";
import CustomerTrustSection from "../components/CustomerTrustSection.jsx";
import { fetchAddresses, addAddress, updateAddress, deleteAddress } from '../api/addressAPI';
import { useDispatch } from 'react-redux';
import { showSuccessNotification } from '../store/notificationSlice';

function SavedAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [user, setUser] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    locality: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    type: 'home'
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      loadAddresses();
    }
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await fetchAddresses();
      setAddresses(data.addresses);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      dispatch(showSuccessNotification('Failed to load addresses'));
    }
  };

  const handleEditAddress = (address) => {
    setIsEditing(true);
    setSelectedAddress(address);
    setFormData({
      name: address.fullName,
      street: address.addressLine1,
      locality: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone: address.phone,
      type: address.type
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(addressId);
        dispatch(showSuccessNotification('Address deleted successfully'));
        loadAddresses();
      } catch (error) {
        console.error('Failed to delete address:', error);
        dispatch(showSuccessNotification('Failed to delete address'));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Transform form data to match backend schema
      const transformedData = {
        fullName: formData.name,
        addressLine1: formData.street,
        addressLine2: formData.locality,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        phone: formData.phone,
        type: formData.type
      };

      if (isEditing) {
        await updateAddress(selectedAddress._id, transformedData);
        dispatch(showSuccessNotification('Address updated successfully'));
      } else {
        await addAddress(transformedData);
        dispatch(showSuccessNotification('Address added successfully'));
      }
      setShowAddressForm(false);
      loadAddresses();
    } catch (error) {
      console.error('Failed to save address:', error);
      dispatch(showSuccessNotification('Failed to save address'));
    }
  };

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
                      <Link to="/egift-voucher-balance">
                        <div className="text-sm text-gray-600 cursor-pointer hover:text-[#e40046]">E-Gift Voucher Balance</div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-9">
              {!showAddressForm ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="w-full text-xl font-medium border-b border-gray-300">SAVED ADDRESSES</h1>
                   
                  </div>

                  {/* Addresses Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {addresses.map(address => (
                      <div key={address._id} className="border border-gray-200 hover:border-gray-400 rounded-sm p-4 relative bg-white shadow hover:shadow-lg transition-all">
                        <div className="mb-3">
                          <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded capitalize">
                            {address.type}
                          </span>
                        </div>
                        <div className="mb-4">
                          <h3 className="text-base font-medium text-gray-800 mb-2">{address.fullName}</h3>
                          <div className="text-sm text-gray-600 leading-relaxed">
                            <p>{address.addressLine1}</p>
                            {address.addressLine2 && <p>{address.addressLine2}</p>}
                            <p>{address.city} - {address.pincode}</p>
                            <p>{address.state}</p>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            <span className="font-medium">Phone: </span>{address.phone}
                          </p>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <button 
                            onClick={() => handleDeleteAddress(address._id)}
                            className="text-gray-500 hover:text-[#e40046] flex items-center gap-1"
                          >
                            <i className="far fa-trash-alt"></i>
                            <span>Delete</span>
                          </button>
                          <button 
                            onClick={() => handleEditAddress(address)}
                            className="text-gray-500 hover:text-[#e40046] flex items-center gap-1"
                          >
                            <i className="far fa-edit"></i>
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Address Button */}
                  <div className="mt-8 flex justify-center">
                    <button 
                      onClick={() => setShowAddressForm(true)}
                      className="bg-[#e40046] text-white py-1.5 px-3 text-lg font-medium hover:bg-[#d10042] transition-colors shadow-sm"
                    >
                      ADD NEW ADDRESS
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 rounded shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-medium">Enter Your Address</h1>
                    <button 
                      onClick={() => setShowAddressForm(false)}
                      className="text-blue-500 hover:underline"
                    >
                      Back To Saved Addresses
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Pincode</label>
                        <input
                          type="text"
                          placeholder="Enter 6 digit pincode"
                          value={formData.pincode}
                          onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#e40046]"
                          required
                          pattern="[0-9]{6}"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#e40046]"
                          required
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm text-gray-700 mb-2">Address</label>
                        <input
                          type="text"
                          placeholder="Flat/House No."
                          value={formData.street}
                          onChange={(e) => setFormData({...formData, street: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#e40046] mb-3"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Colony/Street No."
                          value={formData.locality}
                          onChange={(e) => setFormData({...formData, locality: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#e40046]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Locality/Landmark</label>
                        <input
                          type="text"
                          placeholder="Eg: Near Fortis Hospital"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#e40046]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          placeholder="City"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#e40046]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2">State</label>
                        <input
                          type="text"
                          placeholder="State"
                          value={formData.state}
                          onChange={(e) => setFormData({...formData, state: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#e40046]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Mobile Number</label>
                        <div className="flex">
                          <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l">+91</span>
                          <input
                            type="tel"
                            placeholder="10 digit mobile number"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-r focus:outline-none focus:border-[#e40046]"
                            required
                            pattern="[0-9]{10}"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Alternate Mobile No.</label>
                        <div className="flex">
                          <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l">+91</span>
                          <input
                            type="tel"
                            placeholder="10 digit mobile number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-r focus:outline-none focus:border-[#e40046]"
                            pattern="[0-9]{10}"
                          />
                        </div>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm text-gray-700 mb-2">Address Type</label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="addressType"
                              value="home"
                              checked={formData.type === 'home'}
                              onChange={(e) => setFormData({...formData, type: e.target.value})}
                              className="mr-2"
                            />
                            Home
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="addressType"
                              value="office"
                              checked={formData.type === 'office'}
                              onChange={(e) => setFormData({...formData, type: e.target.value})}
                              className="mr-2"
                            />
                            Office/Commercial
                          </label>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                          />
                          Make this my default address
                        </label>
                      </div>

                      <div className="col-span-2">
                        <button
                          type="submit"
                          className="w-full bg-[#e40046] text-white py-3 rounded hover:bg-[#d10042] transition-colors"
                        >
                          {isEditing ? 'UPDATE ADDRESS' : 'SAVE ADDRESS'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen mt-10">
          <CustomerTrustSection/>
          <ContentFooter/>
          <PaymentFooter/>
          <div className='bg-white w-full h-11 flex items-center justify-between text-xs text-[#949aa2]'>
            <span className='mt-3 ml-10'>Copyright © 2021, Snapdeal Limited. All Rights Reserved</span>
            <span className='mr-15'>Made for Bharat 
              <i className="fa-solid fa-heart text-red-500 hover:scale-125 transition-transform duration-300 ml-2"></i>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default SavedAddresses;
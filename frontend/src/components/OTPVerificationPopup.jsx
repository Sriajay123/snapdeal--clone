import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../store/cartSlice";
import api from "../api/api";

function OTPVerificationPopup({ isOpen, onClose, onPaymentSuccess, orderTotal }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const [currentStep, setCurrentStep] = useState(1); // 1: OTP, 2: Address, 3: Payment
    const [isProcessing, setIsProcessing] = useState(false);
    
    // OTP Step
    const [mobileNumber, setMobileNumber] = useState("+919591933353");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(true);
    const [countdown, setCountdown] = useState(9);
    
    // Address Step
    const [address, setAddress] = useState({
        fullName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        phone: ""
    });
    
    // Payment Step
    const [paymentMethod, setPaymentMethod] = useState("");
    const [cardDetails, setCardDetails] = useState({
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
        cardholderName: ""
    });

    useEffect(() => {
        let timer;
        if (isOtpSent && countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown, isOtpSent]);

    // Reset to step 1 when popup opens
    useEffect(() => {
        if (isOpen) {
            setCurrentStep(1);
            setOtp("");
            setIsProcessing(false);
        }
    }, [isOpen]);

    const handleResendOTP = () => {
        setCountdown(9);
        setIsOtpSent(true);
        console.log("OTP resent to", mobileNumber);
    };

    const handleOTPContinue = () => {
        if (otp.trim() === "") {
            alert("Please enter OTP");
            return;
        }
        console.log("OTP verified:", otp);
        setCurrentStep(2); // Move to address step
    };

    const handleAddressContinue = () => {
        if (!address.fullName || !address.addressLine1 || !address.city || !address.state || !address.pincode) {
            alert("Please fill all required address fields");
            return;
        }
        console.log("Address saved:", address);
        setCurrentStep(3); // Move to payment step
    };

    const handlePaymentContinue = async () => {
        if (!paymentMethod) {
            alert("Please select a payment method");
            return;
        }

        if (paymentMethod === "card" && (!cardDetails.cardNumber || !cardDetails.expiryMonth || !cardDetails.expiryYear || !cardDetails.cvv)) {
            alert("Please fill all card details");
            return;
        }

        // Start processing payment
        setIsProcessing(true);
        console.log("Processing payment with method:", paymentMethod);
        
        try {
            // Prepare order data
            const orderData = {
                customerInfo: {
                    name: address.fullName,
                    phone: mobileNumber,
                    email: "" // Could add email field if needed
                },
                shippingAddress: address,
                items: cart.items.map(item => ({
                    product: item.product._id, // MongoDB ObjectId reference
                    productDetails: {
                        name: item.product.name,
                        brand: item.product.brand || "",
                        price: item.product.price,
                        image: item.product.image,
                        selectedSize: item.selectedSize || "",
                        selectedColor: item.selectedColor || ""
                    },
                    quantity: item.quantity,
                    price: item.product.price
                })),
                orderSummary: {
                    subtotal: parseFloat(orderTotal.replace(/,/g, '')),
                    deliveryCharges: 0,
                    totalAmount: parseFloat(orderTotal.replace(/,/g, ''))
                },
                paymentInfo: {
                    method: paymentMethod,
                    transactionId: paymentMethod === "card" ? `TXN${Date.now()}` : null
                }
            };

            console.log("Creating order with data:", orderData);

            // Save order to database
            const response = await api.post('/orders', orderData);
            
            console.log("API Response:", response);
            
            if (response.data && response.data.success) {
                console.log("Order created successfully:", response.data.order);
                
                // Clear the cart
                dispatch(clearCart());
                
                // Show success message with order number
                alert(`🎉 Order Placed Successfully!\n\nOrder Number: ${response.data.order.orderNumber}\n\nThank you for shopping with Snapdeal!`);
                
                // Reset all states
                setCurrentStep(1);
                setOtp("");
                setAddress({
                    fullName: "",
                    addressLine1: "",
                    addressLine2: "",
                    city: "",
                    state: "",
                    pincode: "",
                    phone: ""
                });
                setPaymentMethod("");
                setCardDetails({
                    cardNumber: "",
                    expiryMonth: "",
                    expiryYear: "",
                    cvv: "",
                    cardholderName: ""
                });
                
                // Close popup and navigate
                if (onPaymentSuccess) {
                    onPaymentSuccess();
                }
                navigate('/my-orders');
                
            } else {
                throw new Error(response.data.message || 'Failed to create order');
            }
            
        } catch (error) {
            console.error("Error creating order:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    // Prevent closing during processing
    const handleBackdropClick = (e) => {
        if (!isProcessing && e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleCloseClick = () => {
        if (!isProcessing) {
            // Reset to step 1 when closing
            setCurrentStep(1);
            setOtp("");
            onClose();
        }
    };

    const getStepName = (step) => {
        switch(step) {
            case 1: return "OTP Verification";
            case 2: return "Address";
            case 3: return "Payment";
            default: return "OTP Verification";
        }
    };

    return (
        <>
            {/* Modal Backdrop */}
            <div
                className="fixed inset-0 bg-white/50  z-40"
                onClick={handleBackdropClick}
            ></div>

            {/* Modal Dialog */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4">
                    {/* Header */}
                    <div className="bg-[#e40046] text-white p-4 rounded-t-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold">snapdeal</h2>
                                <div className="flex items-center gap-1 text-sm">
                                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">✓</span>
                                    <span>Razorpay Trusted Business</span>
                                    <i className="fas fa-info-circle"></i>
                                </div>
                            </div>
                            <button
                                className={`text-white hover:text-gray-200 text-xl ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}`}
                                onClick={handleCloseClick}
                                disabled={isProcessing}
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="px-4 py-3 border-b">
                        <div className="flex items-center text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                                <i className="fas fa-arrow-left"></i>
                                Summary
                            </span>
                            <span className="mx-2">››</span>
                            <span className={`${currentStep === 1 ? 'text-[#e40046] font-medium' : currentStep > 1 ? 'text-green-600' : ''}`}>
                                OTP Verification
                            </span>
                            <span className="mx-2">››</span>
                            <span className={`${currentStep === 2 ? 'text-[#e40046] font-medium' : currentStep > 2 ? 'text-green-600' : ''}`}>
                                Address
                            </span>
                            <span className="mx-2">››</span>
                            <span className={`${currentStep === 3 ? 'text-[#e40046] font-medium' : ''}`}>
                                Payment
                            </span>
                            <div className="ml-auto">
                                <h3 className="font-semibold">Step {currentStep}/3</h3>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-6">
                        {isProcessing && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-2 text-green-800">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-800"></div>
                                    <span className="text-sm font-medium">Processing your payment...</span>
                                </div>
                            </div>
                        )}

                        {/* Step 1: OTP Verification */}
                        {currentStep === 1 && (
                            <>
                                <div className="mb-6">
                                    <h3 className="flex items-center gap-2 text-gray-800 font-medium mb-3">
                                        <i className="fas fa-mobile-alt"></i>
                                        Verify Mobile Number
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3">
                                        A text message with an OTP has been sent to
                                    </p>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-blue-600 font-medium">{mobileNumber}</span>
                                        <i className="fas fa-edit text-gray-400 cursor-pointer"></i>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <input
                                        type="text"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-3 text-center text-lg tracking-widest focus:outline-none focus:border-[#e40046]"
                                        maxLength="6"
                                    />
                                </div>

                                <div className="mb-6">
                                    {countdown > 0 ? (
                                        <p className="text-gray-500 text-sm">
                                            Resend OTP in 00:{countdown.toString().padStart(2, '0')}
                                        </p>
                                    ) : (
                                        <button
                                            className="text-[#e40046] text-sm font-medium cursor-pointer"
                                            onClick={handleResendOTP}
                                        >
                                            Resend OTP
                                        </button>
                                    )}
                                </div>

                                <div className="mb-6 flex items-start gap-2 p-3 bg-gray-50 rounded">
                                    <i className="fas fa-lock text-gray-400 mt-1"></i>
                                    <p className="text-xs text-gray-600">
                                        Your info is secured and can only be accessed by you
                                    </p>
                                </div>
                            </>
                        )}

                        {/* Step 2: Address Details */}
                        {currentStep === 2 && (
                            <>
                                <div className="mb-6">
                                    <h3 className="flex items-center gap-2 text-gray-800 font-medium mb-4">
                                        <i className="fas fa-home"></i>
                                        Delivery Address
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Full Name *"
                                                value={address.fullName}
                                                onChange={(e) => setAddress({...address, fullName: e.target.value})}
                                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#e40046]"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Address Line 1 *"
                                                value={address.addressLine1}
                                                onChange={(e) => setAddress({...address, addressLine1: e.target.value})}
                                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#e40046]"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Address Line 2 (Optional)"
                                                value={address.addressLine2}
                                                onChange={(e) => setAddress({...address, addressLine2: e.target.value})}
                                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#e40046]"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="City *"
                                                value={address.city}
                                                onChange={(e) => setAddress({...address, city: e.target.value})}
                                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#e40046]"
                                            />
                                            <input
                                                type="text"
                                                placeholder="State *"
                                                value={address.state}
                                                onChange={(e) => setAddress({...address, state: e.target.value})}
                                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#e40046]"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Pincode *"
                                                value={address.pincode}
                                                onChange={(e) => setAddress({...address, pincode: e.target.value})}
                                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#e40046]"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Phone Number"
                                                value={address.phone}
                                                onChange={(e) => setAddress({...address, phone: e.target.value})}
                                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#e40046]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Step 3: Payment Method */}
                        {currentStep === 3 && (
                            <>
                                <div className="mb-6">
                                    <h3 className="flex items-center gap-2 text-gray-800 font-medium mb-4">
                                        <i className="fas fa-credit-card"></i>
                                        Payment Method
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        {/* Payment Method Selection */}
                                        <div className="space-y-3">
                                            <label className="flex items-center p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="cod"
                                                    checked={paymentMethod === "cod"}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="mr-3"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <i className="fas fa-money-bill text-green-600"></i>
                                                    <span>Cash on Delivery (COD)</span>
                                                </div>
                                            </label>
                                            
                                            <label className="flex items-center p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="card"
                                                    checked={paymentMethod === "card"}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="mr-3"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <i className="fas fa-credit-card text-blue-600"></i>
                                                    <span>Credit/Debit Card</span>
                                                </div>
                                            </label>
                                        </div>

                                        {/* Card Details (if card is selected) */}
                                        {paymentMethod === "card" && (
                                            <div className="mt-4 p-4 bg-gray-50 rounded space-y-3">
                                                <h4 className="font-medium text-gray-700">Card Details</h4>
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="Card Number"
                                                        value={cardDetails.cardNumber}
                                                        onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#e40046]"
                                                        maxLength="16"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <select
                                                        value={cardDetails.expiryMonth}
                                                        onChange={(e) => setCardDetails({...cardDetails, expiryMonth: e.target.value})}
                                                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#e40046]"
                                                    >
                                                        <option value="">Month</option>
                                                        {[...Array(12)].map((_, i) => (
                                                            <option key={i+1} value={i+1}>{String(i+1).padStart(2, '0')}</option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        value={cardDetails.expiryYear}
                                                        onChange={(e) => setCardDetails({...cardDetails, expiryYear: e.target.value})}
                                                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#e40046]"
                                                    >
                                                        <option value="">Year</option>
                                                        {[...Array(10)].map((_, i) => {
                                                            const year = new Date().getFullYear() + i;
                                                            return <option key={year} value={year}>{year}</option>;
                                                        })}
                                                    </select>
                                                    <input
                                                        type="text"
                                                        placeholder="CVV"
                                                        value={cardDetails.cvv}
                                                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                                                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#e40046]"
                                                        maxLength="3"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="Cardholder Name"
                                                        value={cardDetails.cardholderName}
                                                        onChange={(e) => setCardDetails({...cardDetails, cardholderName: e.target.value})}
                                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#e40046]"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-lg font-semibold">
                                ₹ {orderTotal}
                            </div>
                            
                            <div className="flex gap-3">
                                {/* Back Button (except for step 1) */}
                                {currentStep > 1 && !isProcessing && (
                                    <button
                                        className="px-6 py-3 border border-gray-300 rounded font-medium hover:bg-gray-50 transition-colors"
                                        onClick={() => setCurrentStep(currentStep - 1)}
                                    >
                                        Back
                                    </button>
                                )}
                                
                                {/* Continue Button */}
                                <button
                                    className="bg-[#e40046] text-white px-8 py-3 rounded font-medium hover:bg-[#c2003d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => {
                                        if (currentStep === 1) handleOTPContinue();
                                        else if (currentStep === 2) handleAddressContinue();
                                        else if (currentStep === 3) handlePaymentContinue();
                                    }}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <span className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Processing...
                                        </span>
                                    ) : currentStep === 3 ? "Place Order" : "Continue"}
                                </button>
                            </div>
                        </div>
                        
                        {/* Razorpay branding */}
                        <div className="text-center mt-3">
                            <p className="text-xs text-gray-500">
                                Secured by <span className="font-semibold">Razorpay Magic</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OTPVerificationPopup;

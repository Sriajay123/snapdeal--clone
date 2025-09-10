import React, { useState } from "react";
import OTPVerificationPopup from "./OTPVerificationPopup";

function CartFooter({ subtotal, onCartClose }) {
    const [showOTPPopup, setShowOTPPopup] = useState(false);

    const handleProceedToPay = () => {
        setShowOTPPopup(true);
    };

    const handleOTPClose = () => {
        setShowOTPPopup(false);
    };

    const handlePaymentSuccess = () => {
        setShowOTPPopup(false);
        if (onCartClose) {
            onCartClose(); // Close cart dropdown
        }
    };
    return (
        <div className="bg-black border-t border-gray-200 w-full px-4 py-3">
            <div className="flex justify-between items-center">
                {/* Left Side - Trust Badges */}
                <div className="flex flex-col space-y-2 text-xs text-gray-400">
                    <div className="mb-1">
                        Delivery and payment options can be selected later
                    </div>
                    <div className="flex items-center gap-1">
                        <i className="fa-solid fa-shield-halved mr-1"></i>
                        <span>Safe and Secure Payments</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <i className="fas fa-credit-card mr-1"></i>
                        <span>100% Payment Protection, Easy Returns Policy</span>
                    </div>
                </div>

                {/* Right Side - Price Summary and Button */}
                <div className="flex items-center gap-6">
                    {/* Price Summary */}
                    <div className="text-right">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-400 mr-8">Sub Total:</span>
                            <span className="text-sm font-bold text-white">Rs. {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400 mr-8">Delivery Charges:</span>
                            <span className="text-green-400 font-bold text-sm">FREE</span>
                        </div>
                    </div>

                    {/* Proceed Button */}
                    <button
                        type="button"
                        className="bg-[#e40046] text-white font-bold text-sm hover:bg-[#c2003d] transition-colors py-3 px-6 rounded whitespace-nowrap"
                        onClick={handleProceedToPay}
                    >
                        PROCEED TO PAY Rs. {subtotal.toLocaleString()}
                    </button>
                </div>
            </div>
            
            {/* OTP Verification Popup */}
            <OTPVerificationPopup
                isOpen={showOTPPopup}
                onClose={handleOTPClose}
                onPaymentSuccess={handlePaymentSuccess}
                orderTotal={subtotal.toLocaleString()}
            />
        </div>
    );
}

export default CartFooter;

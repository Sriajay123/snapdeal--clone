import React, { useState, useEffect } from "react";

function OTPVerificationPopup({ isOpen, onClose, orderTotal }) {
    const [mobileNumber, setMobileNumber] = useState("+919591933353");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(true);
    const [countdown, setCountdown] = useState(9);

    useEffect(() => {
        let timer;
        if (isOtpSent && countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown, isOtpSent]);

    const handleResendOTP = () => {
        setCountdown(9);
        setIsOtpSent(true);
        // Add your OTP resend logic here
        console.log("OTP resent to", mobileNumber);
    };

    const handleContinue = () => {
        if (otp.trim() !== "") {
            // Add your OTP verification logic here
            console.log("OTP verified:", otp);
            onClose();
        } else {
            alert("Please enter OTP");
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Modal Backdrop */}
            <div
                className="fixed inset-0 bg-white/50  z-40"
                onClick={onClose}
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
                                className="text-white hover:text-gray-200 text-xl"
                                onClick={onClose}
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
                            <span className="text-[#e40046] font-medium">Address</span>
                            <span className="mx-2">››</span>
                            <span>Payments</span>
                            <div className="ml-auto">
                                <h3 className="font-semibold">Order Summary</h3>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-6">
                        {/* Mobile Number Verification */}
                        <div className="mb-6">
                            <h3 className="flex items-center gap-2 text-gray-800 font-medium mb-3">
                                <i className="fas fa-home"></i>
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

                        {/* OTP Input */}
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

                        {/* Resend OTP */}
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

                        {/* Security Message */}
                        <div className="mb-6 flex items-start gap-2 p-3 bg-gray-50 rounded">
                            <i className="fas fa-lock text-gray-400 mt-1"></i>
                            <p className="text-xs text-gray-600">
                                Your info is secured and can only be accessed by you
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-lg font-semibold">
                                ₹ {orderTotal}
                            </div>
                            <button
                                className="bg-[#e40046] text-white px-8 py-3 rounded font-medium hover:bg-[#c2003d] transition-colors"
                                onClick={handleContinue}
                            >
                                Continue
                            </button>
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

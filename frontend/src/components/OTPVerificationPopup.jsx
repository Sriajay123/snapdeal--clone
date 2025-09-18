import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../store/cartSlice";
import { useRazorpay } from "../hooks/useRazorpay";
import api from "../api/api";

function OTPVerificationPopup({ isOpen, onClose, onPaymentSuccess, orderTotal, buyNowProduct }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const { initiatePayment, loading: razorpayLoading } = useRazorpay();
    const [currentStep, setCurrentStep] = useState(1); // 1: OTP, 2: Address, 3: Payment
    const [isProcessing, setIsProcessing] = useState(false);
    const [createdOrder, setCreatedOrder] = useState(null); // Store created order for payment
    
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
    
    // Language Support
    const [selectedLanguage, setSelectedLanguage] = useState("english");
    
    // Translations
    const translations = {
        english: {
            verifyMobile: "Verify Mobile Number",
            textMessage: "A text message with an OTP has been sent to",
            enterOTP: "Enter OTP",
            resendOTP: "Resend OTP",
            resendIn: "Resend OTP in 00:",
            infoSecured: "Your info is secured and can only be accessed by you",
            addressDetails: "Address Details",
            fullName: "Full Name",
            addressLine1: "Address Line 1",
            addressLine2: "Address Line 2 (Optional)",
            city: "City",
            state: "State",
            pincode: "Pincode",
            phone: "Phone",
            payment: "Payment",
            selectPayment: "Select Payment Method",
            cashOnDelivery: "Cash on Delivery",
            onlinePayment: "Online Payment (Card/UPI/Net Banking)",
            placeOrder: "Place Order",
            continue: "Continue",
            back: "Back",
            step: "Step",
            summary: "Summary",
            otpVerification: "OTP Verification",
            address: "Address",
            language: "Language",
            selectLanguage: "Select Language"
        },
        hindi: {
            verifyMobile: "मोबाइल नंबर सत्यापित करें",
            textMessage: "आपके मोबाइल पर OTP भेजा गया है",
            enterOTP: "OTP दर्ज करें",
            resendOTP: "OTP दोबारा भेजें",
            resendIn: "OTP दोबारा भेजें 00:",
            infoSecured: "आपकी जानकारी सुरक्षित है और केवल आप ही इसे एक्सेस कर सकते हैं",
            addressDetails: "पता विवरण",
            fullName: "पूरा नाम",
            addressLine1: "पता लाइन 1",
            addressLine2: "पता लाइन 2 (वैकल्पिक)",
            city: "शहर",
            state: "राज्य",
            pincode: "पिनकोड",
            phone: "फोन",
            payment: "भुगतान",
            selectPayment: "भुगतान विधि चुनें",
            cashOnDelivery: "डिलीवरी पर भुगतान",
            onlinePayment: "ऑनलाइन भुगतान (कार्ड/यूपीआई/नेट बैंकिंग)",
            placeOrder: "ऑर्डर दें",
            continue: "जारी रखें",
            back: "वापस",
            step: "चरण",
            summary: "सारांश",
            otpVerification: "OTP सत्यापन",
            address: "पता",
            language: "भाषा",
            selectLanguage: "भाषा चुनें"
        },
        telugu: {
            verifyMobile: "మొబైల్ నంబర్ ధృవీకరించండి",
            textMessage: "మీ మొబైల్‌కు OTP పంపబడింది",
            enterOTP: "OTP నమోదు చేయండి",
            resendOTP: "OTP మళ్లీ పంపండి",
            resendIn: "OTP మళ్లీ పంపండి 00:",
            infoSecured: "మీ సమాచారం సురక్షితం మరియు మీరు మాత్రమే యాక్సెస్ చేయగలరు",
            addressDetails: "చిరునామా వివరాలు",
            fullName: "పూర్తి పేరు",
            addressLine1: "చిరునామా లైన్ 1",
            addressLine2: "చిరునామా లైన్ 2 (ఐచ్ఛికం)",
            city: "నగరం",
            state: "రాష్ట్రం",
            pincode: "పిన్‌కోడ్",
            phone: "ఫోన్",
            payment: "చెల్లింపు",
            selectPayment: "చెల్లింపు పద్ధతిని ఎంచుకోండి",
            cashOnDelivery: "డెలివరీలో చెల్లింపు",
            onlinePayment: "ఆన్‌లైన్ చెల్లింపు (కార్డు/UPI/నెట్ బ్యాంకింగ్)",
            placeOrder: "ఆర్డర్ చేయండి",
            continue: "కొనసాగించు",
            back: "వెనుకకు",
            step: "దశ",
            summary: "సారాంశం",
            otpVerification: "OTP ధృవీకరణ",
            address: "చిరునామా",
            language: "భాష",
            selectLanguage: "భాషను ఎంచుకోండి"
        },
        kannada: {
            verifyMobile: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ದೃಢೀಕರಿಸಿ",
            textMessage: "ನಿಮ್ಮ ಮೊಬೈಲ್‌ಗೆ OTP ಕಳುಹಿಸಲಾಗಿದೆ",
            enterOTP: "OTP ನಮೂದಿಸಿ",
            resendOTP: "OTP ಮರುಕಳುಹಿಸಿ",
            resendIn: "OTP ಮರುಕಳುಹಿಸಿ 00:",
            infoSecured: "ನಿಮ್ಮ ಮಾಹಿತಿಯು ಸುರಕ್ಷಿತವಾಗಿದೆ ಮತ್ತು ನೀವು ಮಾತ್ರ ಪ್ರವೇಶಿಸಬಹುದು",
            addressDetails: "ವಿಳಾಸ ವಿವರಗಳು",
            fullName: "ಪೂರ್ಣ ಹೆಸರು",
            addressLine1: "ವಿಳಾಸ ಸಾಲು 1",
            addressLine2: "ವಿಳಾಸ ಸಾಲು 2 (ಐಚ್ಛಿಕ)",
            city: "ನಗರ",
            state: "ರಾಜ್ಯ",
            pincode: "ಪಿನ್‌ಕೋಡ್",
            phone: "ಫೋನ್",
            payment: "ಪಾವತಿ",
            selectPayment: "ಪಾವತಿ ವಿಧಾನವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
            cashOnDelivery: "ಡೆಲಿವರಿಯಲ್ಲಿ ಪಾವತಿ",
            onlinePayment: "ಆನ್‌ಲೈನ್ ಪಾವತಿ (ಕಾರ್ಡ್/UPI/ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್)",
            placeOrder: "ಆರ್ಡರ್ ಮಾಡಿ",
            continue: "ಮುಂದುವರಿಸಿ",
            back: "ಹಿಂದೆ",
            step: "ಹಂತ",
            summary: "ಸಾರಾಂಶ",
            otpVerification: "OTP ದೃಢೀಕರಣ",
            address: "ವಿಳಾಸ",
            language: "ಭಾಷೆ",
            selectLanguage: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ"
        }
    };
    
    // Get current language translations
    const t = translations[selectedLanguage];
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
        console.log("Current cart state:", cart);
        console.log("Cart items count:", cart.items?.length || 0);
        console.log("Buy now product:", buyNowProduct);
        console.log("Full cart object:", JSON.stringify(cart, null, 2));
        
        // Check if cart is empty and no buyNow product
        if ((!cart.items || cart.items.length === 0) && !buyNowProduct) {
            alert("Your cart is empty. Please add items to cart before placing an order.");
            setIsProcessing(false);
            return;
        }
        
        try {
            // Prepare order data
            const orderData = {
                customerInfo: {
                    name: address.fullName,
                    phone: mobileNumber,
                    email: "" // Could add email field if needed
                },
                shippingAddress: address,
                items: buyNowProduct ? [
                    // For Buy Now - create single item from product
                    {
                        product: buyNowProduct._id,
                        productDetails: {
                            name: buyNowProduct.name,
                            brand: buyNowProduct.brand || "",
                            price: buyNowProduct.price,
                            image: buyNowProduct.image || (buyNowProduct.images && buyNowProduct.images[0]) || "",
                            selectedSize: buyNowProduct.selectedSize || "",
                            selectedColor: buyNowProduct.selectedColor || ""
                        },
                        quantity: 1,
                        price: buyNowProduct.price
                    }
                ] : cart.items.map(item => ({
                    // For Cart - map existing cart items
                    product: item.product._id,
                    productDetails: {
                        name: item.product.name,
                        brand: item.product.brand || "",
                        price: item.product.price,
                        image: item.product.image,
                        selectedSize: item.product.selectedSize || "",
                        selectedColor: item.product.selectedColor || ""
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
                    status: paymentMethod === 'cod' ? 'pending' : 'pending', // Will be updated after payment
                    transactionId: null // Will be set after payment
                }
            };

            console.log("Creating order with data:", orderData);
            console.log("Cart items before mapping:", cart.items);

            // Create order first
            const response = await api.post('api/orders', orderData);
            
            console.log("API Response:", response);
            
            if (response.data && response.data.success) {
                console.log("Order created successfully:", response.data.order);
                setCreatedOrder(response.data.order);
                
                if (paymentMethod === 'cod') {
                    // For COD, complete the order immediately
                    await completeOrder(response.data.order);
                } else {
                    // For online payment, initiate Razorpay
                    await initiateRazorpayPayment(response.data.order);
                }
                
            } else {
                throw new Error(response.data.message || 'Failed to create order');
            }
            
        } catch (error) {
            console.error("Error processing order:", error);
            alert("Failed to place order. Please try again.");
            setIsProcessing(false);
        }
    };

    const completeOrder = async (order) => {
        try {
            // Clear the cart only if this was a cart purchase (not buyNow)
            if (!buyNowProduct) {
                dispatch(clearCart());
            }
            
            // Show success message with order number
            alert(`🎉 Order Placed Successfully!\n\nOrder Number: ${order.orderNumber}\n\nThank you for shopping with Snapdeal!`);
            
            // Reset all states
            resetForm();
            
            // Close popup and navigate
            if (onPaymentSuccess) {
                onPaymentSuccess();
            }
            navigate('/my-orders');
            
        } catch (error) {
            console.error("Error completing order:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const initiateRazorpayPayment = async (order) => {
        try {
            const amount = parseFloat(orderTotal.replace(/,/g, ''));
            
            await initiatePayment({
                amount,
                orderNumber: order.orderNumber,
                customerName: address.fullName,
                customerEmail: "", // Add email if available
                customerPhone: mobileNumber,
                onSuccess: async (paymentResponse) => {
                    console.log("Razorpay payment successful:", paymentResponse);
                    await completeOrder(order);
                },
                onFailure: (error) => {
                    console.error("Razorpay payment failed:", error);
                    alert("Payment failed. Please try again or choose Cash on Delivery.");
                    setIsProcessing(false);
                }
            });
            
        } catch (error) {
            console.error("Error initiating Razorpay payment:", error);
            alert("Failed to initiate payment. Please try again.");
            setIsProcessing(false);
        }
    };

    const resetForm = () => {
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
        setCreatedOrder(null);
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
                            <div className="flex items-center gap-3">
                                {/* Language Selector */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">{t.language}:</span>
                                    <select
                                        value={selectedLanguage}
                                        onChange={(e) => setSelectedLanguage(e.target.value)}
                                        className="bg-white text-gray-800 text-sm px-2 py-1 rounded border-none outline-none"
                                        disabled={isProcessing}
                                    >
                                        <option value="english">English</option>
                                        <option value="hindi">हिंदी</option>
                                        <option value="telugu">తెలుగు</option>
                                        <option value="kannada">ಕನ್ನಡ</option>
                                    </select>
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
                    </div>

                    {/* Progress Steps */}
                    <div className="px-4 py-3 border-b">
                        <div className="flex items-center text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                                <i className="fas fa-arrow-left"></i>
                                {t.summary}
                            </span>
                            <span className="mx-2">››</span>
                            <span className={`${currentStep === 1 ? 'text-[#e40046] font-medium' : currentStep > 1 ? 'text-green-600' : ''}`}>
                                {t.otpVerification}
                            </span>
                            <span className="mx-2">››</span>
                            <span className={`${currentStep === 2 ? 'text-[#e40046] font-medium' : currentStep > 2 ? 'text-green-600' : ''}`}>
                                {t.address}
                            </span>
                            <span className="mx-2">››</span>
                            <span className={`${currentStep === 3 ? 'text-[#e40046] font-medium' : ''}`}>
                                {t.payment}
                            </span>
                            <div className="ml-auto">
                                <h3 className="font-semibold">{t.step} {currentStep}/3</h3>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-6">
                        {isProcessing && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-2 text-green-800">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-800"></div>
                                    <span className="text-sm font-medium">
                                        {paymentMethod === 'cod' ? 'Processing your order...' : 
                                         paymentMethod === 'online' ? 'Redirecting to payment gateway...' :
                                         'Processing your order...'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Step 1: OTP Verification */}
                        {currentStep === 1 && (
                            <>
                                <div className="mb-6">
                                    <h3 className="flex items-center gap-2 text-gray-800 font-medium mb-3">
                                        <i className="fas fa-mobile-alt"></i>
                                        {t.verifyMobile}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3">
                                        {t.textMessage}
                                    </p>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-blue-600 font-medium">{mobileNumber}</span>
                                        <i className="fas fa-edit text-gray-400 cursor-pointer"></i>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <input
                                        type="text"
                                        placeholder={t.enterOTP}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-3 text-center text-lg tracking-widest focus:outline-none focus:border-[#e40046]"
                                        maxLength="6"
                                    />
                                </div>

                                <div className="mb-6">
                                    {countdown > 0 ? (
                                        <p className="text-gray-500 text-sm">
                                            {t.resendIn}{countdown.toString().padStart(2, '0')}
                                        </p>
                                    ) : (
                                        <button
                                            className="text-[#e40046] text-sm font-medium cursor-pointer"
                                            onClick={handleResendOTP}
                                        >
                                            {t.resendOTP}
                                        </button>
                                    )}
                                </div>

                                <div className="mb-6 flex items-start gap-2 p-3 bg-gray-50 rounded">
                                    <i className="fas fa-lock text-gray-400 mt-1"></i>
                                    <p className="text-xs text-gray-600">
                                        {t.infoSecured}
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
                                        {t.addressDetails}
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder={`${t.fullName} *`}
                                                value={address.fullName}
                                                onChange={(e) => setAddress({...address, fullName: e.target.value})}
                                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#e40046]"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder={`${t.addressLine1} *`}
                                                value={address.addressLine1}
                                                onChange={(e) => setAddress({...address, addressLine1: e.target.value})}
                                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#e40046]"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder={t.addressLine2}
                                                value={address.addressLine2}
                                                onChange={(e) => setAddress({...address, addressLine2: e.target.value})}
                                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#e40046]"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder={`${t.city} *`}
                                                value={address.city}
                                                onChange={(e) => setAddress({...address, city: e.target.value})}
                                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#e40046]"
                                            />
                                            <input
                                                type="text"
                                                placeholder={`${t.state} *`}
                                                value={address.state}
                                                onChange={(e) => setAddress({...address, state: e.target.value})}
                                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#e40046]"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder={`${t.pincode} *`}
                                                value={address.pincode}
                                                onChange={(e) => setAddress({...address, pincode: e.target.value})}
                                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#e40046]"
                                            />
                                            <input
                                                type="text"
                                                placeholder={t.phone}
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
                                        {t.selectPayment}
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
                                                    <span>{t.cashOnDelivery}</span>
                                                </div>
                                            </label>
                                            
                                            <label className="flex items-center p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="online"
                                                    checked={paymentMethod === "online"}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="mr-3"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <i className="fas fa-credit-card text-blue-600"></i>
                                                    <span>{t.onlinePayment}</span>
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Secured by Razorpay</span>
                                                </div>
                                            </label>
                                        </div>

                                        {/* Payment Info */}
                                        {paymentMethod === "online" && (
                                            <div className="mt-4 p-4 bg-blue-50 rounded space-y-2">
                                                <h4 className="font-medium text-blue-800">Online Payment Features:</h4>
                                                <div className="text-sm text-blue-700 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <i className="fas fa-check-circle text-green-600"></i>
                                                        <span>UPI (PhonePe, Google Pay, Paytm)</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <i className="fas fa-check-circle text-green-600"></i>
                                                        <span>Credit/Debit Cards</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <i className="fas fa-check-circle text-green-600"></i>
                                                        <span>Net Banking</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <i className="fas fa-shield-alt text-green-600"></i>
                                                        <span>100% Secure & Encrypted</span>
                                                    </div>
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
                                        {t.back}
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
                                    ) : currentStep === 3 ? t.placeOrder : t.continue}
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

import { React, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import location from "../assets/location.jpg";             
import logincard from "../assets/logincard.png";
import { removeFromCart } from "../store/cartSlice";
import Login from "./Login";

function Delivery() {
  const [pincode, setPincode] = useState(() => {
    const savedPincode = localStorage.getItem('deliveryPincode');
    return savedPincode || "";
  });
  const [submitted, setSubmitted] = useState(() => {
    return localStorage.getItem('deliveryPincode') ? true : false;
  });
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const cartCount = useSelector((state) => state.cart.count);
  const [user, setUser] = useState(null);
  const cartItems = useSelector((state) => state.cart.items) || [];
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    // Reset login card when user logs in
    if (user && showLogin) {
      setShowLogin(false);
    }
  }, [user]);

  const handleSubmit = () => {
    // Basic pincode validation: 6 digits, numeric, not all same digit
    if (!pincode) {
      setError("Please enter a pincode");
      setSubmitted(false);
      localStorage.removeItem('deliveryPincode');
      return;
    }
    if (!/^[0-9]{6}$/.test(pincode)) {
      setError("Pincode must be exactly 6 digits");
      setSubmitted(false);
      localStorage.removeItem('deliveryPincode');
      return;
    }
    if (/^([0-9])\1{5}$/.test(pincode)) {
      setError("Pincode cannot be all the same digit");
      setSubmitted(false);
      localStorage.removeItem('deliveryPincode');
      return;
    }
    setError("");
    setSubmitted(true);
    localStorage.setItem('deliveryPincode', pincode);
  };

  const handleChangePincode = () => {
    setPincode("");
    setSubmitted(false);
    setError("");
    localStorage.removeItem('deliveryPincode');
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setPincode(value);
    }
  };

  const handleNext = () => {
    if (!user) {
      setShowLogin(true);
    } else if (cartItems.length > 0) {
      setShowCartSummary(true);
      setSubmitted(true);
    } 
  };

  const handleBackToPincode = () => {
    setShowLogin(false);
    setShowCartSummary(false);
    // setPincode("");
    setSubmitted(false);
    // localStorage.removeItem('deliveryPincode');
  };

  // Login Card Component
  const LoginCard = () => (
    <div>
      <div>
        <img
          src={logincard}
          alt="Snapdeal"
          className="h-[129px] w-full mt-1 mr-1 ml-1"
        />
      </div>
      <div className="flex flex-col p-4">
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-600 mb-1">Login to your</p>
          <p className="text-sm text-gray-600 mb-4">Snapdeal account</p>
          <div>
          <button
            onClick={() => setShowLoginForm(true)}
            className="bg-[#333333] text-white mb-1 px-8 py-2 text-sm font-medium hover:bg-black cursor-pointer w-full text-center"
          >
            LOG IN
          </button>
          </div>
          <div className="flex mt-4 justify-between items-center w-full">
            <div className="text-xs">
              <span className="text-gray-600">New user? </span>
              <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
            </div>
            <button
              onClick={handleLoginNext}
              className="text-xs px-4 py-1 text-[#666666] border border-gray-300 rounded hover:text-black"
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Cart Summary Card Component
  const CartSummaryCard = () => {
    const handleRemoveFromCart = (e, itemId) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(removeFromCart(itemId));

      if (cartItems.length === 1) {
        setTimeout(() => {
          handleBackToPincode();
        }, 0);
      }
    };

    const truncateText = (text, wordCount) => {
      const words = text.split(' ');
      // if (words.length <= wordCount) return text;
      return words.slice(0, wordCount).join(' ') + '...';
    };

    return (
      <div className="p-4">
        <h2 className="text-xs text-[#b4b4b4] mb-2">Your Cart</h2>
        <div className="text-xs text-[#858585] mb-1">
          There {cartCount === 1 ? 'is' : 'are'} {cartCount} item{cartCount !== 1 ? 's' : ''} in your cart
        </div>
        {cartItems.length > 0 ? (
          <div className="overflow-y-auto mb-4 space-y-2">
            {cartItems.slice(0, 2).map((item) => (
              <div
                key={item.product._id}
                className="flex items-center justify-between p-2 rounded hover:bg-gray-50 group relative"
              >
                <div className="flex items-center">
                  <img
                    src={Array.isArray(item.product.images) ? item.product.images[0] : item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover mr-2"
                  />
                  <div>
                    <p className="font-medium text-xs">{truncateText(item.product.keyword, 3)}</p>
                    <p className="text-gray-600 text-xs">₹{item.product.price}</p>
                    <button className="text-blue-500 text-xs">BUY NOW</button>
                  </div>
                </div>
                <button
                  onClick={(e) => handleRemoveFromCart(e, item.product._id)}
                  className=" opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1  rounded absolute right-2 z-10"
                >
                  X
                </button>
              </div>
            ))}
            {/* {cartItems.length > 2 && (
              <p className="text-gray-600 text-sm text-center">
                +{cartItems.length - 2} more items
              </p>
            )} */}
          </div>
        ) : (
          <div className="text-center text-gray-600 mb-4">
            <p>Your cart is empty</p>
          </div>
        )}
        <div className="flex gap-2 ">
          {cartItems.length > 0 && (
            <Link
              to="/checkout"
              className=" bg-[#333333] text-white py-1 px-8 mt-2 rounded text-center hover:bg-black transition-colors"

            >
              VIEW ALL
            </Link>
          )}
          <button
            onClick={handleBackToPincode}
            className=" px-6  text-[#666666] mt-2 border border-gray-300 rounded hover:text-black"
          >
            NEXT
          </button>
        </div>

      </div>
    );
  };

  const [showCartSummary, setShowCartSummary] = useState(false);

  // When clicking next on login card
  const handleLoginNext = () => {
    if (cartItems.length > 0) {
      setShowCartSummary(true);
      setShowLogin(false);
    } else {
      handleBackToPincode();
    }
  };

  // Render cart summary if showCartSummary is true and cart has items
  if (showCartSummary && cartItems.length > 0) {
    return (
      <div className="flex flex-col h-auto w-[280px] ml-[4px] border border-[#f6f6f6] rounded-sm bg-white shadow-sm">
        <CartSummaryCard />
      </div>
    );
  }

  // Render login card if showLogin is true
  if (showLogin) {
    return (
      <div className="flex flex-col h-auto w-[280px] ml-[4px] border border-[#f6f6f6] rounded-sm bg-white shadow-sm">
        <LoginCard />
      </div>
    );
  }

  // Render cart summary if user is logged in, next is clicked, and cart has items
  if (user && submitted && cartItems.length > 0) {
    return (
      <div className="flex flex-col h-auto w-[280px] ml-[4px] border border-[#f6f6f6] rounded-sm bg-white shadow-sm">
        <CartSummaryCard />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-auto w-[280px] ml-[4px] border border-[#f6f6f6] rounded-sm bg-white shadow-sm p-3">
        {/* Header */}
      <div className="flex items-center justify-center">
        <img src={location} alt="location" />
      </div>
      <div className="text-[10px] text-center mt-1">Your Delivery Pincode</div>

      {/* Subtext */}
      <div className="flex items-center justify-center mt-1 mx-2">
        <p className="text-sm text-gray-600 text-center">
          Enter your pincode to check availability and faster delivery options
        </p>
      </div>

      {/* Input or Pincode */}
      {submitted ? (
        <div className="font-semibold text-lg mx-2 mt-2">Pincode: {pincode}</div>
      ) : (
        <div className="flex flex-col w-full mt-2">
          <input
            type="text"
            placeholder="Enter pincode"
            value={pincode}
            onChange={handleChange}
            maxLength={6}
            className={`border rounded px-3 py-2 text-black w-full`}
          />
          {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col space-y-2 mt-4">
        {submitted ? (
          <div className="flex gap-2">
            <button
              className="bg-gray-600 text-white px-4 py-1.5 rounded hover:bg-gray-700"
              onClick={handleChangePincode}
            >
              Change Pincode
            </button>
            <button
              className={`px-4 py-1.5 text-[#666666] border border-gray-300 rounded hover:text-black ${user && cartCount === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              onClick={handleNext}
              disabled={user && cartCount === 0}
            >
              Next
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              className="bg-[#333333] text-white px-10 py-2 rounded hover:bg-black"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              className={`px-8 py-2 text-[#666666] border border-gray-300 rounded hover:text-black ${user && cartCount === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              onClick={handleNext}
              disabled={user && cartCount === 0}
            >
              Next
            </button>
          </div>
        )}
     
    </div>
     </div>
      {showLoginForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
        <Login onClose={() => setShowLoginForm(false)} setUser={setUser} />
      </div>
    )}

    </>
  );
}

export default Delivery;
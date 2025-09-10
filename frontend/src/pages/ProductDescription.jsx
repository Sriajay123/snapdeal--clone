import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import OTPVerificationPopup from "../components/OTPVerificationPopup";
import ProductDetailsTabs from "../components/ProductDetailsTabs";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { setPincode } from "../store/pincodeSlice";

function ProductDescription() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const dispatch = useDispatch();
  const pincode = useSelector((state) => state.pincode.value);

  // Local UI state for handling pincode input/edit
  const [deliveryPin, setDeliveryPin] = useState("");
  const [isCheckingPin, setIsCheckingPin] = useState(true);
  const [showOTPPopup, setShowOTPPopup] = useState(false);

  const handleBuyNow = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size");
      return;
    }
    setShowOTPPopup(true);
  };

  // Fetch product by ID
  useEffect(() => {
    api
      .get(`/product/${id}`)
      .then((res) => {
        const productData = res.data.product;
        setProduct(productData);
        
        // Set default color if colors are available
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
        
        setLoading(false);
        
        // Save to recently viewed
        const viewedIds = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
        if (!viewedIds.includes(id)) {
          viewedIds.unshift(id); // Add to beginning
          if (viewedIds.length > 10) viewedIds.pop(); // Keep only 10 items
          localStorage.setItem("recentlyViewed", JSON.stringify(viewedIds));
        }
      })
      .catch(() => {
        setError("Failed to load product");
        setLoading(false);
      });
  }, [id]);

  // Load saved pincode on mount
  useEffect(() => {
    const savedPincode = localStorage.getItem("pincode");
    if (savedPincode) {
      dispatch(setPincode(savedPincode));
      setDeliveryPin(savedPincode);
      setIsCheckingPin(false); // show availability if already saved
    }
  }, [dispatch]);

  // Handle Check
  const handleCheckPincode = () => {
    if (deliveryPin.trim() !== "") {
      dispatch(setPincode(deliveryPin));
      localStorage.setItem("pincode", deliveryPin);
      setIsCheckingPin(false);
    } else {
      alert("Please enter a pincode");
    }
  };

  // Handle Change
  const handleChangePincode = () => {
    setIsCheckingPin(true);
  };

  // Handle image zoom
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!product) return <div className="text-center mt-8">Product not found.</div>;

  // Images (create multiple variations for gallery)
  const images = 
    product.images && product.images.length > 0
      ? product.images
      : [
          product.image,
          product.image,
          product.image,
          product.image
        ].filter(Boolean); // Remove any undefined values

  return (
    <>
      <Header />
      <Navbar />
      <div className="bg-[#f7f7f7] min-h-screen">
        {/* Breadcrumbs */}
        <div className=" border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-blue-600 transition-colors">
               
                Home
              </Link>
              <span className="text-gray-400">›</span>
              <Link to="#" className="hover:text-blue-600 transition-colors">
                {product.category || 'Electronics'}
              </Link>
              <span className="text-gray-400">›</span>
              <Link to="#" className="hover:text-blue-600 transition-colors">
                {product.subcategory || product.category || 'Products'}
              </Link>
              <span className="text-gray-400">›</span>
              <span className="text-gray-800 font-medium truncate">
                {product.name}
              </span>
            </nav>
          </div>
        </div>
        <div className="flex justify-center px-4 py-6">
          <div className="w-[1250px] h-[625px] flex gap-8 border border-gray-200 bg-white">
            {/* Left: Image Gallery with Thumbnails */}
            <div className="flex w-1/2 h-full">
              {/* Thumbnail images */}
              <div className="flex flex-col gap-3 mr-4 overflow-y-auto max-h-full py-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img}
                      alt={`thumb-${idx}`}
                      className={`w-16 h-20 object-cover border-2 cursor-pointer transition-all rounded ${
                        selectedImageIdx === idx
                          ? "border-blue-500 shadow-md"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onClick={() => setSelectedImageIdx(idx)}
                    />
                    {selectedImageIdx === idx && (
                      <div className="absolute inset-0 border-2 border-blue-500 rounded bg-blue-100 bg-opacity-20"></div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Main image with zoom */}
              <div className="flex-1 relative bg-white border border-gray-200 h-full overflow-hidden">
                <div 
                  className="relative w-full h-full cursor-crosshair"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={images[selectedImageIdx]}
                    alt={product.name}
                    className={`w-full h-full object-contain transition-transform duration-200 ${
                      isZoomed ? 'scale-150' : 'scale-100'
                    }`}
                    style={
                      isZoomed
                        ? {
                            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                          }
                        : {}
                    }
                  />
                  
                  {/* Zoom indicator */}
                  <div className={`absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm flex items-center transition-opacity duration-200 ${
                    isZoomed ? 'opacity-100' : 'opacity-60'
                  }`}>
                    <i className={`fas mr-2 ${isZoomed ? 'fa-search-minus' : 'fa-search-plus'}`}></i>
                    {isZoomed ? 'Zoom active' : 'Hover to zoom'}
                  </div>
                  
                  {/* Zoom lens overlay */}
                  {isZoomed && (
                    <div 
                      className="absolute border-2 border-blue-400 bg-blue-100 bg-opacity-30 pointer-events-none"
                      style={{
                        width: '100px',
                        height: '100px',
                        left: `${zoomPosition.x}%`,
                        top: `${zoomPosition.y}%`,
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '50%'
                      }}
                    ></div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="w-1/2 flex flex-col px-6 h-full overflow-y-auto">
              <h1 className="text-2xl text-gray-800 leading-tight mb-4">
                {product.name}
              </h1>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-6 mb-4 flex-wrap">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${
                        product.rating >= star ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.174 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
                    </svg>
                  ))}
                  <span className="text-gray-600 text-sm ml-2">({product.rating})</span>
                </div>
                <span className="text-blue-600 text-sm hover:underline cursor-pointer">{product.numReviews || 7505} Ratings</span>
                <span className="text-blue-600 text-sm hover:underline cursor-pointer">{Math.floor((product.numReviews || 7505) * 0.034)} Reviews</span>
                <span className="text-blue-600 text-sm hover:underline cursor-pointer">{Math.floor((product.numReviews || 7505) * 0.003)} Selfies</span>
                <span className="text-blue-600 text-sm cursor-pointer hover:underline">Have a question?</span>
              </div>

              {/* Price */}
              <div className="mb-2">
                <span className="text-sm text-gray-500">MRP </span>
                <span className="line-through text-gray-400 text-base">
                  Rs {product.oldPrice || product.price + 100}
                </span>
                <span className="text-sm text-gray-500 ml-2">(Inclusive of all taxes)</span>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl text-red-600 font-bold">
                  Rs {product.price}
                </span>
                <span className="bg-green-100 text-green-700 px-2 py-1 text-sm font-semibold rounded">
                  {product.oldPrice
                    ? Math.round(100 - (product.price / product.oldPrice) * 100)
                    : Math.round(100 - (product.price / (product.price + 100)) * 100)}
                  % OFF
                </span>
              </div>

              {/* Color Selection */}
              <div className="mb-6">
                <span className="text-gray-700 text-base mb-3 block">Color</span>
                <div className="flex gap-2">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt="color option"
                      className="w-12 h-16 object-cover border-2 border-blue-500 cursor-pointer"
                    />
                    <span className="absolute -bottom-6 left-0 text-xs text-gray-600">Multicolor</span>
                  </div>
                </div>
              </div>

              {/* Size Selection - Only show if product has sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-700 text-base">Size</span>
                    <span className="text-blue-500 text-sm cursor-pointer hover:underline">Size Chart</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={`border px-4 py-2 text-sm font-medium transition-all min-w-[50px] ${
                          selectedSize === size
                            ? "border-blue-500 bg-blue-50 text-blue-600"
                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection - Only show if product has colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <div className="mb-3">
                    <span className="text-gray-700 text-base">Color</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`border px-4 py-2 text-sm font-medium transition-all min-w-[80px] ${
                          selectedColor === color
                            ? "border-green-500 bg-green-50 text-green-600"
                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                        }`}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  className="bg-gray-600 text-white px-8 py-3 font-semibold hover:bg-gray-700 disabled:opacity-50 transition-colors flex-1 max-w-[200px]"
                  onClick={() => {
                    // If product has sizes, require size selection. If no sizes, allow direct add to cart
                    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                      return; // Don't add if sizes exist but none selected
                    }
                    
                    let productToAdd = { ...product };
                    if (product.sizes && product.sizes.length > 0 && selectedSize) {
                      productToAdd.selectedSize = selectedSize;
                    }
                    if (product.colors && product.colors.length > 0) {
                      productToAdd.selectedColor = selectedColor || product.colors[0];
                    }
                    
                    dispatch(addToCart(productToAdd));
                  }}
                  disabled={product.sizes && product.sizes.length > 0 && !selectedSize}
                >
                  ADD TO CART
                </button>
                <button 
                  className="bg-[#e40046] text-white px-8 py-3 font-semibold hover:bg-[#c2003d] transition-colors flex items-center gap-2 flex-1 max-w-[200px] justify-center"
                  onClick={handleBuyNow}
                  disabled={product.sizes && product.sizes.length > 0 && !selectedSize}
                >
                  <i className="fas fa-bolt"></i>
                  BUY NOW
                </button>
              </div>

              {/* Delivery Section */}
              <div className="border-t pt-6">
                <div className="mb-4">
                  <span className="text-gray-700 text-base block mb-3">Delivery</span>
                  {isCheckingPin ? (
                    <div className="flex items-center gap-2 mb-4">
                      <input
                        type="text"
                        placeholder="Enter pincode"
                        value={deliveryPin}
                        onChange={(e) => setDeliveryPin(e.target.value)}
                        className="border border-gray-300 px-3 py-2 flex-1 max-w-xs"
                      />
                      <button
                        className="bg-black text-white px-6 py-2 font-medium hover:bg-gray-800"
                        onClick={handleCheckPincode}
                      >
                        CHECK
                      </button>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="text-gray-800 font-medium">Generally delivered in 5 - 9 days</span>
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Delivery to pincode:</span>
                        <span className="font-medium text-gray-800">{pincode}</span>
                        <button
                          className="text-blue-500 text-sm hover:underline"
                          onClick={handleChangePincode}
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Return Policy */}
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <i className="fas fa-shield-alt text-green-600 mt-1"></i>
                  <div>
                    <span className="font-medium text-gray-800">7 Days Easy Returns</span>
                    <span className="block">We assure easy return of purchased items within 7 days of delivery.</span>
                    <button className="text-blue-500 hover:underline">Know More</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <ProductDetailsTabs product={product} />
      </div>
      
      {/* OTP Verification Popup */}
      <OTPVerificationPopup
        isOpen={showOTPPopup}
        onClose={() => setShowOTPPopup(false)}
        orderTotal={product?.price?.toLocaleString() || "0"}
      />

      
    </>
  );
}

export default ProductDescription;

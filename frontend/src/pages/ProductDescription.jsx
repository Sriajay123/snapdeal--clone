import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { setPincode } from "../store/pincodeSlice";

function ProductDescription() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  const dispatch = useDispatch();
  const pincode = useSelector((state) => state.pincode.value);

  // Local UI state for handling pincode input/edit
  const [deliveryPin, setDeliveryPin] = useState("");
  const [isCheckingPin, setIsCheckingPin] = useState(true);

  // Fetch product by ID
  useEffect(() => {
    api
      .get(`/product/${id}`)
      .then((res) => {
        setProduct(res.data.product);
        setLoading(false);
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

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!product) return <div className="text-center mt-8">Product not found.</div>;

  // Images (fallback to single product.image)
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  return (
    <>
      <Header />
      <Navbar />
      <div className="bg-white p-8 max-w-6xl mx-auto mt-8 rounded shadow flex flex-col md:flex-row gap-8">
        {/* Left: Image Gallery */}
        <div className="flex flex-row w-full md:w-1/2">
          <div className="flex flex-col items-center mr-4">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className={`h-16 w-16 object-contain border rounded mb-2 cursor-pointer ${
                  selectedImageIdx === idx
                    ? "border-[#e40046] ring-2 ring-[#e40046]"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedImageIdx(idx)}
              />
            ))}
          </div>
          <div
            className="rounded bg-gray-50 flex items-center justify-center overflow-hidden"
            style={{ height: 350, width: 350 }}
          >
            <img
              src={images[selectedImageIdx]}
              alt={product.name}
              className="object-contain h-80 w-80 transition-transform duration-300 ease-in-out hover:scale-125 cursor-zoom-in"
            />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <h1 className="text-2xl font-semibold text-gray-800 leading-tight mb-2">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${
                    product.rating >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.174 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600 text-sm">({product.rating})</span>
            <span className="text-blue-600 text-sm ml-2">
              {product.numReviews} Reviews
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-2">
            <span className="line-through text-gray-400 text-lg">
              Rs {product.oldPrice || product.price + 100}
            </span>
            <span className="text-2xl text-red-600 font-bold">
              Rs {product.price}
            </span>
            <span className="text-xs text-gray-600 px-2 py-1 border border-gray-200 rounded">
              {product.oldPrice
                ? Math.round(100 - (product.price / product.oldPrice) * 100)
                : Math.round(100 - (product.price / (product.price + 100)) * 100)}
              % OFF
            </span>
          </div>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-2 flex items-center">
              <span className="font-semibold mr-2">Sizes:</span>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`border px-4 py-1 rounded mr-2 text-sm ${
                    selectedSize === size
                      ? "bg-[#e40046] text-white border-[#e40046]"
                      : "bg-white text-black border-black"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-4 mb-4">
            <button
              className="bg-black text-white px-6 py-2 rounded font-semibold hover:bg-gray-800 disabled:opacity-50"
              onClick={() => {
                if (product.sizes && product.sizes.length > 0 && !selectedSize)
                  return;
                dispatch(
                  addToCart(
                    product.sizes && product.sizes.length > 0
                      ? { ...product, selectedSize }
                      : product
                  )
                );
              }}
              disabled={product.sizes && product.sizes.length > 0 && !selectedSize}
            >
              ADD TO CART
            </button>
            <button className="bg-[#e40046] text-white px-6 py-2 rounded font-semibold hover:bg-[#c2003d]">
              BUY NOW
            </button>
          </div>

          {/* Delivery Check Section */}
          <div className="flex flex-col gap-2 mb-4">
            {isCheckingPin ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter pincode"
                  value={deliveryPin}
                  onChange={(e) => setDeliveryPin(e.target.value)}
                  className="border px-3 py-2 rounded w-32"
                />
                <button
                  className="bg-black text-white px-4 py-2 rounded font-semibold"
                  onClick={handleCheckPincode}
                >
                  Check
                </button>
              </div>
            ) : (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Item is available at{" "}
                  <span className="font-semibold">{pincode}</span>.{" "}
                  <span
                    className="text-blue-600 cursor-pointer"
                    onClick={handleChangePincode}
                  >
                    Change
                  </span>
                </p>
                <ul className="text-sm text-gray-600">
                  <li>
                    Delivery in 6-8 days{" "}
                    <span className="text-green-600">Free</span>
                  </li>
                  <li>Cash on Delivery also available for this location</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  <i className="fa fa-shield text-green-600"></i> 7 Days Easy
                  Returns. We assure easy return of purchased items within 7
                  days of delivery.{" "}
                  <span className="text-blue-600 cursor-pointer">
                    Know More
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDescription;

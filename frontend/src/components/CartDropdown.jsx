import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../store/cartSlice";
import { setPincode } from "../store/pincodeSlice";
import CartFooter from "./CartFooter";

function CartDropdown({ isOpen, onClose }) {
    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const pincode = useSelector((state) => state.pincode.value);
    const [isEditingPincode, setIsEditingPincode] = useState(false);
    const [tempPincode, setTempPincode] = useState(pincode);


    const handleRemove = (id) => {
        dispatch(removeFromCart(id));
    };

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            dispatch(removeFromCart(productId));
        } else {
            dispatch(updateQuantity({ productId, quantity: newQuantity }));
        }
    };

    useEffect(() => {
        setTempPincode(pincode);
    }, [pincode]);

    // Load pincode from localStorage on first mount
    useEffect(() => {
        const savedPincode = localStorage.getItem("pincode");
        if (savedPincode) {
            dispatch(setPincode(savedPincode));
        }
    }, [dispatch]);

    const handleCheckPincode = () => {
        if (tempPincode.trim() !== "") {
            dispatch(setPincode(tempPincode));
            localStorage.setItem("pincode", tempPincode);
            setIsEditingPincode(false);
        } else {
            console.log("Invalid pincode input");
        }
    };

    const subtotal = useMemo(
        () =>
            cart.items.reduce(
                (sum, item) => sum + item.product.price * item.quantity,
                0
            ),
        [cart.items]
    );

    if (!isOpen) return null;

    return (
        <>  
      
            {/* Modal Dialog */}
            <div 
                className="fixed top-[80px] left-1/2 -translate-x-1/2 bg-white rounded shadow-2xl w-[950px] border border-gray-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cart Container */}
                <div className="min-h-[400px]">
                    {/* Cart Heading */}
                    <div className="bg-white px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-normal text-gray-700">
                            Shopping Cart{" "}
                            <span className="text-gray-500">({cart.count} Items)</span>
                        </h3>
                        <button
                            className="text-gray-400 hover:text-gray-600 text-xl"
                            onClick={onClose}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Cart Head Labels */}
                    <div className="bg-white border-b border-gray-100">
                        <div className="px-4 py-2">
                            <div className="grid grid-cols-12 gap-4 text-xs text-gray-600">
                                <div className="col-span-3">
                                    <span>Item Details</span>
                                </div>
                                <div className="col-span-2 text-center">
                                    <span>Price</span>
                                </div>
                                <div className="col-span-2 text-center">Quantity</div>

                                {/* Pincode Section */}
                                <div className="col-span-3 text-center">

                                    {isEditingPincode ? (
                                        <div className="flex gap-1  mb-5 items-center justify-between text-sm text-gray-600 w-full max-w-xs mx-auto">
                                            <span className="whitespace-nowrap text-[12px]">Delivery with Charges</span>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={tempPincode}
                                                    onChange={(e) => setTempPincode(e.target.value)}
                                                    onKeyDown={(e) => e.key === "Enter" && handleCheckPincode()}
                                                    className="border border-gray-300 px-2 py-1 rounded w-20 text-sm text-gray-700 text-center"
                                                />
                                                <button
                                                    className="bg-black text-white px-3 py-1 rounded text-sm font-medium uppercase"
                                                    onClick={handleCheckPincode}
                                                >
                                                    Check
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center  gap-1 mb-3 justify-center text-sm text-gray-600">
                                            <span className="mr-1 text-[12px]  ">Showing Availability at</span>
                                            <span className="text-[#e40046] font-medium">{pincode}</span>
                                            <span
                                                className="ml-2 text-gray-500 cursor-pointer"
                                                onClick={() => setIsEditingPincode(true)}
                                            >
                                                ✏️
                                            </span>
                                        </div>
                                    )}

                                </div>

                                <div className="col-span-2 text-right">
                                    <span>Subtotal</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cart Items List */}
                    <div
                        className="bg-white"
                        style={{ maxHeight: "300px", overflowY: "auto" }}
                    >
                        {cart.items.length === 0 ? (
                            <div className="py-12 text-center text-gray-500">
                                Your cart is empty.
                            </div>
                        ) : (
                            <ul>
                                {cart.items.map(({ product, quantity }) => (
                                    <li
                                        key={product._id}
                                        className="border-b border-gray-100"
                                    >
                                        <div className="grid grid-cols-12 gap-4 px-4 py-4 items-start">
                                            {/* Product Image */}
                                            <div className="col-span-3 flex items-start gap-3">
                                                <div className="product-image">
                                                    <img
                                                        className="w-16 h-16 object-contain border border-gray-200 rounded p-1"
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                    />
                                                </div>
                                                <div className="product-details flex-1">
                                                    <div className="product-name mb-2">
                                                        <span className="text-sm text-gray-800 leading-tight">
                                                            {product.name}
                                                        </span>
                                                    </div>
                                                    <p className="product-attributes text-xs text-gray-500 mb-2">
                                                        {product.selectedSize && (
                                                            <>
                                                                <span> | </span>
                                                                <span>Size: {product.selectedSize}</span>
                                                            </>
                                                        )}
                                                        {product.colors && product.colors.length > 0 && (
                                                            <>
                                                                <span> | </span>
                                                                <span>Color: {product.selectedColor || product.colors[0]}</span>
                                                            </>
                                                        )}
                                                    </p>
                                                    <div className="remove-button">
                                                        <button
                                                            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                                                            onClick={() => handleRemove(product._id)}
                                                        >
                                                            ✕ REMOVE
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="col-span-2 price-section text-center">
                                                <span className="text-sm font-medium">
                                                    Rs. {product.price}
                                                </span>
                                            </div>

                                            {/* Quantity */}
                                            <div className="col-span-2 quantity-section text-center">
                                                <select
                                                    className="border border-gray-300 rounded px-2 py-1 text-sm w-16 bg-white focus:outline-none"
                                                    value={quantity}
                                                    onChange={(e) =>
                                                        handleQuantityChange(
                                                            product._id,
                                                            parseInt(e.target.value)
                                                        )
                                                    }
                                                >
                                                    {[...Array(10)].map((_, i) => (
                                                        <option key={i + 1} value={i + 1}>
                                                            {i + 1}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Delivery Container */}
                                            <div className="col-span-3 delivery-section text-center">
                                                <div className="delivery-info">
                                                    <span className="text-xs text-gray-600">
                                                        Standard Delivery By 15 Sep - 17 Sep
                                                        <span className="text-green-600 font-semibold ml-1">
                                                            FREE
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Subtotal */}
                                            <div className="col-span-2 subtotal-section text-right">
                                                <span className="text-sm font-medium">
                                                    Rs. {(product.price * quantity).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Cart Footer */}
                
               <CartFooter subtotal={subtotal} onCartClose={onClose} />
            </div>
             
           
        </>
    );
}

export default CartDropdown;

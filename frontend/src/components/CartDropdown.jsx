import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../store/cartSlice";

function CartDropdown({ isOpen, onClose }) {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

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

  const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div className="inset-0 " onClick={onClose}></div>
      
      {/* Modal Dialog */}
      <div className="absolute top-[100px] right-0 mt-2 bg-white rounded shadow-2xl w-[950px] z-50 border border-gray-200">
        
        {/* Cart Container */}
        <div className="cart-container" style={{ minHeight: '400px' }}>
          
          {/* Cart Heading */}
          <div className="cart-heading bg-white px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-normal text-gray-700">
              Shopping Cart <span className="text-gray-500">({cart.count} Items)</span>
            </h3>
            <button 
              className="text-gray-400 hover:text-gray-600 text-xl"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          {/* Cart Head Labels */}
          <div className="cart-head-label-wrapper bg-white border-b border-gray-100">
            <div className="cart-head-label px-4 py-2">
              <div className="grid grid-cols-12 gap-4 text-xs text-gray-600">
                <div className="col-span-3">
                  <span>Item Details</span>
                </div>
                <div className="col-span-2 text-center">
                  <span>Price</span>
                </div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-3 text-center">
                  <span>Showing Availability at</span> 
                  <span className="text-[#e40046] font-medium ml-1">584128</span> 
                  <span className="ml-1 text-[#e40046] cursor-pointer">✏️</span>
                </div>
                <div className="col-span-2 text-right">
                  <span>Subtotal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="cart-items-list bg-white" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {cart.items.length === 0 ? (
              <div className="py-12 text-center text-gray-500">Your cart is empty.</div>
            ) : (
              <ul>
                {cart.items.map(({ product, quantity }, index) => (
                  <li key={product._id} className="cart-item border-b border-gray-100">
                    <div className="grid grid-cols-12 gap-4 px-4 py-4 items-start">
                      
                      {/* Product Image */}
                      <div className="col-span-3 flex items-start gap-3">
                        <div className="img-field">
                          <img 
                            className="item-image w-16 h-16 object-contain border border-gray-200 rounded p-1" 
                            src={product.image} 
                            alt={product.name}
                          />
                        </div>
                        <div className="item-description flex-1">
                          <div className="item-name-wrapper mb-2">
                            <span className="item-name text-sm text-gray-800 leading-tight">{product.name}</span>
                          </div>
                          <p className="item-extra-feature text-xs text-gray-500 mb-2">
                            {product.selectedSize && (
                              <>
                                <span> | </span>
                                <span>Size: {product.selectedSize}</span>
                                <span> | </span>
                                <span>Color: Orange</span>
                              </>
                            )}
                          </p>
                          <div className="remove-item-div">
                            <button 
                              className="remove-item-shortlist text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                              onClick={() => handleRemove(product._id)}
                            >
                              ✕ REMOVE
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 unit-price-block text-center">
                        <span className="item-price text-sm font-medium">Rs. {product.price}</span>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2 cart-item-quantity text-center">
                        <select 
                          className="item-quantity border border-gray-300 rounded px-2 py-1 text-sm w-16 bg-white focus:outline-none"
                          value={quantity}
                          onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value))}
                        >
                          {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                      </div>

                      {/* Delivery Container */}
                      <div className="col-span-3 delivery-container text-center">
                        <div className="delivery-options">
                          <span className="text-xs text-gray-600">
                            Standard Delivery By 15 Sep - 17 Sep 
                            <span className="avail-free text-green-600 font-semibold ml-1">FREE</span>
                          </span>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-2 cart-item-details text-right">
                        <span className="item-subtotal-black text-sm font-medium">
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
        <div className=" bg-black border-t border-gray-200 width-full" style={{ height: '120px' }}>
          <div className="cart-footer-content px-4 py-4">
            <div className="flex">
              
              {/* Left Side - Trust and Security (col-xs-11) */}
              <div className="flex-1 cart-trust-wrap pr-8"> {/* Increased padding-right for left side */}
                <div className="cart-message text-xs text-gray-400 mb-3">
                  Delivery and payment options can be selected later
                </div>
                <div className="cart-security-footer flex gap-8 text-xs text-gray-400"> {/* Increased gap between items */}
                  <div className="safe-secure flex items-center gap-2">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Safe and Secure Payments
                  </div>
                  <div className="trustpay flex items-center gap-2">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    100% Payment Protection, Easy Returns Policy
                  </div>
                </div>
              </div>

              {/* Right Side - Bill Summary and Button */}
              <div className="flex gap-4">
                {/* Bill Summary (col-xs-6) */}
                <div className="cart-bill-summary">
                  <div className="cart-bill-wrapper">
                    <div className="sub-total-charges">
                      <div className="cart-sub-total text-right mb-1 overflow-hidden">
                        <label className="float-left text-sm text-gray-400">Sub Total: </label>
                        <span className="float-right text-sm font-bold text-white">Rs. {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="cart-sub-total text-right mb-3 overflow-hidden">
                        <label className="float-left text-sm text-gray-400">Delivery Charges: </label>
                        <span className="delivery-color text-green-400 font-bold text-sm float-right">FREE</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Button Section (col-xs-7) */}
                <div className="cart-bill-summary">
                  <div className="cart-bill-wrapper">
                    <button 
                      type="button"
                      className="btn btn-xl cart-button bg-[#e40046] text-white font-bold text-sm hover:bg-[#c2003d] transition-colors py-3 px-6 rounded"
                      style={{ lineHeight: '0', width: '100%' }}
                    >
                      PROCEED TO PAY Rs. {subtotal.toLocaleString()}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartDropdown;

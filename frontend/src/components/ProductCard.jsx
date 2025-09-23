import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white border border-gray-200 hover:border-[#f6f6f6] hover:shadow-xl hover:bg-white transition-all duration-200 group relative">
      <Link to={`/product/${product.keyword.toLowerCase().replace(/\s+/g, '-')}/${product._id}`}>
        <div className="relative">
          <img
            src={product.images[0] || "https://source.unsplash.com/random/300x300/?product"}
            alt={product.name}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://source.unsplash.com/random/300x300/?product";
            }}
          />
          {/* Offer Tag */}
          {product.mrp > product.price && (
            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs rounded">
              {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
            </div>
          )}
          
          {/* Quick View Button - Shows on Hover */}
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <button 
              onClick={(e) => {
                e.preventDefault();
                // Add quick view functionality here
              }} 
              className="bg-white text-gray-800 px-6 py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              QUICK VIEW
            </button>
          </div>
        </div>
        <div className="p-3">
          <div className="h-10">
            <h3 className="text-sm text-gray-800 font-medium hover:text-[#e40046] transition-colors line-clamp-2 leading-tight">
              {product.name}
            </h3>
          </div>
          
          {/* Size Options */}
          <div className="flex gap-2 mb-2 mt-2">
            {['38', '40', '42', '44'].map(size => (
              <div 
                key={size} 
                className="w-7 h-7 border border-gray-300 flex items-center justify-center text-xs cursor-pointer hover:border-[#e40046] transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  // Add size selection functionality
                }}
              >
                {size}
              </div>
            ))}
          </div>
          
          {/* Color Options */}
          <div className="flex gap-2 mb-3">
            <div 
              className="w-6 h-6 border border-gray-300 bg-white cursor-pointer hover:border-[#e40046] transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // Add color selection functionality
              }}
            ></div>
            <div 
              className="w-6 h-6 border border-gray-300 bg-[#51d67a] cursor-pointer hover:border-[#e40046] transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // Add color selection functionality
              }}
            ></div>
          </div>

          {/* Price and Discount */}
          <div className="flex items-center gap-2 flex-nowrap">
            <span className="line-through text-gray-400 text-sm whitespace-nowrap">
              Rs {product.oldPrice || product.price + 100}
            </span>
            <span className="text-[#333333] text-md whitespace-nowrap">
              Rs {product.price}
            </span>
            <span className="text-xs text-gray-600 px-2 py-1 border border-gray-200 rounded shrink-0 whitespace-nowrap">
              {product.oldPrice
                ? Math.round(100 - (product.price / product.oldPrice) * 100)
                : Math.round(100 - (product.price / (product.price + 100)) * 100)}
              % OFF
            </span>
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="mt-2 flex items-center">
              {[1, 2, 3, 4, 5].map(star => (
                <svg
                  key={star}
                  className={`w-3 h-3 mr-1 ${product.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.174 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
                </svg>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
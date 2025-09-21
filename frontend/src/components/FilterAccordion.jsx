import React, { useState } from 'react';

const FilterAccordion = ({ 
  title, 
  type = 'checkbox', // checkbox, radio, or star
  options,
  selectedValues = [],
  onChange,
  showCount = true,
  defaultOpen = true,
  priceRange,
  onPriceChange
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const renderStarRating = (rating) => {
    return (
      <div className="flex text-yellow-400 text-sm">
        {[...Array(rating)].map((_, i) => (
          <span key={i}>★</span>
        ))}
        <span className="text-gray-600 ml-1">& Up</span>
      </div>
    );
  };

  const renderPriceFilter = () => {
    if (!priceRange) return null;
    const { min, max, currentMin, currentMax, onMinChange, onMaxChange, onApply } = priceRange;

    return (
      <div className="space-y-4">
        <div className="relative mb-4 px-2">
          {/* Price labels at top */}
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Rs {min}</span>
            <span>Rs {max}</span>
          </div>
          {/* Slider track */}
          <div className="relative h-1 bg-gray-300">
            <div 
              className="absolute h-1 bg-black transition-all duration-150"
              style={{
                left: `${((currentMin - min) / (max - min)) * 100}%`,
                width: `${((currentMax - currentMin) / (max - min)) * 100}%`
              }}
            ></div>
            {/* Slider thumbs */}
            <input 
              type="range"
              name="min"
              min={min}
              max={max}
              step="1"
              value={currentMin}
              onChange={onMinChange}
              className="pointer-events-none absolute w-full h-1 -top-1 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:hover:bg-gray-800 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:hover:bg-gray-800 z-30"
            />
            <input 
              type="range"
              name="max"
              min={min}
              max={max}
              step="1"
              value={currentMax}
              onChange={onMaxChange}
              className="pointer-events-none absolute w-full h-1 -top-1 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:hover:bg-gray-800 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:hover:bg-gray-800 z-20"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 px-2">
          {/* Min price input */}
          <div className="relative flex-1">
            <span className="absolute text-gray-600 text-xs left-2 top-1/2 -translate-y-1/2">Rs</span>
            <input 
              type="number"
              min={min}
              max={max}
              value={currentMin}
              onChange={onMinChange}
              className="w-full pl-6 pr-2 py-1 border border-gray-300 text-sm rounded focus:outline-none focus:border-gray-400 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <span className="text-gray-400">-</span>
          {/* Max price input */}
          <div className="relative flex-1">
            <span className="absolute text-gray-600 text-xs left-2 top-1/2 -translate-y-1/2">Rs</span>
            <input 
              type="number"
              min={min}
              max={max}
              value={currentMax}
              onChange={onMaxChange}
              className="w-full pl-6 pr-2 py-1 border border-gray-300 text-sm rounded focus:outline-none focus:border-gray-400 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <button 
            onClick={onApply}
            className="px-3 py-1 bg-white text-red-500 text-sm border border-red-500 rounded hover:bg-red-50"
          >
            GO
          </button>
        </div>
      </div>
    );
  };

  const renderCheckboxFilter = () => {
    return (
      <div className="space-y-2">
        {options.map((option) => (
          <label 
            key={option.value} 
            className="flex items-center justify-between text-sm cursor-pointer group"
          >
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => onChange(option.value)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <div className="flex items-center">
                {type === 'star' ? renderStarRating(option.value) : (
                  <span className="text-gray-700 group-hover:text-red-600">
                    {option.label}
                  </span>
                )}
              </div>
            </div>
            {showCount && (
              <span className="text-gray-400 text-xs">{option.count || 0}</span>
            )}
          </label>
        ))}
      </div>
    );
  };

  const renderColorFilter = () => {
    return (
      <div className="space-y-2">
        {options.map((option) => (
          <label 
            key={option.value} 
            className="flex items-center justify-between text-sm cursor-pointer group"
          >
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => onChange(option.value)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: option.value.toLowerCase() }}
                ></div>
                <span className="text-gray-700 group-hover:text-red-600">
                  {option.label}
                </span>
              </div>
            </div>
            {showCount && (
              <span className="text-gray-400 text-xs">{option.count || 0}</span>
            )}
          </label>
        ))}
      </div>
    );
  };

  return (
    <div className="mb-6">
      <div 
        className="flex items-center justify-between border-b pb-2 mb-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <span className="text-xl text-gray-400">{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && (
        <div className="mx-0">
          {type === 'price' && renderPriceFilter()}
          {type === 'color' && renderColorFilter()}
          {(type === 'checkbox' || type === 'star') && renderCheckboxFilter()}
        </div>
      )}
    </div>
  );
};

export default FilterAccordion;
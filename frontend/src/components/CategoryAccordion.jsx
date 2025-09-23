import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const CategoryAccordion = ({
  title,
  currentCategory,
  currentSubcategory,
  categoryData,
  baseUrl = '/products'
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);
  const location = useLocation();

  // Set expanded subcategory based on current route
  useEffect(() => {
    if (currentSubcategory) {
      setExpandedSubcategory(currentSubcategory);
    }
  }, [currentSubcategory]);

  // Function to render subcategory items with count

   const renderSubcategoryItem = (key, subcategory, count) => {
  return (
    <div className="flex justify-between items-center text-sm text-gray-700 hover:text-red-600 cursor-pointer">
      <Link 
        to={`${baseUrl}/${encodeURIComponent(currentCategory)}/${encodeURIComponent(key)}`}
        className="flex justify-between items-center w-full"
      >
        <span>{subcategory.name}</span>
        <span className="text-gray-400">{count || 0}</span>
      </Link>
    </div>
  );
};

  // Function to render subcategory types
  const renderSubcategoryTypes = (types) => (
    <div className="ml-6 space-y-1">
      {types.map((type, index) => (
        <div 
          key={index}
          className="flex justify-between items-center text-sm text-gray-700 hover:text-red-600 cursor-pointer"
        >
          <span>{type}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mb-6">
      {/* Accordion Header */}
      <div 
        className="flex items-center text-sm font-medium text-gray-900 mb-3 pb-2 border-b border-gray-200 cursor-pointer"
        onClick={() => {
          setIsAccordionOpen(!isAccordionOpen);
          if (!isAccordionOpen) {
            setExpandedSubcategory(null);
          }
        }}
      >
        <span className="text-lg mr-2">
          {isAccordionOpen ? '−' : '+'}
        </span>
        <h3>{title}</h3>
      </div>

      {/* Accordion Content */}
      {isAccordionOpen && (
        <div className="space-y-2 ml-4">
          {currentSubcategory ? (
            // Show only current subcategory when in subcategory page
            <div>
              <div 
                className="flex items-center text-sm text-red-600 mb-2 cursor-pointer"
                onClick={() => setExpandedSubcategory(
                  expandedSubcategory === currentSubcategory ? null : currentSubcategory
                )}
              >
                <span className="text-lg mr-2">
                  {expandedSubcategory === currentSubcategory ? '−' : '+'}
                </span>
                <span>{categoryData.subcategories[currentSubcategory].name}</span>
              </div>
              {expandedSubcategory === currentSubcategory && (
                renderSubcategoryTypes(categoryData.subcategories[currentSubcategory].subTypes)
              )}
            </div>
          ) : (
            // Show all subcategories in main category page
            Object.entries(categoryData.subcategories).map(([key, subcategory]) => (
              <div key={key}>
                {renderSubcategoryItem(key, subcategory, subcategory.count)}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryAccordion;
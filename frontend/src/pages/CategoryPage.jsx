import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import SortDropdown from '../components/SortDropdown';
import CategoryAccordion from '../components/CategoryAccordion';
import FilterAccordion from '../components/FilterAccordion';
import { sortProducts } from '../utils/sortProducts';
import api from '../api/api';
import categoryFilters from '../data/categoryFilters';
import TrendingSearches from '../components/TrendingSearches';

// Utility function to return the original name since we're using the exact database names now
const getDisplayName = (name) => name;

// Define category structure
const categoryStructure = {


    "Footwear":{
    name:"Footwear",
    subcategories: {
    'Sports Shoes': {
        name: 'Sports Shoes',
        subTypes: ['Running Shoes', 'Training Shoes', 'Walking Shoes', 'Cricket Shoes', 'Football Shoes']
    },
    'Casual Shoes': {
      name: 'Casual Shoes',
      subTypes:['Casual Shoes For Men','Loafers For Men',' Formal Shoes For Men',
         'Slippers For Men','Boots For Men','Ethnic Footwear For Men','Men Shoes Accessories','Men-Sandals & Floater']
    },
    'Slippers & Flip Flops':{
      name:'Slippers & Flip Flops',
      subTypes:['Slippers For Men','Boots For Men','Ethnic Footwear For Men','Men Shoes Accessories','Men-Sandals & Floater'],
    },
    'Sandals & Floaters':{
     name:'Sandals & Floaters',
     subType:[
      ''
     ]
    
    }
  }
  },
 

  "Men's Fashion": {
    name: "Men's Fashion",
    subcategories: {
      'Shirts': {
        name: 'Shirts',
        subTypes: ['Casual Shirts', 'Formal Shirts', 'Party Shirts', 'Denim Shirts']
      },
      'T-Shirts': {
        name: 'T-Shirts',
        subTypes: ['Polo T-Shirts', 'Round Neck T-Shirts', 'Printed T-Shirts', 'Graphic T-Shirts']
      },
      'Jeans': {
        name: 'Jeans',
        subTypes: ['Slim Fit Jeans', 'Regular Fit Jeans', 'Skinny Fit Jeans', 'Straight Fit Jeans']
      },
      'Trousers': {
        name: 'Trousers',
        subTypes: ['Formal Trousers', 'Casual Trousers', 'Chinos', 'Cargo Pants']
      },
      'Sportswear': {
        name: 'Sportswear',
        subTypes: ['Track Pants', 'Sports T-Shirts', 'Track Suits', 'Gym Wear']
      },
      'Shorts': {
        name: 'Shorts',
        subTypes: ['Casual Shorts', 'Sports Shorts', 'Denim Shorts', 'Cargo Shorts']
      },
      'Winter Wear': {
        name: 'Winter Wear',
        subTypes: ['Sweaters', 'Jackets', 'Hoodies', 'Sweatshirts']
      },
      'Ethnic Wear': {
        name: 'Ethnic Wear',
        subTypes: ['Kurtas', 'Nehru Jackets', 'Sherwanis', 'Dhotis']
      },
      'Innerwear': {
        name: 'Innerwear',
        subTypes: ['Briefs', 'Boxers', 'Vests', 'Thermal Wear']
      },
      'Suits': {
        name: 'Suits & Blazers',
        subTypes: ['Formal Suits', 'Party Wear Suits', 'Blazers', 'Tuxedos']
      },
      'Accessories': {
        name: 'Accessories',
        subTypes: ['Belts', 'Wallets', 'Ties', 'Socks']
      },
      // 'Footwear': {
      //   name: 'Footwear',
      //   subTypes: ['Sports Shoes', 'Casual Shoes', 'Formal Shoes', 'Sandals']
      // },
      'sports-shoes': {
        name: 'Sports Shoes',
        subTypes: ['Training Shoes', 'Basketball Shoes', 'Cricket Shoes', 'Running Shoes']
      }
    }
  },



  "Women's Fashion": {
    name: "Women's Fashion",
    subcategories: {
      'Sarees': {
        name: 'Sarees',
        subTypes: ['Silk Sarees', 'Cotton Sarees', 'Party Wear Sarees']
      },
      'Kurtis': {
        name: 'Kurtis',
        subTypes: ['Casual Kurtis', 'Party Wear Kurtis', 'Office Wear Kurtis']
      },
      'Dresses': {
        name: 'Dresses',
        subTypes: ['Casual Dresses', 'Party Dresses', 'Maxi Dresses']
      },
      'Ethnic Wear': {
        name: 'Ethnic Wear',
        subTypes: ['Lehengas', 'Salwar Suits', 'Dress Materials']
      }
    }
  },

  "Ethnic Wear":{
     name:"Ethnic Wear",
     subcategories:{
      'Sarees':{
        name: 'Sarees',
         subTypes: ['Silk Sarees', 'Cotton Sarees', 'Party Wear Sarees']
      }
     }

  },
  "Women Footwear":{
    name:"Women Footwear",
    subcategories:{
      'Heels':{ 
        name:'Heels',
        subTypes:['Stilettos','Wedges','Block Heels','Kitten Heels']
      },
      
    },
  },


  "KitchenAppliances":{
    name:"Kitchen Appliances",
    subcategories:{ 
      'Juicer Mixer Grinders':{
        name:'Juicer Mixer Grinders',
        subTypes:['Juicer Mixer Grinders','Mixer Grinders','Juicers'] 
      }
    }
  },


  "Kids & Toys": {
    name: "Kids & Toys",
    subcategories: {
      'Toys': {
        name: 'Toys',
        subTypes: ['Educational Toys', 'Soft Toys', 'Outdoor Toys', 'Board Games']
      },
      'Kids Clothing': {
        name: 'Kids Clothing',
        subTypes: ['Boys Clothing', 'Girls Clothing', 'Baby Clothing']
      },
      'School Supplies': {
        name: 'School Supplies',
        subTypes: ['School Bags', 'Stationery', 'Lunch Boxes']
      }
    }
  },
  'Electronics': {
    name: "Electronics",
    subcategories: {
      'Mobile Phones': {
        name: 'Mobile Phones',
        subTypes: ['Smartphones', 'Feature Phones', 'Mobile Accessories']
      },
      'Laptops': {
        name: 'Laptops',
        subTypes: ['Gaming Laptops', 'Business Laptops', 'Student Laptops']
      },
      'Audio': {
        name: 'Audio',
        subTypes: ['Headphones', 'Speakers', 'Earbuds']
      }
    }
  }
};

function CategoryPage() {
  const { category, subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('popularity');
  const defaultPriceRange = categoryFilters[category]?.default?.priceRange || { min: 103, max: 2289 };
  const [minPrice, setMinPrice] = useState(defaultPriceRange.min);
  const [maxPrice, setMaxPrice] = useState(defaultPriceRange.max);
  const [appliedPriceRange, setAppliedPriceRange] = useState({ min: minPrice, max: maxPrice });
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showAllOptions, setShowAllOptions] = useState({});
  const [deliveryPincode, setDeliveryPincode] = useState("584128");

  // Use category and subcategory directly from URL params since we're using consistent names
  const baseCategory = category;
  const urlSubcategory = subcategory;
  
  const categoryInfo = categoryStructure[baseCategory];
  const subcategoryInfo = categoryInfo?.subcategories[urlSubcategory];

  useEffect(() => {
    fetchProducts();
    // Reset error state when category/subcategory changes
    setError(null);
  }, [category, subcategory, baseCategory, urlSubcategory, appliedPriceRange, selectedFilters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Directly use the category and subcategory names since we're using consistent names
      let endpoint = `/api/product/category/${encodeURIComponent(category)}`;
      if (subcategory) {
        endpoint += `/${encodeURIComponent(subcategory)}`;
      }

      // Add filters to query params
      const queryParams = new URLSearchParams();
      
      // Add price range
      queryParams.append('minPrice', appliedPriceRange.min);
      queryParams.append('maxPrice', appliedPriceRange.max);
      
      // Add selected filters
      Object.entries(selectedFilters).forEach(([key, values]) => {
        if (values && values.length > 0) {
          if (key === 'rating') {
            // Convert rating filter to number (e.g., "4★ & above" -> 4)
            const rating = parseInt(values[0]);
            if (!isNaN(rating)) {
              queryParams.append('minRating', rating);
            }
          } else if (key === 'discount') {
            // Convert discount range (e.g., "10-20" -> min: 10, max: 20)
            const [min, max] = values[0].split('-').map(Number);
            if (!isNaN(min)) queryParams.append('minDiscount', min);
            if (!isNaN(max)) queryParams.append('maxDiscount', max);
          } else {
            // For color, brand, size, etc.
            queryParams.append(key, values.join(','));
          }
        }
      });

      const queryString = queryParams.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }
      
      const response = await api.get(endpoint);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        setError(response.data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.response?.data?.message || 'Failed to load products. Please try again later.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    const sortedProducts = sortProducts([...products], value);
    setProducts(sortedProducts);
  };

  const handlePriceRangeChange = (e) => {
    const value = parseInt(e.target.value);
    if (e.target.name === 'min') {
      setMinPrice(Math.min(value, maxPrice - 1));
    } else {
      setMaxPrice(Math.max(value, minPrice + 1));
    }
    setPriceRange([minPrice, maxPrice]);
  };

  const renderBreadcrumbs = () => {
    // Don't render if we don't have category info
    if (!categoryInfo) return null;

    return (
      <div className="bg-[#f7f7f7]">
        <div className="max-w-7xl ml-27 px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            {/* Home Link */}
            <Link to="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <span className="text-gray-400">/</span>

            {/* Category Link */}
            <Link 
              to={`/products/${encodeURIComponent(baseCategory)}`} 
              className="hover:text-red-600 transition-colors"
            >
              {baseCategory}
            </Link>

            {/* Subcategory Link - only show if we have subcategory info */}
            {(subcategoryInfo || urlSubcategory === 'Sports-Shoes') && (
              <>
                <span className="text-gray-400">/</span>
                <Link 
                  to={`/products/${encodeURIComponent(baseCategory)}/${encodeURIComponent(urlSubcategory)}`}
                  className="hover:text-red-600 transition-colors"
                >
                  {urlSubcategory === 'Sports-Shoes' ? 'Sports Shoes' : subcategoryInfo?.name || urlSubcategory}
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    );
  };

  const renderSidebar = () => {
    // Get the appropriate filters based on category and subcategory
    const currentFilters = urlSubcategory
      ? categoryFilters[baseCategory]?.subcategories?.[urlSubcategory]
      : categoryFilters[baseCategory]?.default;

    // Add counts to subcategories
    const categoryDataWithCounts = categoryInfo ? {
      ...categoryInfo,
      subcategories: Object.entries(categoryInfo.subcategories).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: {
          ...value,
          path: key,
          count: products.filter(p => p.subcategory === value.name).length
        }
      }), {})
    } : null;

    // Get rating options
    const ratingOptions = [
      { value: 4, label: '4★ & above' },
      { value: 3, label: '3★ & above' },
      { value: 2, label: '2★ & above' },
    ];

    // Get current filters based on category and subcategory
    const availableFilters = urlSubcategory
      ? categoryFilters[baseCategory]?.subcategories?.[urlSubcategory]
      : categoryFilters[baseCategory]?.default;

    // Convert the filters to the format needed by FilterAccordion
    const filterOptions = {
      rating: ratingOptions,
      ...(availableFilters && Object.entries(availableFilters).reduce((acc, [key, filter]) => {
        if (key === 'priceRange') return acc; // Skip priceRange as it's handled separately
        if (!filter || !filter.options) return acc; // Skip if filter or options are undefined
        return {
          ...acc,
          [key]: filter.options.map(option => ({
            value: option,
            label: option,
            
          }))
        };
      }, {}))
    };

    return (
      <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
        {/* Category Accordion */}
        {categoryInfo && (
          <CategoryAccordion
            title={getDisplayName(baseCategory)}
            currentCategory={baseCategory}
            currentSubcategory={urlSubcategory}
            categoryData={categoryDataWithCounts}
            baseUrl="/products"
          />
        )}

        {/* Price Filter */}
        <FilterAccordion
          title="Price"
          type="price"
          priceRange={{
            min: defaultPriceRange.min,
            max: defaultPriceRange.max,
            currentMin: minPrice,
            currentMax: maxPrice,
            onMinChange: (e) => {
              const value = parseInt(e.target.value) || defaultPriceRange.min;
              if (value < maxPrice) {
                setMinPrice(Math.max(value, defaultPriceRange.min));
              }
            },
            onMaxChange: (e) => {
              const value = parseInt(e.target.value) || defaultPriceRange.max;
              if (value > minPrice) {
                setMaxPrice(Math.min(value, defaultPriceRange.max));
              }
            },
            onApply: () => {
              setAppliedPriceRange({ min: minPrice, max: maxPrice });
              fetchProducts();
            }
          }}
        />

        {/* Dynamic Filters */}
        {filterOptions && Object.entries(filterOptions).map(([filterKey, options]) => {
          if (!options) return null;
          
          // Determine filter type based on filterKey
          let filterType = 'checkbox';
          if (filterKey === 'rating') filterType = 'star';
          if (filterKey === 'color') filterType = 'color';

          // Get appropriate title based on filterKey
          const getTitleCase = (str) => str.charAt(0).toUpperCase() + str.slice(1);
          const title = filterKey === 'rating' ? 'Customer Rating' : getTitleCase(filterKey);

          return (
            <FilterAccordion
              key={filterKey}
              title={title}
              type={filterType}
              options={options}
              selectedValues={selectedFilters[filterKey] || []}
              onChange={(value) => {
                setSelectedFilters(prev => {
                  const newFilters = {
                    ...prev,
                    [filterKey]: prev[filterKey]?.includes(value)
                      ? prev[filterKey].filter(v => v !== value)
                      : [...(prev[filterKey] || []), value]
                  };
                  
                  // If no values are selected for this filter, remove it from selectedFilters
                  if (newFilters[filterKey].length === 0) {
                    delete newFilters[filterKey];
                  }
                  
                  return newFilters;
                });
                // Fetch products with new filters
                fetchProducts();
              }}
            />
          );
        })}
      </div>
    );
  };

  const renderProducts = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading products...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="mb-4">
            <i className="fas fa-exclamation-circle text-4xl text-red-500"></i>
          </div>
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchProducts} 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="mb-4 flex justify-center">
            <svg 
              className="w-16 h-16 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p className="text-gray-600 text-lg">No products found in this category</p>
          <p className="text-gray-500 mt-2">Try selecting a different category or removing filters</p>
        </div>
      );
    }

    return (
      <div>
       {/* Delivery Location*/}
        <div className="flex items-center gap-2  mb-6 border-b border-gray-300 bg-white">
            <input type="checkbox" className="mr-2 h-3 w-3" />
          <span className="text-gray-600 mb-2">Deliver to:</span>
          <span className="text-red-600 mb-2">584128</span>
          
        </div>
        

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product.name.toLowerCase().replace(/\s+/g, '-')}/${product._id}`}
              className="bg-white border border-gray-200 hover:border-[#f6f6f6] hover:shadow-xl hover-bg-white transition-all duration-200"
            >
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
              </div>
              <div className="p-3">
                <h3 className="text-sm text-gray-800 mb-2 line-clamp-2 leading-tight h-10">
                  {product.name}
                </h3>
                
                
                <div className="flex items-center gap-2 flex-nowrap">
                          <span className="line-through text-gray-400 text-sm whitespace-nowrap">
                            Rs {product.oldPrice || product.price + 100}
                          </span>
                          <span className=" text-[#333333] text-md whitespace-nowrap">
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
                  <div className="mb-2 flex items-center">
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
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />

      {renderBreadcrumbs()}
      <TrendingSearches/>
      <div className="max-w-7xl mx-auto px-4 py-6">

        <div className="flex gap-6">
          {renderSidebar()}
          <div className="flex-1">
            <div className="bg-white p-4 mb-4 flex justify-between items-center">
              <h1 className="text-xl font-medium text-gray-900">
                {subcategoryInfo ? getDisplayName(urlSubcategory) : getDisplayName(baseCategory)}
              </h1>
              <SortDropdown value={sortBy} onChange={handleSortChange} />
            </div>
            {renderProducts()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
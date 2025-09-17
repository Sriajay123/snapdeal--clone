import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import { Link, Outlet, useLocation } from 'react-router-dom'
import api from '../api/api'
import SortDropdown from '../components/SortDropdown';
import sortProducts from '../utils/sortProducts';

function MenFashion() {
  const [sortBy, setSortBy] = useState('Popularity');
  const [priceRange, setPriceRange] = useState([30, 9129]);
  const [minPrice, setMinPrice] = useState(30);
  const [maxPrice, setMaxPrice] = useState(9129);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);
  const location = useLocation();

  // Fetch all men's fashion products when component mounts
  useEffect(() => {
    fetchMensFashionProducts();
  }, []);

  // Auto-expand subcategories based on current route
  useEffect(() => {
    if (expandedCategory === null) {
      if (location.pathname.includes('/jeans')) {
        setExpandedSubcategory('jeans');
      } else if (location.pathname.includes('/shirts')) {
        setExpandedSubcategory('shirts');
      } else if (location.pathname.includes('/tshirts')) {
        setExpandedSubcategory('tshirts');
      } else {
        setExpandedSubcategory(null);
      }
    }
  }, [location.pathname, expandedCategory]);

  const fetchMensFashionProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/product/category/mens-fashion');
      if (response.data.success) {
        setProducts(response.data.products);
        setFilteredProducts(response.data.products); // Initialize filtered products
        setSortedProducts(response.data.products); // Initialize sorted products
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };



  // Handle sort change
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    const sorted = sortProducts(filteredProducts, newSortBy);
    setSortedProducts(sorted);
  };

  // Handle price range changes with real-time filtering and sorting
  const handlePriceRangeChange = (e) => {
    const value = parseInt(e.target.value);
    
    if (e.target.name === 'min') {
      // Allow min slider to move freely but not cross max - small buffer to prevent crossing
      const newMinPrice = Math.min(value, maxPrice - 1);
      setMinPrice(newMinPrice);
      setPriceRange([newMinPrice, maxPrice]);
      
      // Apply filtering automatically with new values
      const filtered = products.filter(product => 
        product.price >= newMinPrice && product.price <= maxPrice
      );
      setFilteredProducts(filtered);
      
      // Apply current sorting to filtered products
      const sorted = sortProducts(filtered, sortBy);
      setSortedProducts(sorted);
    } else {
      // Allow max slider to move freely but not go below min - small buffer to prevent crossing
      const newMaxPrice = Math.max(value, minPrice + 1);
      setMaxPrice(newMaxPrice);
      setPriceRange([minPrice, newMaxPrice]);
      
      // Apply filtering automatically with new values
      const filtered = products.filter(product => 
        product.price >= minPrice && product.price <= newMaxPrice
      );
      setFilteredProducts(filtered);
      
      // Apply current sorting to filtered products
      const sorted = sortProducts(filtered, sortBy);
      setSortedProducts(sorted);
    }
  };

  // Handle price input changes with real-time filtering
  const handlePriceInputChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    
    if (e.target.name === 'minInput') {
      // Constrain min input to valid range and not exceed max
      const newMinPrice = Math.max(30, Math.min(value, maxPrice - 1));
      setMinPrice(newMinPrice);
      setPriceRange([newMinPrice, maxPrice]);
      
      // Apply filtering automatically with new values
      const filtered = products.filter(product => 
        product.price >= newMinPrice && product.price <= maxPrice
      );
      setFilteredProducts(filtered);
      
      // Apply current sorting to filtered products
      const sorted = sortProducts(filtered, sortBy);
      setSortedProducts(sorted);
    } else {
      // Constrain max input to valid range and not go below min
      const newMaxPrice = Math.min(9129, Math.max(value, minPrice + 1));
      setMaxPrice(newMaxPrice);
      setPriceRange([minPrice, newMaxPrice]);
      
      // Apply filtering automatically with new values
      const filtered = products.filter(product => 
        product.price >= minPrice && product.price <= newMaxPrice
      );
      setFilteredProducts(filtered);
      
      // Apply current sorting to filtered products
      const sorted = sortProducts(filtered, sortBy);
      setSortedProducts(sorted);
    }
  };

  // Apply price filter
  const handlePriceFilter = () => {
    // Filter products based on price range
    const filtered = products.filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    );
    setFilteredProducts(filtered);
    
    // Apply current sorting to filtered products
    const sorted = sortProducts(filtered, sortBy);
    setSortedProducts(sorted);
    console.log(`Filtering products between Rs.${minPrice} - Rs.${maxPrice}`, filtered.length);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setMinPrice(30);
    setMaxPrice(9129);
    setPriceRange([30, 9129]);
    setFilteredProducts(products);
    
    // Apply current sorting to all products
    const sorted = sortProducts(products, sortBy);
    setSortedProducts(sorted);
    console.log('Filters cleared, showing all products');
  };

  const categories = [
    { name: "Shirts", path: "shirts", count: sortedProducts.filter(p => p.subcategory === 'Shirts').length },
    { name: "T-Shirts & Polos", path: "tshirts", count: sortedProducts.filter(p => p.subcategory === 'T-Shirts').length },
    { name: "Jeans", path: "jeans", count: sortedProducts.filter(p => p.subcategory === 'Jeans').length },
    { name: "Trousers & Chinos", path: "trousers", count: 0 },
    { name: "Shorts", path: "shorts", count: 0 },
    { name: "Innerwear & Sleepwear", path: "innerwear", count: 0 },
    { name: "Ethnic Wear", path: "ethnic", count: 0 },
    { name: "Winter Wear", path: "winter", count: 0 },
    { name: "Sportswear", path: "sportswear", count: 0 }
  ];

  return (
    <>
      <Header/>
      <Navbar/>
      
      <div className="bg-[#f7f7f7] min-h-screen">
        {/* Breadcrumbs */}
        <div className="bg-white ">
          <div className="max-w-7xl ml-27 px-4 py-3">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-red-600 transition-colors">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <Link 
                to="/product/mens-fashion"
                onClick={() => {
                  setExpandedCategory(null);
                  setExpandedSubcategory(null);
                  setIsAccordionOpen(true);
                }}
                className="hover:text-red-600 transition-colors"
              >
                Men's Fashion
              </Link>
              {location.pathname.includes('/shirts') && (
                <>
                  <span className="text-gray-400">/</span>
                  <button 
                    onClick={() => {
                      setExpandedCategory('shirts');
                      setExpandedSubcategory('shirts');
                      setIsAccordionOpen(true);
                    }}
                    className="text-gray-900"
                  >
                    Shirts
                  </button>
                </>
              )}
              {location.pathname.includes('/tshirts') && (
                <>
                  <span className="text-gray-400">/</span>
                  <button 
                    onClick={() => {
                      setExpandedCategory('tshirts');
                      setExpandedSubcategory('tshirts');
                      setIsAccordionOpen(true);
                    }}
                    className="text-gray-900"
                  >
                    T-Shirts
                  </button>
                </>
              )}
              {location.pathname.includes('/jeans') && (
                <>
                  <span className="text-gray-400">/</span>
                  <button 
                    onClick={() => {
                      setExpandedCategory('jeans');
                      setExpandedSubcategory('jeans');
                      setIsAccordionOpen(true);
                    }}
                    className="text-gray-900"
                  >
                    Jeans
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Trending Searches */}
        <div className="bg-gray-50 ml-24">
          <div className="max-w-7xl  px-4 py-2">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 flex items-center">
                <i className="fas fa-chart-line mr-2 text-gray-400"></i>
                Trending searches:
              </span>
              <div className="flex gap-3 text-sm">
                <span className="bg-white border border-gray-300 rounded-full px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  kitchen product
                </span>
                <span className="bg-white border border-gray-300 rounded-full px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  shoes for men
                </span>
                <span className="bg-white border border-gray-300 rounded-full px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  kurti set
                </span>
                <span className="bg-white border border-gray-300 rounded-full px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  sandal men
                </span>
                <span className="bg-white border border-gray-300 rounded-full px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  sport shoe men
                </span>
                <span className="bg-white border border-gray-300 rounded-full px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  saree
                </span>
                <span className="bg-white border border-gray-300 rounded-full px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  tshirt
                </span>
                <span className="bg-white border border-gray-300 rounded-full px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  wall stickers
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-0">
            {/* Left Sidebar - Snapdeal Style */}
            <div className="w-64 bg-white border-r border-gray-200 min-h-screen pr-4 pl-4">
              {/* Men's Clothing Accordion */}
              <div className="mb-6">
                <div 
                  className="flex items-center text-sm font-medium text-gray-900 mb-3 pb-2 border-b cursor-pointer"
                  onClick={() => {
                    setIsAccordionOpen(!isAccordionOpen);
                    if (!isAccordionOpen) {
                      // Reset all states when closing
                      setExpandedCategory(null);
                      setExpandedSubcategory(null);
                    }
                  }}
                >
                  <span className="text-lg mr-2">
                    {isAccordionOpen ? '−' : '+'}
                  </span>
                  <h3>Men's Clothing</h3>
                </div>
                {isAccordionOpen && (
                  <>
                    <div className="space-y-2 ml-4">
                      {/* Show T-Shirts subcategories when expandedCategory is 'tshirts' or when on T-Shirts route */}
                      {(expandedCategory === 'tshirts' || (expandedCategory === null && location.pathname.includes('/tshirts'))) && (
                        <>
                          <div 
                            className="flex items-center text-sm text-red-600 mb-2 cursor-pointer"
                            onClick={() => {
                              setExpandedSubcategory(expandedSubcategory === 'tshirts' ? null : 'tshirts');
                            }}
                          >
                            <span className="text-lg mr-2">
                              {expandedSubcategory === 'tshirts' ? '−' : '+'}
                            </span>
                            <span>Men's T-Shirts & Polos</span>
                            <span className="text-gray-400 ml-auto">{sortedProducts.filter(p => p.subcategory === 'T-Shirts').length}</span>
                          </div>
                          {expandedSubcategory === 'tshirts' && (
                            <div className="ml-6 space-y-1">
                              <div className="flex justify-between items-center text-sm text-gray-700 hover:text-red-600 cursor-pointer">
                                <span>Polo T Shirt For Men</span>
                              </div>
                              <div className="flex justify-between items-center text-sm text-gray-700 hover:text-red-600 cursor-pointer">
                                <span>T Shirt For Men</span>
                              </div>
                              <div className="flex justify-between items-center text-sm text-gray-700 hover:text-red-600 cursor-pointer">
                                <span>Couple Combos</span>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      
                      {/* Show Shirts subcategories when expandedCategory is 'shirts' or when on Shirts route */}
                      {(expandedCategory === 'shirts' || (expandedCategory === null && location.pathname.includes('/shirts'))) && (
                        <>
                          <div 
                            className="flex items-center text-sm text-red-600 mb-2 cursor-pointer"
                            onClick={() => {
                              setExpandedSubcategory(expandedSubcategory === 'shirts' ? null : 'shirts');
                            }}
                          >
                            <span className="text-lg mr-2">
                              {expandedSubcategory === 'shirts' ? '−' : '+'}
                            </span>
                            <span>Shirts For Men</span>
                            <span className="text-gray-400 ml-auto">{sortedProducts.filter(p => p.subcategory === 'Shirts').length}</span>
                          </div>
                          {expandedSubcategory === 'shirts' && (
                            <div className="ml-6 space-y-1">
                              <div className="flex justify-between items-center text-sm text-gray-700 hover:text-red-600 cursor-pointer">
                                <span>Casual Shirts</span>
                              </div>
                              <div className="flex justify-between items-center text-sm text-gray-700 hover:text-red-600 cursor-pointer">
                                <span>Formal Shirts</span>
                              </div>
                              <div className="flex justify-between items-center text-sm text-gray-700 hover:text-red-600 cursor-pointer">
                                <span>Party Shirts</span>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      
                      {/* Show Jeans subcategories when expandedCategory is 'jeans' or when on Jeans route */}
                      {(expandedCategory === 'jeans' || (expandedCategory === null && location.pathname.includes('/jeans'))) && (
                        <>
                          <div 
                            className="flex items-center text-sm text-red-600 mb-2 cursor-pointer"
                            onClick={() => {
                              setExpandedSubcategory(expandedSubcategory === 'jeans' ? null : 'jeans');
                            }}
                          >
                            <span className="text-lg mr-2">
                              {expandedSubcategory === 'jeans' ? '−' : '+'}
                            </span>
                            <span>Jeans For Men</span>
                            <span className="text-gray-400 ml-auto">{sortedProducts.filter(p => p.subcategory === 'Jeans').length}</span>
                          </div>
                          {expandedSubcategory === 'jeans' && (
                            <div className="ml-6 space-y-1">
                              <div className="flex justify-between items-center text-sm text-gray-700 hover:text-red-600 cursor-pointer">
                                <span>Slim Fit Jeans</span>
                              </div>
                              <div className="flex justify-between items-center text-sm text-gray-700 hover:text-red-600 cursor-pointer">
                                <span>Regular Fit Jeans</span>
                              </div>
                              <div className="flex justify-between items-center text-sm text-gray-700 hover:text-red-600 cursor-pointer">
                                <span>Skinny Fit Jeans</span>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      
                      {/* Show all main categories when expandedCategory is null and not on any specific route */}
                      {expandedCategory === null && !location.pathname.includes('/shirts') && !location.pathname.includes('/tshirts') && !location.pathname.includes('/jeans') && (
                        <>
                          <div className="flex justify-between items-center text-sm text-gray-700 hover:text-red-600 cursor-pointer">
                            <Link to="/product/mens-fashion/tshirts" className="flex justify-between items-center w-full">
                              <span>Men's T-Shirts & Polos</span>
                              <span className="text-gray-400">{sortedProducts.filter(p => p.subcategory === 'T-Shirts').length}</span>
                            </Link>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-700 hover:text-red-600 cursor-pointer">
                            <Link to="/product/mens-fashion/shirts" className="flex justify-between items-center w-full">
                              <span>Shirts For Men</span>
                              <span className="text-gray-400">{sortedProducts.filter(p => p.subcategory === 'Shirts').length}</span>
                            </Link>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-700 hover:text-red-600 cursor-pointer">
                            <Link to="/product/mens-fashion/jeans" className="flex justify-between items-center w-full">
                              <span>Jeans For Men</span>
                              <span className="text-gray-400">{sortedProducts.filter(p => p.subcategory === 'Jeans').length}</span>
                            </Link>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-700 hover:text-red-600 cursor-pointer">
                            <span>Trousers For Men</span>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-700 hover:text-red-600 cursor-pointer">
                            <span>Sports Wear For Men</span>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-700 hover:text-red-600 cursor-pointer">
                            <span>Men's Trackpants & Tracksuits</span>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-700 hover:text-red-600 cursor-pointer">
                            <span>Innerwear For Men</span>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-700 hover:text-red-600 cursor-pointer">
                            <span>Ethnic Wear For Men</span>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-700 hover:text-red-600 cursor-pointer">
                            <span>Unstitched Suit & Shirts For Men</span>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-700 hover:text-red-600 cursor-pointer">
                            <span>Shorts For Men</span>
                          </div>
                        </>
                      )}
                    </div>
                    <button className="mt-4 px-4 py-2 border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 rounded">
                      VIEW MORE
                    </button>
                  </>
                )}
              </div>

              {/* Price Filter - Snapdeal Style */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Price</h3>
                <div className="space-y-3">
                  <div className="relative mb-3">
                    <div className="relative h-2 bg-gray-200 rounded-lg overflow-hidden">
                      {/* Active range track */}
                      <div 
                        className="absolute h-2 bg-red-500 rounded transition-all duration-200"
                        style={{
                          left: `${((minPrice - 30) / (9129 - 30)) * 100}%`,
                          right: `${100 - ((maxPrice - 30) / (9129 - 30)) * 100}%`
                        }}
                      ></div>
                      {/* Min range input */}
                      <input 
                        type="range" 
                        name="min"
                        min="30" 
                        max="9129" 
                        value={minPrice}
                        onChange={handlePriceRangeChange}
                        className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer range-slider-min" 
                        style={{ zIndex: minPrice > maxPrice - 100 ? 5 : 1 }}
                      />
                      {/* Max range input */}
                      <input 
                        type="range" 
                        name="max"
                        min="30" 
                        max="9129" 
                        value={maxPrice}
                        onChange={handlePriceRangeChange}
                        className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer range-slider-max" 
                        style={{ zIndex: 2 }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Rs {minPrice}</span>
                      <span>Rs {maxPrice}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-1">Rs</span>
                      <input 
                        type="number" 
                        name="minInput"
                        value={minPrice} 
                        onChange={handlePriceInputChange}
                        className="w-16 px-2 py-1 border border-gray-300 text-xs rounded"
                      />
                    </div>
                    <span className="text-xs text-gray-500 self-center">-</span>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-1">Rs</span>
                      <input 
                        type="number" 
                        name="maxInput"
                        value={maxPrice} 
                        onChange={handlePriceInputChange}
                        className="w-16 px-2 py-1 border border-gray-300 text-xs rounded"
                      />
                    </div>
                    <button 
                      onClick={handlePriceFilter}
                      className="px-3 py-1 bg-red-500 text-white text-xs border border-red-500 rounded hover:bg-red-600 transition-colors"
                    >
                      GO
                    </button>
                  </div>
                  <div className="mt-2">
                    <button 
                      onClick={handleClearFilters}
                      className="px-3 py-1 bg-red-100 text-xs text-red-600 border border-red-300 rounded hover:bg-red-200"
                    >
                      Clear Filter
                    </button>
                  </div>
                </div>
              </div>

              {/* Customer Rating Filter - Snapdeal Style */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Customer Rating</h3>
                <div className="space-y-2">
                  {[
                    { stars: 4, count: 10579 },
                    { stars: 3, count: 15585 },
                    { stars: 2, count: 18407 },
                    { stars: 1, count: 17104 }
                  ].map((rating) => (
                    <label key={rating.stars} className="flex items-center space-x-2 text-sm cursor-pointer">
                      <input type="checkbox" className="form-checkbox h-3 w-3" />
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 text-xs">
                          {[...Array(rating.stars)].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                        <span className="ml-1 text-gray-600 text-xs">& Up</span>
                        <span className="ml-2 text-gray-400 text-xs">{rating.count}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color Filter - Snapdeal Style */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Color</h3>
                <div className="space-y-2">
                  {[
                    { name: 'Beige', count: 354 },
                    { name: 'Black', count: 10546 },
                    { name: 'Blue', count: 1595 },
                    { name: 'Bronze', count: 24 },
                    { name: 'Brown', count: 2817 }
                  ].map((color) => (
                    <label key={color.name} className="flex items-center justify-between text-sm cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="form-checkbox h-3 w-3" />
                        <span className="text-gray-700">{color.name}</span>
                      </div>
                      <span className="text-gray-400 text-xs">{color.count}</span>
                    </label>
                  ))}
                </div>
                <button className="mt-3 px-4 py-1 border border-gray-300 text-xs text-gray-700 hover:bg-gray-50 rounded">
                  VIEW MORE
                </button>
              </div>

              {/* Fabric Filter - Snapdeal Style */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Fabric</h3>
                <div className="space-y-2">
                  {[
                    { name: '100 Percent Cotton', count: 1902 },
                    { name: '100 Percent Cotton Fleece', count: 29 },
                    { name: '100 Percent Cotton Terry', count: 9 }
                  ].map((fabric) => (
                    <label key={fabric.name} className="flex items-center justify-between text-sm cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="form-checkbox h-3 w-3" />
                        <span className="text-gray-700">{fabric.name}</span>
                      </div>
                      <span className="text-gray-400 text-xs">{fabric.count}</span>
                    </label>
                  ))}
                </div>
                <button className="mt-3 px-4 py-1 border border-gray-300 text-xs text-gray-700 hover:bg-gray-50 rounded">
                  VIEW MORE
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white">
              {/* Header Section - Snapdeal Style */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-lg font-normal text-gray-700 mb-2">
                      {location.pathname.includes('/shirts') ? 'Men\'s Shirts' :
                       location.pathname.includes('/tshirts') ? 'Men\'s T-Shirts' :
                       location.pathname.includes('/jeans') ? 'Men\'s Jeans' :
                       'Men\'s T-Shirts & Polos'} <span className="text-gray-500">({sortedProducts.length} Items)</span>
                    </h1>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm">
                        <input type="checkbox" className="mr-2 h-3 w-3" />
                        <span>Deliver to: <span className="text-red-600 font-medium">584128</span></span>
                        <button className="ml-2 text-red-600">✏️</button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-search text-gray-400"></i>
                        <input 
                          type="text" 
                          placeholder="Search within category" 
                          className="border border-gray-300 rounded px-3 py-1 text-sm w-48 focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <SortDropdown sortBy={sortBy} onChange={handleSortChange} />
                  </div>
                </div>
              </div>

              {/* Child Routes Content */}
              <div className="p-4">
                {/* Always show products, filter by subcategory if on subcategory route */}
                {(() => {
                  let subcategory = null;
                  if (location.pathname.includes('/shirts')) subcategory = 'Shirts';
                  else if (location.pathname.includes('/tshirts')) subcategory = 'T-Shirts';
                  else if (location.pathname.includes('/jeans')) subcategory = 'Jeans';

                  const productsToShow = subcategory
                    ? sortedProducts.filter(p => p.subcategory === subcategory)
                    : sortedProducts;

                  if (loading) {
                    return (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading products...</p>
                      </div>
                    );
                  }
                  if (productsToShow.length > 0) {
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {productsToShow.map((product) => (
                          <Link
                            key={product._id}
                            to={`/product/${product.name.toLowerCase().replace(/\s+/g, '-')}/${product._id}`}
                            className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200 block"
                          >
                            <div className="relative">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-64 object-cover"
                              />
                            </div>
                            <div className="p-3">
                              <h3 className="text-sm text-gray-800 mb-2 line-clamp-2 leading-tight h-10">
                                {product.name}
                              </h3>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg font-semibold text-gray-900">
                                    Rs. {product.price.toLocaleString()}
                                  </span>
                                  <span className="text-sm text-green-600 font-medium">
                                    {Math.floor(Math.random() * 40 + 40)}% Off
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center">
                                  <div className="flex text-yellow-400 mr-1">
                                    {[...Array(4)].map((_, i) => (
                                      <span key={i}>★</span>
                                    ))}
                                  </div>
                                  <span>({Math.floor(Math.random() * 5000 + 1000)})</span>
                                </div>
                                <span>{Math.floor(Math.random() * 50 + 10)} orders in last 1 day</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <i className="fas fa-male text-6xl"></i>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
                      <p className="text-gray-600">Products will be loaded from the API</p>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .range-slider-min, .range-slider-max {
          pointer-events: auto;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 8px;
        }
        
        .range-slider-min::-webkit-slider-thumb, .range-slider-max::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #e53e3e;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          cursor: pointer;
          pointer-events: auto;
          position: relative;
          z-index: 10;
        }
        
        .range-slider-min::-moz-range-thumb, .range-slider-max::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #e53e3e;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          cursor: pointer;
          pointer-events: auto;
          border: none;
        }
        
        .range-slider-min::-webkit-slider-track, .range-slider-max::-webkit-slider-track {
          background: transparent;
          border: none;
          height: 8px;
        }
        
        .range-slider-min::-moz-range-track, .range-slider-max::-moz-range-track {
          background: transparent;
          border: none;
          height: 8px;
        }
        
        .range-slider-min:focus, .range-slider-max:focus {
          outline: none;
        }
        
        .range-slider-min:focus::-webkit-slider-thumb, .range-slider-max:focus::-webkit-slider-thumb {
          box-shadow: 0 2px 6px rgba(0,0,0,0.3), 0 0 0 3px rgba(229, 62, 62, 0.2);
        }
        
        .range-slider-min::-webkit-slider-track, .range-slider-max::-webkit-slider-track {
          background: transparent;
          border: none;
          height: 8px;
        }
        
        .range-slider-min::-moz-range-track, .range-slider-max::-moz-range-track {
          background: transparent;
          border: none;
          height: 8px;
        }
        
        .range-slider-min:focus, .range-slider-max:focus {
          outline: none;
        }
        
        .range-slider-min:focus::-webkit-slider-thumb, .range-slider-max:focus::-webkit-slider-thumb {
          box-shadow: 0 2px 6px rgba(0,0,0,0.3), 0 0 0 3px rgba(229, 62, 62, 0.2);
        }
      `}</style>
    </>
  )
}

export default MenFashion
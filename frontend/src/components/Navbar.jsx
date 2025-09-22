import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import cartlogo from "../assets/Cart.png";
import signin from "../assets/signin.png";
import Login from "./Login";
import CartDropdown from "./CartDropdown";
import { getSearchSuggestions } from "../api/searchAPI";

// Trending searches data
const TRENDING_SEARCHES = [
  { text: 'Kitchen Product', category: 'KitchenAppliances', subcategory: 'Juicer Mixer Grinders' },
  { text: 'Shoes For Men', category: 'Footwear', subcategory: 'Sports Shoes' },
  { text: 'Kurti Set', category: "Women's Fashion", subcategory: 'Kurtis' },
  { text: 'Sandal Men', category: 'Footwear', subcategory: 'Sandals & Floaters' },
  { text: 'Sport Shoe Men', category: 'Footwear', subcategory: 'Sports Shoes' },
  { text: 'Saree', category: "Women's Fashion", subcategory: 'Sarees' },
  { text: 'Tshirt', category: "Men's Fashion", subcategory: 'T-Shirts' },
  { text: 'Wall Stickers', category: 'Home & Living', subcategory: 'Home Decor' }
];

function Navbar() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [user, setUser] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });
  const cartCount = useSelector((state) => state.cart.count);
  
  // Debounced search suggestions
  const timeoutRef = useRef(null);

  const debouncedFetchSuggestions = useCallback((query) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        try {
          const results = await getSearchSuggestions(query);
          setSuggestions(results);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (token && storedUser) {
      setUser(storedUser.name);
    }
  }, []);

  const addToRecentSearches = (query) => {
    if (!query) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCartDropdown && !event.target.closest('.cart-dropdown')) {
        setShowCartDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCartDropdown]);

  useEffect(() => {
    if (searchQuery) {
      debouncedFetchSuggestions(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearch = (query) => {
    if (query.trim()) {
      addToRecentSearches(query.trim());
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSearchDropdown(false);
      setSuggestions([]);
      setSearchQuery('');
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <nav className="sticky top-0 z-50">
      <div className="bg-[#e40046] flex flex-wrap items-center justify-between px-4 py-3 md:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/">
            <img
              src="https://i3.sdlcdn.com/img/snapdeal/darwin/logo/sdLatestLogo.svg"
              alt="Snapdeal"
              title="Snapdeal"
              className="h-8"
            />
          </Link>
        </div>

        {/* Search bar */}
        <div className="flex bg-white w-full mt-3 md:mt-0 md:w-[45%] relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearchDropdown(true)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(searchQuery);
              }
            }}
            placeholder="Search products & brands"
            className="flex-grow px-4 py-2 outline-none text-sm"
          />
          <button 
            onClick={() => handleSearch(searchQuery)}
            className="bg-[#333333] text-white px-4 text-sm font-medium hover:bg-black cursor-pointer flex items-center gap-2"
          >
            <i className="fa-solid fa-search text-md"></i>
            Search
          </button>

          {/* Search Dropdown */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-[96px] bg-white border border-gray-200 shadow-lg z-50">
              {/* Search Suggestions */}
              {searchQuery.length >= 2 && (
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <i className="fas fa-search text-sm"></i>
                    <span className="text-xs uppercase">Search Suggestions</span>
                  </div>
                  {isLoading ? (
                    <div className="flex justify-center py-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="space-y-1">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="flex items-center text-sm text-gray-700 hover:text-gray-500 hover:bg-gray-100 px-2 py-1 cursor-pointer"
                          onClick={() => handleSearch(suggestion)}
                        >
                          <i className="fas fa-search text-xs text-gray-400 mr-2"></i>
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 px-2 py-1">
                      No suggestions found
                    </div>
                  )}
                </div>
              )}
              
              {/* Recent Searches */}
              {recentSearches.length > 0 && searchQuery.length < 2 && (
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <i className="far fa-clock text-sm"></i>
                      <span className="text-xs uppercase">Recent Searches</span>
                    </div>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-500 hover:text-red-600"
                    >
                      CLEAR
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between group cursor-pointer hover:bg-gray-100 px-2 py-1"
                        onClick={() => handleSearch(search)}
                      >
                        <span className="text-md text-black">{search}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const updated = recentSearches.filter((_, i) => i !== index);
                            setRecentSearches(updated);
                            localStorage.setItem('recentSearches', JSON.stringify(updated));
                          }}
                          className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div className="p-3">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <i className="fas fa-chart-line text-sm"></i>
                  <span className="text-xs uppercase">Trending Searches</span>
                </div>
                <div className="space-y-1">
                  {TRENDING_SEARCHES.map((search, index) => (
                    <Link
                      key={index}
                      to={`/products/${encodeURIComponent(search.category)}${search.subcategory ? `/${encodeURIComponent(search.subcategory)}` : ''}`}
                      className="block text-sm text-gray-700 hover:text-gray-500 hover:bg-gray-100 px-2 py-1 cursor-pointer"
                      onClick={() => {
                        setShowSearchDropdown(false);
                        addToRecentSearches(search.text);
                      }}
                    >
                      <div className="flex items-center">
                        <i className="fas fa-search text-xs text-gray-400 mr-2"></i>
                        {search.text}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Click outside handler */}
        {showSearchDropdown && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowSearchDropdown(false)}
          ></div>
        )}

        {/* Cart */}
        <div 
          className="flex items-center gap-2 text-[13px] cursor-pointer mt-3 md:mt-0 relative cart-dropdown"
          onClick={(e) => {
            e.stopPropagation();
            setShowCartDropdown((prev) => !prev);
            // Close search dropdown when opening cart
            if (showSearchDropdown) {
              setShowSearchDropdown(false);
            }
          }}
        >
          <span className="text-white">Cart</span>
          <div className="relative">
            <img src={cartlogo} alt="Cart" className="h-5 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-[#e40046] font-bold rounded-full px-2 py-0.5 text-xs">
                {cartCount}
              </span>
            )}
          </div>
        </div>

        {/* User / Sign In */}
        <div className="relative group">
          {user ? (
            <>
              <div className="flex gap-1 items-center text-white font-semibold cursor-pointer">
                <span>{user}</span>
                <img src={signin} alt="User" className="h-5 w-6 pt-1" />
              </div>
              <div className="absolute right-0 mt-2 w-48 bg-[#333333] text-white rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="p-3 border-b border-gray-600">
                  <Link to="/my-orders"><p className="hover:bg-black px-2 py-1 rounded">Orders</p></Link> 
                  <p className="hover:bg-black px-2 py-1 rounded">
                    E-Gift Voucher
                  </p>
                </div>
                <div className="p-3 text-center">
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      setUser("");
                    }}
                    className="bg-[#e40046] cursor-pointer text-white px-12 py-1 rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[13px] cursor-pointer text-white">
                  <span>Sign In</span>
                  <img src={signin} alt="Sign In" className="h-5 w-6" />
                </div>
              </div>
              <div className="absolute right-0 mt-2 w-48 bg-[#333333] text-white rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 cursor-pointer">
                <div className="p-3 border-b border-gray-600">
                  <p className="hover:bg-black px-2 py-1 rounded">Your Account</p>
                  <p 
                    className="hover:bg-black px-2 py-1 rounded"
                    onClick={() => {
                      const token = localStorage.getItem('token');
                      if (token) {
                        navigate('/my-orders');
                      } else {
                        setShowLogin(true);
                      }
                    }}
                  >
                    Your Orders
                  </p>
                </div>
                <div className="p-3 text-center">
                  <p className="text-[11px]">If you are a new user</p>
                  <p className="pb-2">Register</p>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="bg-[#e40046] cursor-pointer text-white px-12 py-1 rounded hover:bg-red-600"
                  >
                    Login
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Login Modal */}
        {showLogin && (
          <Login onClose={() => setShowLogin(false)} setUser={setUser} />
        )}

        {/* Cart Dropdown */}
        <CartDropdown 
          isOpen={showCartDropdown} 
          onClose={() => setShowCartDropdown(false)} 
          className="cart-dropdown"
        />
      </div>
    </nav>
  );
}

export default Navbar;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import SortDropdown from '../components/SortDropdown';
import sortProducts from '../utils/sortProducts';

const TShirts = () => {
  const [sortBy, setSortBy] = useState('Popularity');
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTShirts();
  }, []);

  const fetchTShirts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/product/category/mens-fashion/tshirts');
      if (response.data.success) {
        setProducts(response.data.products);
        setSortedProducts(sortProducts(response.data.products, sortBy));
      }
    } catch (error) {
      console.error('Error fetching t-shirts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setSortedProducts(sortProducts(products, value));
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <SortDropdown sortBy={sortBy} onChange={handleSortChange} />
      </div>
      {/* Products Grid - Snapdeal Style */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading t-shirts...</p>
        </div>
      ) : sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedProducts.map((product) => (
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
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <i className="fas fa-tshirt text-6xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No t-shirts available</h3>
          <p className="text-gray-600">Products will be loaded from the API</p>
        </div>
      )}

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default TShirts;
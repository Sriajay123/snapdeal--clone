import React, { useEffect, useState } from "react";
import api from "../api/api";


// Swiper modules


function RecentlyViewedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Example: get recently viewed product IDs from localStorage
    const viewedIds = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    api.get("/product")
      .then((res) => {
        // Filter products by recently viewed IDs
        const allProducts = res.data.products || [];
        const filtered = allProducts.filter(p => viewedIds.includes(p._id));
        setProducts(filtered);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load recently viewed products");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-8">Loading trending products...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
<div className="mt-8 mb-15 w-[1150px] h-[450px] border border-[#f6f6f6] rounded-sm bg-white shadow-sm">
  <h3 className="text-xl font-bold mb-4">Recently viewed products</h3>

  {products.length === 0 ? (
    <div className="flex items-center justify-center h-[calc(100%-2rem)] text-gray-500">
      No recently viewed products.
    </div>
  ) : (
    <div className="flex flex-wrap gap-4">
      {products.map((product, idx) => (
        <div
          key={product._id || idx}
          className="w-[208px] h-[393px] border border-[#f6f6f6] rounded-sm bg-white shadow-sm p-5 flex flex-col transition-all duration-200 hover:border-[#e40046] hover:shadow-lg"
        >
          <img
            src={product.image || "https://via.placeholder.com/150"}
            alt={product.name}
            className="w-28 h-40 object-contain mb-2 rounded self-center"
          />
          <div className="w-full">
            <h4 className="font-semibold text-md mb-2 text-left w-full line-clamp-2">
              {product.name}
            </h4>
            <div className="mb-2 text-sm text-gray-700">Rating: {product.rating}</div>
            <div className="flex items-center mb-2">
              <span className="line-through text-gray-400 text-sm">
                Rs {product.oldPrice || product.price + 100}
              </span>
              <span className="font-bold text-pink-700 text-lg ml-2">
                Rs {product.price}
              </span>
              <span className="text-xs text-gray-600 px-2 py-1 border border-gray-200 rounded ml-2">
                {product.oldPrice
                  ? Math.round(100 - (product.price / product.oldPrice) * 100)
                  : Math.round(100 - (product.price / (product.price + 100)) * 100)}
                % OFF
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
}

export default RecentlyViewedProducts
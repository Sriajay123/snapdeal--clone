import { Link } from "react-router-dom"

function TrendingSearches() {
  return (
        <>
        {/* Trending Searches */}
        <div className="bg-gray-50 ml-24">
          <div className="max-w-7xl  px-4 py-2">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 flex items-center">
                <i className="fas fa-chart-line mr-2 text-gray-400"></i>
                Trending searches:
              </span>
              <div className="flex gap-3 text-sm">
                <Link to="/products/Kitchenware" className="bg-white border border-gray-300  px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  kitchen product
                </Link>
                <Link to="/products/Footwear" className="bg-white border border-gray-300  px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  shoes for men
                </Link>
                <Link to="/products/Ethnic Wear/Kurtas & Kurtis" className="bg-white border border-gray-300  px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  kurti set
                </Link>
                <Link to="/products/Footwear/Sandals & Floaters" className="bg-white border border-gray-300  px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  sandal men
                </Link>
                <Link to="/products/Footwear/Sports Shoes" className="bg-white border border-gray-300  px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  sport shoe men
                </Link>
                <Link to="/products/Ethnic Wear/Sarees" className="bg-white border border-gray-300  px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  saree
                </Link>
                <Link to="/products/Men's Fashion/T-Shirts" className="bg-white border border-gray-300  px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  tshirt
                </Link>
                <Link  className="bg-white border border-gray-300  px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  wall stickers
                </Link>
              </div>
            </div>
          </div>
        </div>


            
        </>
          

  )
}

export default TrendingSearches
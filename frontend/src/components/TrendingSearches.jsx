

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
                <span className="bg-white border border-gray-300  px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  kitchen product
                </span>
                <span className="bg-white border border-gray-300  px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  shoes for men
                </span>
                <span className="bg-white border border-gray-300  px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  kurti set
                </span>
                <span className="bg-white border border-gray-300  px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  sandal men
                </span>
                <span className="bg-white border border-gray-300  px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  sport shoe men
                </span>
                <span className="bg-white border border-gray-300  px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  saree
                </span>
                <span className="bg-white border border-gray-300  px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  tshirt
                </span>
                <span className="bg-white border border-gray-300  px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  wall stickers
                </span>
              </div>
            </div>
          </div>
        </div>
        </>


  )
}

export default TrendingSearches
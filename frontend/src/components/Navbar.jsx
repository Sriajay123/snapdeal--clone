import { Link } from "react-router-dom";

import cartlogo from "../assets/Cart.png";
import signin from "../assets/signin.png";

function Navbar() {
  return (
    <nav className="w-full shadow-md">
      <div className="bg-[#e40046] flex items-center justify-around px-6 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/">
            <img
              src="https://i3.sdlcdn.com/img/snapdeal/darwin/logo/sdLatestLogo.svg"
              alt="Snapdeal"
              className="h-8"
            />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex bg-white rounded overflow-hidden w-1/2">
          <input
            type="text"
            placeholder="Search product & brands"
            className="flex-grow px-4 py-2 outline-none text-sm"
          />
          <button className="bg-[#333333] text-white px-6 text-sm font-medium hover:bg-black">
            Search
          </button>
        </div>

        {/* Cart */}
        <div className="flex items-center gap-2 text-[13px] cursor-pointer">
          <span className="text-white">Cart</span>
          <img src={cartlogo} alt="Cart" className="h-5 w-6" />
        </div>

        {/* Sign In */}
        <div className="flex items-center gap-2 text-[13px] cursor-pointer">
          <span className="text-white">Sign In</span>
          <img src={signin} alt="Sign In" className="h-5 w-6" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

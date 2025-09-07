import { Link } from "react-router-dom";

import cartlogo from "../assets/Cart.png";
import signin from "../assets/signin.png";

function Navbar() {
  return (
    <nav>
  <div className="bg-[#e40046] flex flex-wrap items-center justify-between px-4 py-3 md:px-6">
    
    {/* Logo */}
    <div className="flex items-center space-x-2">
      <Link to="/">
        <img
          src="https://i3.sdlcdn.com/img/snapdeal/darwin/logo/sdLatestLogo.svg"
          alt="Snapdeal" title="Snapdeal"
          className="h-8"
        />
      </Link>
    </div>

    {/* Search bar */}
    <div className="flex bg-white w-full mt-3 md:mt-0 md:w-[45%]">
      <input
        type="text"
        placeholder="Search product & brands"
        className="flex-grow px-4 py-2 outline-none text-sm"
      />
      <button className="bg-[#333333] text-white px-4 text-sm font-medium hover:bg-black cursor-pointer">
        <i className="fa-solid fa-search text-md"></i>
      </button>
    </div>

    {/* Cart */}
    <div className="flex items-center gap-2 text-[13px] cursor-pointer mt-3 md:mt-0">
      <span className="text-white">Cart</span>
      <img src={cartlogo} alt="Cart" className="h-5 w-6" />
    </div>

    {/* Sign In */}
    <div className="flex items-center gap-2 text-[13px] cursor-pointer mt-3 md:mt-0">
      <span className="text-white">Sign In</span>
      <img src={signin} alt="Sign In" className="h-5 w-6" />
    </div>
  </div>
</nav>

  );
}

export default Navbar;

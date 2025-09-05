import { Link } from "react-router-dom";

import cartlogo from "../assets/Cart.png";
import signin from "../assets/signin.png";

function Navbar() {
  return (
    <nav>
      <div className="bg-[#e40046] flex items-center justify-around px-6 py-3">
     
        <div className="flex items-center space-x-2">
          <Link to="/">
            <img
              src="https://i3.sdlcdn.com/img/snapdeal/darwin/logo/sdLatestLogo.svg"
              alt="Snapdeal" title="Snapdeal"
              className="h-8"
            />
          </Link>
        </div>

        <div className="flex bg-white w-[45%]">
          <input
            type="text"
            placeholder="Search product & brands"
            className="flex-grow px-6 py-2 outline-none text-sm"
          />
          <button className="bg-[#333333] text-white px-6 text-sm font-medium hover:bg-black cursor-pointer">
            Search
          </button>
        </div>

       
        <div className="flex items-center gap-2 text-[13px] cursor-pointer">
          <span className="text-white">Cart</span>
          <img src={cartlogo} alt="Cart" className="h-5 w-6" />
        </div>


        <div className="flex items-center gap-5 text-[13px] cursor-pointer">
          <span className="text-white">Sign In</span>
          <img src={signin} alt="Sign In" className="h-5 w-6" />
        </div>
      </div>

    </nav>
  );
}

export default Navbar;

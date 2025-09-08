import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import cartlogo from "../assets/Cart.png";
import signin from "../assets/signin.png";
import Login from "./Login";

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (token && storedUser) {
      setUser(storedUser.name); // or storedUser.email
    }
  }, []);
  return (
    <nav className="sticky top-0 z-50">
      <div className="bg-[#e40046] flex flex-wrap items-center justify-between px-4 py-3 md:px-6 ">

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
        <div className="flex bg-white w-full  mt-3 md:mt-0 md:w-[45%]">
          <input
            type="text"
            placeholder="Search product & brands"
            className="flex-grow px-4 py-2 outline-none text-sm"
          />
          <button className="bg-[#333333] text-white px-4 text-sm font-medium hover:bg-black cursor-pointer">
            <i className="fa-solid fa-search text-md"></i>
            Search
          </button>
        </div>

        {/* Cart */}
        <div className="flex items-center gap-2 text-[13px] cursor-pointer mt-3 md:mt-0">
          <span className="text-white">Cart</span>
          <img src={cartlogo} alt="Cart" className="h-5 w-6" />
        </div>




        <div className="relative group">
          {user ? (
            <> 
               <div className="flex gap-1">
              <span className="text-white font-semibold">{user}</span>
               <img src={signin} alt="Sign In" className="h-5 w-6 pt-1" />
               </div>
              <div className="absolute right-0 mt-4 cursor-pointer w-50 bg-[#333333] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="space-x-2 p-3 border-b">
                  <p className="hover:bg-black px-2 py-1">Orders</p>
                  <p className="hover:bg-black px-2 py-1">E-Gift Voucher</p>
                </div>
                <div className="p-3 text-center">
                  <button
                    onClick={() => {
                      // Clear localStorage and state
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
              <div className="flex items-center gap-2 text-[13px] cursor-pointer">
                <span className="text-white">Sign In</span>
                <img src={signin} alt="Sign In" className="h-5 w-6" />
              </div>
              <div className="absolute right-0 mt-4 cursor-pointer w-50 bg-[#333333] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="space-x-2 p-3 border-b">
                  <p className="hover:bg-black px-2 py-1">Your Account</p>
                  <p className="hover:bg-black px-2 py-1">Your Orders</p>
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

        {showLogin && <Login onClose={() => setShowLogin(false)} setUser={setUser} />}


      </div>
    </nav>

  );
}

export default Navbar;

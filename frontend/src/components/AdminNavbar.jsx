import React from "react";
import { useNavigate } from "react-router-dom";

function AdminNavbar() {
    const navigate = useNavigate();
    const adminEmail = localStorage.getItem("adminEmail");

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        navigate("/admin/login");
    };

    const goToMainSite = () => {
        navigate("/");
    };

    return (
        <nav className="bg-[#e40046] text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Admin Label */}
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold">snapdeal</h1>
                        <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                            Admin Panel
                        </span>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={goToMainSite}
                            className="flex items-center gap-2 hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded transition-colors"
                        >
                            <i className="fas fa-external-link-alt"></i>
                            View Site
                        </button>

                        {/* Admin Profile */}
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-medium">{adminEmail}</p>
                                <p className="text-xs text-pink-100">Administrator</p>
                            </div>
                            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <i className="fas fa-user"></i>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded transition-colors"
                        >
                            <i className="fas fa-sign-out-alt"></i>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default AdminNavbar;

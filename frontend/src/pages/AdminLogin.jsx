import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function AdminLogin() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            console.log('Attempting admin login with:', { email: formData.email });
            const response = await api.post("/user/admin/login", {
                email: formData.email,
                password: formData.password
            });

            console.log('Login response:', response.data);

            if (response.data.success) {
                localStorage.setItem("adminToken", response.data.token);
                localStorage.setItem("adminUser", JSON.stringify(response.data.user));
                navigate("/admin/dashboard");
            } else {
                setError(response.data.message || "Login failed");
            }
        } catch (err) {
            console.error('Admin login error:', err);
            if (err.response) {
                console.log('Error response:', err.response.data);
                setError(err.response.data.message || "Login failed");
            } else if (err.request) {
                setError("Network error. Please check your connection.");
            } else {
                setError("Login failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#e40046]">snapdeal</h1>
                    <h2 className="text-xl font-semibold text-gray-700 mt-2">Admin Panel</h2>
                    <p className="text-gray-500 mt-1">Sign in to manage products</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e40046] focus:border-transparent"
                            placeholder="admin@snapdeal.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e40046] focus:border-transparent"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#e40046] text-white py-2 px-4 rounded-md hover:bg-[#c2003d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Demo Credentials:</p>
                    <p>Email: admin@snapdeal.com</p>
                    <p>Password: admin123</p>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;

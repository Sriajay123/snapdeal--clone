import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Login from './Login';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        checkAuthentication();
    }, []);

    const checkAuthentication = () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            setShowLogin(true);
        }
        setIsLoading(false);
    };

    const handleLoginSuccess = (userData) => {
        setIsAuthenticated(true);
        setShowLogin(false);
    };

    const handleCloseLogin = () => {
        setShowLogin(false);
        // Redirect to home if user closes login without logging in
        window.location.href = '/';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e40046]"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div>
                {showLogin && (
                    <Login 
                        onClose={handleCloseLogin} 
                        setUser={handleLoginSuccess}
                    />
                )}
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <i className="fas fa-lock text-4xl text-gray-400 mb-4"></i>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Login Required</h2>
                        <p className="text-gray-500 mb-6">Please login to access your account</p>
                        <button 
                            onClick={() => setShowLogin(true)}
                            className="bg-[#e40046] text-white px-6 py-2 rounded hover:bg-[#c2003d]"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;

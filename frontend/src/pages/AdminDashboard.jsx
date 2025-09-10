import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import AdminNavbar from "../components/AdminNavbar";
import ProductForm from "../components/ProductForm";

function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    // Check authentication
    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            navigate("/admin/login");
        }
    }, [navigate]);

    // Fetch products
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get("/product");
            setProducts(response.data.products);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await api.delete(`/product/${productId}`);
                setProducts(products.filter(product => product._id !== productId));
            } catch (error) {
                console.error("Failed to delete product:", error);
                alert("Failed to delete product");
            }
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowProductForm(true);
    };

    const handleAddProduct = () => {
        setEditingProduct(null);
        setShowProductForm(true);
    };

    const handleProductSaved = () => {
        setShowProductForm(false);
        setEditingProduct(null);
        fetchProducts();
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-4xl text-[#e40046] mb-4"></i>
                    <p className="text-gray-600">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminNavbar />
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Product Management</h1>
                    <p className="text-gray-600">Manage your product inventory</p>
                </div>

                {/* Actions Bar */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e40046] focus:border-transparent"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleAddProduct}
                            className="bg-[#e40046] text-white px-6 py-2 rounded-md hover:bg-[#c2003d] transition-colors flex items-center gap-2"
                        >
                            <i className="fas fa-plus"></i>
                            Add Product
                        </button>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="aspect-w-1 aspect-h-1">
                                <img
                                    src={product.images && product.images.length > 0 ? product.images[0] : product.image || "https://via.placeholder.com/200x200?text=No+Image"}
                                    alt={product.name}
                                    className="w-full h-48 object-contain p-4"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/200x200?text=Error";
                                    }}
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                                    {product.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-1">{product.brand}</p>
                                {product.subcategory && (
                                    <p className="text-gray-500 text-xs mb-2">
                                        {product.category} › {product.subcategory}
                                    </p>
                                )}
                                
                                {/* Display available sizes and colors */}
                                <div className="text-xs text-gray-500 mb-2">
                                    {product.sizes && product.sizes.length > 0 && (
                                        <div className="mb-1">
                                            <span className="font-medium">Sizes:</span> {product.sizes.join(", ")}
                                        </div>
                                    )}
                                    {product.colors && product.colors.length > 0 && (
                                        <div>
                                            <span className="font-medium">Colors:</span> {product.colors.join(", ")}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Rating */}
                                {product.rating > 0 && (
                                    <div className="flex items-center gap-1 mb-2">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <i
                                                    key={i}
                                                    className={`fas fa-star text-xs ${
                                                        i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"
                                                    }`}
                                                ></i>
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-600">({product.rating})</span>
                                    </div>
                                )}
                                
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-lg font-bold text-[#e40046]">
                                        ₹{product.price}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        product.stock > 0 
                                            ? "bg-green-100 text-green-800" 
                                            : "bg-red-100 text-red-800"
                                    }`}>
                                        {product.stock > 0 ? `Stock: ${product.stock}` : "Out of Stock"}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditProduct(product)}
                                        className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors"
                                    >
                                        <i className="fas fa-edit mr-1"></i>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product._id)}
                                        className="flex-1 bg-red-500 text-white py-2 px-3 rounded text-sm hover:bg-red-600 transition-colors"
                                    >
                                        <i className="fas fa-trash mr-1"></i>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <i className="fas fa-box-open text-4xl text-gray-300 mb-4"></i>
                        <p className="text-gray-500 text-lg">No products found</p>
                        <p className="text-gray-400 text-sm">
                            {searchTerm ? "Try adjusting your search" : "Start by adding your first product"}
                        </p>
                    </div>
                )}
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
                <ProductForm
                    product={editingProduct}
                    onClose={() => setShowProductForm(false)}
                    onSave={handleProductSaved}
                />
            )}
        </div>
    );
}

export default AdminDashboard;

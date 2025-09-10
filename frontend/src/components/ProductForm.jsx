import React, { useState, useEffect } from "react";
import api from "../api/api";

function ProductForm({ product, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        price: "",
        images: [],
        category: "",
        subcategory: "",
        description: "",
        stock: 0,
        rating: 0,
        keyword: "",
        sizes: [],
        colors: []
    });
    const [imageInput, setImageInput] = useState("");
    const [sizesInput, setSizesInput] = useState("");
    const [colorsInput, setColorsInput] = useState("");
    const [customCategory, setCustomCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Populate form data when editing
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                brand: product.brand || "",
                price: product.price || "",
                images: product.images || [],
                category: product.category || "",
                subcategory: product.subcategory || "",
                description: product.description || "",
                stock: product.stock || 0,
                rating: product.rating || 0,
                keyword: product.keyword || "",
                sizes: product.sizes || [],
                colors: product.colors || []
            });
            setCustomCategory(product.category || "");
            // Set input fields for editing
            setSizesInput(product.sizes ? product.sizes.join(", ") : "");
            setColorsInput(product.colors ? product.colors.join(", ") : "");
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSizesChange = (value) => {
        setSizesInput(value);
        
        // Handle empty string case
        if (!value || value.trim() === "") {
            setFormData(prev => ({
                ...prev,
                sizes: []
            }));
            return;
        }
        
        // Split by comma, trim whitespace, and filter out empty strings
        const items = value.split(",")
            .map(item => item.trim())
            .filter(item => item !== "" && item.length > 0);
            
        setFormData(prev => ({
            ...prev,
            sizes: items
        }));
    };

    const handleColorsChange = (value) => {
        setColorsInput(value);
        
        // Handle empty string case
        if (!value || value.trim() === "") {
            setFormData(prev => ({
                ...prev,
                colors: []
            }));
            return;
        }
        
        // Split by comma, trim whitespace, and filter out empty strings
        const items = value.split(",")
            .map(item => item.trim())
            .filter(item => item !== "" && item.length > 0);
            
        setFormData(prev => ({
            ...prev,
            colors: items
        }));
    };

    const handleAddImage = () => {
        if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
            setFormData({
                ...formData,
                images: [...formData.images, imageInput.trim()]
            });
            setImageInput("");
        }
    };

    const handleRemoveImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            images: newImages
        });
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        if (value === "custom") {
            setCustomCategory("");
            setFormData({ ...formData, category: "" });
        } else {
            setCustomCategory(value);
            setFormData({ ...formData, category: value });
        }
    };

    const handleCustomCategoryChange = (e) => {
        const value = e.target.value;
        setCustomCategory(value);
        setFormData({ ...formData, category: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validation
        if (!formData.category.trim()) {
            setError("Please select or enter a category");
            setLoading(false);
            return;
        }

        try {
            const data = {
                ...formData,
                price: parseFloat(formData.price),
                rating: parseFloat(formData.rating)
            };

            if (product) {
                // Update existing product
                await api.put(`/product/${product._id}`, data);
            } else {
                // Create new product
                await api.post("/product", data);
            }

            onSave();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Modal Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}></div>

            {/* Modal Dialog */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {product ? "Edit Product" : "Add New Product"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e40046] focus:border-transparent"
                                placeholder="Enter product name"
                            />
                        </div>

                        {/* Brand and Keyword */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Brand *
                                </label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e40046] focus:border-transparent"
                                    placeholder="Enter brand name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Keyword *
                                </label>
                                <input
                                    type="text"
                                    name="keyword"
                                    value={formData.keyword}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e40046] focus:border-transparent"
                                    placeholder="Unique keyword for URL"
                                />
                            </div>
                        </div>

                        {/* Price, Stock, and Rating */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e40046] focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Quantity
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e40046] focus:border-transparent"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rating
                                </label>
                                <input
                                    type="number"
                                    name="rating"
                                    value={formData.rating}
                                    onChange={handleChange}
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e40046] focus:border-transparent"
                                    placeholder="0.0"
                                />
                            </div>
                        </div>

                        {/* Category and Subcategory */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    value={customCategory}
                                    onChange={handleCategoryChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e40046] focus:border-transparent mb-2"
                                >
                                    <option value="">Select Category</option>
                                    <option value="shoes">Shoes</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="accessories">Accessories</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="home">Home & Kitchen</option>
                                    <option value="sports">Sports</option>
                                    <option value="books">Books</option>
                                    <option value="custom">Custom Category</option>
                                </select>
                                {customCategory === "" && (
                                    <input
                                        type="text"
                                        placeholder="Enter custom category"
                                        value={formData.category}
                                        onChange={handleCustomCategoryChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e40046] focus:border-transparent"
                                        required
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subcategory
                                </label>
                                <input
                                    type="text"
                                    name="subcategory"
                                    value={formData.subcategory}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e40046] focus:border-transparent"
                                    placeholder="Enter subcategory"
                                />
                            </div>
                        </div>

                        {/* Product Images */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Images (Optional)
                            </label>
                            <div className="border border-gray-300 rounded-md p-4">
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="url"
                                        value={imageInput}
                                        onChange={(e) => setImageInput(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e40046] focus:border-transparent"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddImage}
                                        className="bg-[#e40046] text-white px-4 py-2 rounded-md hover:bg-[#c2003d] transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                                
                                {/* Image Preview */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image}
                                                alt={`Product ${index + 1}`}
                                                className="w-full h-20 object-cover rounded border"
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/100x100?text=Error";
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                
                                {formData.images.length === 0 && (
                                    <p className="text-gray-400 text-sm text-center py-4">
                                        No images added. Images are optional - you can add them later.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Sizes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Available Sizes
                            </label>
                            <input
                                type="text"
                                value={sizesInput}
                                onChange={(e) => handleSizesChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e40046] focus:border-transparent"
                                placeholder="S, M, L, XL or 6, 7, 8, 9, 10 (comma separated)"
                            />
                            {formData.sizes && formData.sizes.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {formData.sizes.map((size, index) => (
                                        <span
                                            key={index}
                                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                        >
                                            {size}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                Enter sizes separated by commas. Example: S, M, L, XL
                            </p>
                        </div>

                        {/* Colors */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Available Colors
                            </label>
                            <input
                                type="text"
                                value={colorsInput}
                                onChange={(e) => handleColorsChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e40046] focus:border-transparent"
                                placeholder="Red, Blue, Black, White (comma separated)"
                            />
                            {formData.colors && formData.colors.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {formData.colors.map((color, index) => (
                                        <span
                                            key={index}
                                            className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                                        >
                                            {color}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                Enter colors separated by commas. Example: Red, Blue, Black
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e40046] focus:border-transparent"
                                placeholder="Enter product description"
                            ></textarea>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-[#e40046] text-white rounded-md hover:bg-[#c2003d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Saving..." : product ? "Update Product" : "Add Product"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ProductForm;

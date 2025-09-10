import React, { useState } from "react";

function ProductDetailsTabs({ product }) {
    const [activeTab, setActiveTab] = useState("details");

    const renderHighlights = () => (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <i className="fas fa-list-ul text-gray-600"></i>
                <h3 className="font-medium text-gray-800">Highlights</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                    <p className="mb-2"><span className="font-medium">Brand:</span> {product?.brand || "Turnx Sports"}</p>
                    <p className="mb-2"><span className="font-medium">Category:</span> {product?.category || "Sports"}</p>
                    {product?.subcategory && (
                        <p className="mb-2"><span className="font-medium">Subcategory:</span> {product.subcategory}</p>
                    )}
                    <p className="mb-2"><span className="font-medium">Size:</span> {product?.sizes?.join(", ") || "Multiple sizes available"}</p>
                    <p><span className="font-medium">SUPC:</span> SDL502284075</p>
                </div>
                <div>
                    <p className="mb-2"><span className="font-medium">Colors:</span> {product?.colors?.join(", ") || "Orange"}</p>
                    <p className="mb-2"><span className="font-medium">Rating:</span> {product?.rating ? `${product.rating}/5` : "Not rated"}</p>
                    <p className="mb-2"><span className="font-medium">Stock:</span> {product?.stock || 0} units</p>
                    <p><span className="font-medium">BIS:</span> BIS Required NA</p>
                </div>
                <div>
                    <p className="mb-2"><span className="font-medium">Manufacturer's Name & Address:</span></p>
                    <p className="text-xs text-gray-600 mb-2">
                        Amkay Labels Private limited, Plot No. 1650, MIE Bahadurgarh, Jhajjar Haryana-124507
                    </p>
                    <p className="mb-2"><span className="font-medium">Cushioning:</span> High</p>
                    <p><span className="font-medium">Model Name:</span> {product?.name || "Hockey-01_White-Orng"}</p>
                </div>
            </div>
        </div>
    );

    const renderOtherSpecifications = () => (
        <div className="mt-8 space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <i className="fas fa-cog text-gray-600"></i>
                <h3 className="font-medium text-gray-800">Other Specifications</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-medium text-gray-700 mb-3">Other Details</h4>
                <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                        <span className="text-gray-600">Country Of Origin Manufacture or Assembly</span>
                        <span className="font-medium">India</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <span className="text-gray-600">Common or Generic Name of the commodity</span>
                        <span className="font-medium text-blue-600">Sports Fashion -Running Shoes</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <span className="text-gray-600">Net Contents</span>
                        <span className="font-medium">1N</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <span className="text-gray-600">Manufacturer's Name & Address</span>
                        <span className="font-medium">Amkay Labels Private limited, Plot No. 1650, MIE Bahadurgarh, Jhajjar Haryana-124507</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <span className="text-gray-600">Packer's Name & Address</span>
                        <span className="font-medium">Amkay Labels Private limited, Plot No. 1650, MIE Bahadurgarh, Jhajjar Haryana-124507</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <span className="text-gray-600">Marketer's Name & Address</span>
                        <span className="font-medium">Amkay Labels Private limited,MIE Bahadurgarh, Jhajjar Haryana-124507</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <span className="text-gray-600">Importer's Name & Address</span>
                        <span className="font-medium">Amkay Labels Private limited, Plot No. 1650, MIE Bahadurgarh, Jhajjar Haryana-124507</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDescription = () => (
        <div className="mt-8 space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <i className="fas fa-align-left text-gray-600"></i>
                <h3 className="font-medium text-gray-800">Description</h3>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed">
                <p className="mb-4">
                    * TurnX Shoes provide excellent support comfortable shoes with new design. * A pair of TurnX Shoes makes perfect flexibility. 
                    * TurnX Shoes are lightweight and durable. - Provides exceptional comfort and helps prevent foot injuries. - It is one of the most 
                    important reasons for the popularity of TurnX Shoes. These shoes have features that protect your feet while you are participating in any sport.
                </p>
                <p className="mb-4">
                    * Shoes reduce the likelihood of catastrophic foot injuries. * There are many models of TurnX Shoes to choose from. Each sport has 
                    specific design and styles for footwear. When you buy TurnX Shoes, make sure you buy the right model that will satisfy you in a particular sport.
                </p>
                <p>
                    * You can even find the TurnX Shoes for walking and running activities. * Many people buy TurnX Shoes, even if they do not play any sports. 
                    They use their favourite TurnX Shoes in casual outings and events. Because of so many benefits, Laabam Sport Shoes are available on the market today.
                </p>
            </div>
        </div>
    );

    const renderTermsConditions = () => (
        <div className="mt-8 space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <i className="fas fa-file-contract text-gray-600"></i>
                <h3 className="font-medium text-gray-800">Terms & Conditions</h3>
            </div>
            <div className="text-sm text-gray-700 space-y-3">
                <p>The images represent actual product though color of the image and product may slightly differ.</p>
                <p>Snapdeal does not select, edit, modify, alter, add or supplement the information, description and other specifications provided by the Seller.</p>
            </div>
        </div>
    );

    const renderRatingsReviews = () => (
        <div className="py-8">
            <div className="text-center">
                <div className="mb-4">
                    <i className="fas fa-star-half-alt text-4xl text-gray-300"></i>
                </div>
                <p className="text-gray-500 text-lg">No reviews yet</p>
                <p className="text-gray-400 text-sm mt-2">Be the first to review this product</p>
                <button className="mt-4 bg-[#e40046] text-white px-6 py-2 rounded font-medium hover:bg-[#c2003d] transition-colors">
                    Write a Review
                </button>
            </div>
        </div>
    );

    const renderQuestionsAnswers = () => (
        <div className="py-8">
            <div className="text-center">
                <div className="mb-4">
                    <i className="fas fa-question-circle text-4xl text-gray-300"></i>
                </div>
                <p className="text-gray-500 text-lg">No questions yet</p>
                <p className="text-gray-400 text-sm mt-2">Ask the first question about this product</p>
                <button className="mt-4 bg-[#e40046] text-white px-6 py-2 rounded font-medium hover:bg-[#c2003d] transition-colors">
                    Ask a Question
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-white border border-gray-200 rounded-lg mt-8">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="flex">
                    <button
                        onClick={() => setActiveTab("details")}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === "details"
                                ? "border-[#e40046] text-[#e40046]"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Item Details
                    </button>
                    <button
                        onClick={() => setActiveTab("reviews")}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === "reviews"
                                ? "border-[#e40046] text-[#e40046]"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Ratings & Reviews
                    </button>
                    <button
                        onClick={() => setActiveTab("questions")}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === "questions"
                                ? "border-[#e40046] text-[#e40046]"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Questions & Answers
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
                {activeTab === "details" && (
                    <div>
                        {renderHighlights()}
                        {renderOtherSpecifications()}
                        {renderDescription()}
                        {renderTermsConditions()}
                        
                        {/* Helpful feedback */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex items-center gap-4">
                                <span className="text-gray-600 text-sm">Was this information helpful to you?</span>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                                        Yes
                                    </button>
                                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === "reviews" && renderRatingsReviews()}
                {activeTab === "questions" && renderQuestionsAnswers()}
            </div>
        </div>
    );
}

export default ProductDetailsTabs;

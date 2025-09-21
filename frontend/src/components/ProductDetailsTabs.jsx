import React, { useState, useEffect, useCallback } from "react";
import { reviewAPI } from '../api/reviewAPI.js';
import ReviewSubmissionForm from './ReviewSubmissionForm.jsx';
import PaymentFooter from "./PaymentFooter.jsx";
import ContentFooter from "./ContentFooter.jsx";
import CustomerTrustSection from "./CustomerTrustSection.jsx";
import OTPVerificationPopup from "./OTPVerificationPopup.jsx";


function ProductDetailsTabs({ product }) {
    const [activeTab, setActiveTab] = useState("details");
    const [openAccordions, setOpenAccordions] = useState({
        highlights: true,
        specifications: false,
        description: false,
        terms: false
    });
    
    // Review-related state
    const [reviews, setReviews] = useState([]);
    const [reviewStats, setReviewStats] = useState({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: []
    });
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewFilters, setReviewFilters] = useState({
        rating: '',
        sortBy: 'createdAt',
        order: 'desc',
        page: 1,
        limit: 10
    });
    const [searchQuery, setSearchQuery] = useState('');
    
    // Question popup state
    const [showQuestionPopup, setShowQuestionPopup] = useState(false);
    const [questionData, setQuestionData] = useState({
        question: '',
        questionType: {
            color: false,
            design: false,
            material: false,
            usage: false,
            size: false
        },
        nickname: ''
    });
    
    // OTP popup state
    const [showOTPPopup, setShowOTPPopup] = useState(false);
    const [buyNowProduct, setBuyNowProduct] = useState(null);
    
    const handleBuyNow = (productData) => {
        setBuyNowProduct(productData || product);
        setShowOTPPopup(true);
    };

    const handleOTPClose = () => {
        setShowOTPPopup(false);
        setBuyNowProduct(null);
    };

    const handlePaymentSuccess = () => {
        setShowOTPPopup(false);
        setBuyNowProduct(null);
        // Add any success handling logic here
        console.log('Payment successful!');
    };
    
    const loadProductReviews = useCallback(async () => {
        if (!product?._id) return;
        
        try {
            setReviewsLoading(true);
            const response = await reviewAPI.getProductReviews(product._id, reviewFilters);
            if (response.success) {
                setReviews(response.reviews);
                setReviewStats(response.stats);
            }
        } catch (error) {
            console.error('Failed to load reviews:', error);
        } finally {
            setReviewsLoading(false);
        }
    }, [product?._id, JSON.stringify(reviewFilters)]);
    
    // Load reviews when component mounts or productId changes
    useEffect(() => {
        loadProductReviews();
    }, [loadProductReviews]);

    const handleReviewSubmitted = (newReview) => {
        setReviews(prev => [newReview, ...prev]);
        setReviewStats(prev => ({
            ...prev,
            totalReviews: prev.totalReviews + 1
        }));
        loadProductReviews(); // Reload to get updated stats
    };

    const handleMarkHelpful = async (reviewId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to mark reviews as helpful');
                return;
            }
            
            const response = await reviewAPI.markReviewHelpful(reviewId);
            if (response.success) {
                setReviews(prev => 
                    prev.map(review => 
                        review._id === reviewId 
                            ? { ...review, helpfulVotes: response.helpfulVotes }
                            : review
                    )
                );
            }
        } catch (error) {
            console.error('Failed to mark helpful:', error);
            if (error.message?.includes('token') || error.message?.includes('login')) {
                alert('Please login to mark reviews as helpful');
            }
        }
    };

    const handleFilterChange = (filterType, value) => {
        setReviewFilters(prev => ({
            ...prev,
            [filterType]: value,
            page: 1 // Reset to first page when filtering
        }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    const getRatingDistribution = () => {
        const distribution = {};
        for (let i = 1; i <= 5; i++) {
            distribution[i] = 0;
        }
        reviewStats.ratingDistribution.forEach(item => {
            distribution[item._id] = item.count;
        });
        return distribution;
    };

    const toggleAccordion = (accordion) => {
        setOpenAccordions(prev => ({
            ...prev,
            [accordion]: !prev[accordion]
        }));
    };

    const scrollToRatings = () => {
        const ratingsSection = document.getElementById('ratings-reviews-section');
        if (ratingsSection) {
            ratingsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const AccordionSection = ({ title, icon, isOpen, onToggle, children }) => (
        <div className="border-b-2 border-dotted border-gray-100 mb-4">
            <button
                onClick={onToggle}
                className=" flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="w-6 h-6 border border-black text-sm flex items-center justify-center font-light transition-transform duration-200">
                        {isOpen ? '−' : '+'}
                    </span>
                    <h3 className="font-medium text-gray-800">{title}</h3>
                </div>
            </button>
            {isOpen && (
                <div className="p-4 pt-0 border-t border-gray-100">
                    {children}
                </div>
            )}
        </div>
    );

    const renderHighlights = () => (

        <div className="space-y-4">
            <div className=" grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="space-y-2">
                    <div className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-gray-600">STI</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-gray-600">Fit-Regular Fit</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-gray-600">Product Length-Regular</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-gray-600">Number of Pocket-No Pocket</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-gray-600">Sleeves Length-Full Sleeves</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-gray-600">Fabric-Poly Cotton</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-gray-600">Collar-Regular Collar</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-gray-600">Hemline-Curved</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-gray-600">Pattern or Print Type-Textured</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-gray-600">The product may vary from the images due to various reasons like monitor setting or photographic lighting sources or handwork & craftmanship.</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-gray-600">Color-Blue</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-gray-600">Pattern-Popcorn Textured</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-gray-600">Shop By Occasion-Casual</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-gray-600">Pack-Pack of 1</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-gray-600">No. of Items inside-1</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-gray-600">Style Code/Name-ROLEXCHEX</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-gray-600">SUPC- SDL925509662</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderOtherSpecifications = () => (
        <div className="space-y-4">
            <div>
                <h4 className="font-medium text-gray-800 mb-4">Other Details</h4>
                <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                        <span className="text-gray-500">Country of Origin or Manufacture or Assembly</span>
                        <span className="text-gray-800">India</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <span className="text-gray-500">Common or Generic Name of the commodity</span>
                        <span className="text-blue-600">Rudraksha & Jap Malas</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <span className="text-gray-500">Manufacturer's Name & Address</span>
                        <span className="text-gray-800"></span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <span className="text-gray-500">Packer's Name & Address</span>
                        <span className="text-gray-800"></span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <span className="text-gray-500">Marketer's Name & Address</span>
                        <span className="text-gray-800"></span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <span className="text-gray-500">Importer's Name & Address</span>
                        <span className="text-gray-800"></span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDescription = () => (
        <div className="space-y-4">
            <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                <p>
                   {product.description}
                </p>
                <p>
                    Keep Away From Water Perfume And Other Chemicals And Clean It With Dry And Soft Cloth
                </p>
            </div>
        </div>
    );

    const renderTermsConditions = () => (
        <div className="space-y-4">
            <div className="text-sm text-gray-700 space-y-3">
                <p>The images represent actual product though color of the image and product may slightly differ.</p>
                <p>Snapdeal does not select, edit, modify, alter, add or supplement the information, description and other specifications provided by the Seller.</p>
            </div>
        </div>
    );

    const renderRatingsReviews = () => {
        const distribution = getRatingDistribution();
        const totalReviews = reviewStats.totalReviews;
        const averageRating = reviewStats.averageRating || 0;

        return (
            <div className="p-8 bg-gray-50">
                {/* Main Reviews Header */}
                <div className="flex mb-8 bg-white border border-gray-200 p-6 relative">
                    {/* Left Side - Rating Summary */}
                    <div className="flex-1 text-center pr-8 flex flex-col justify-center">
                        <div className="flex items-baseline gap-2 mb-3 justify-center">
                            <div className="text-5xl font-light text-gray-900">
                                {averageRating.toFixed(1)}
                            </div>
                            <div className="text-gray-500 text-lg">/5</div>
                        </div>
                        <div className="flex items-center gap-1 mb-3 justify-center">
                            <span className="text-orange-400 text-xl">
                                {averageRating > 0 ? (
                                    <>
                                        {'★'.repeat(Math.round(averageRating))}
                                        {'☆'.repeat(5 - Math.round(averageRating))}
                                    </>
                                ) : (
                                    '☆☆☆☆☆'
                                )}
                            </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                            {totalReviews} Ratings & {totalReviews} Reviews
                        </div>
                        <button 
                            onClick={() => setActiveTab("reviews")}
                            className="text-blue-600 text-sm hover:underline font-medium"
                        >
                            View All Reviews
                        </button>
                    </div>

                    {/* Vertical Border 1 */}
                    <div className="absolute left-1/3 top-0 bottom-0 w-px bg-gray-200"></div>

                    {/* Center - Recommendation */}
                    <div className="flex-1 text-center px-8 flex flex-col justify-center">
                        <div className="text-4xl font-light text-gray-900 mb-2">
                            {totalReviews > 0 ? Math.round((reviewStats.averageRating / 5) * 100) : 0}
                            <span className="text-lg">%</span>
                        </div>
                        <div className="text-sm text-gray-500 mb-6">
                            Based on {totalReviews} Recommendations.
                        </div>
                        <div className="mb-4">
                            <div className="text-sm text-gray-700 mb-4 font-medium">
                                Would you like to recommend this item?
                            </div>
                            <div className="flex gap-3 justify-center">
                                <button className="px-8 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 font-medium">
                                    YES
                                </button>
                                <button className="px-8 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 font-medium">
                                    NO
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Vertical Border 2 */}
                    <div className="absolute left-2/3 top-0 bottom-0 w-px bg-gray-200"></div>

                    {/* Right Side - Review Action */}
                    <div className="flex-1 text-center pl-8 flex flex-col justify-center">
                        <div className="mb-4">
                            <div className="text-sm text-gray-700 mb-4 font-medium">Have you used this product?</div>
                            <button 
                                onClick={() => {
                                    const token = localStorage.getItem('token');
                                    if (!token) {
                                        alert('Please login to write a review');
                                        return;
                                    }
                                    setShowReviewForm(true);
                                }}
                                className="bg-[#e91e63] text-white px-8 py-3 rounded font-bold hover:bg-[#d81b60] transition-colors"
                            >
                                REVIEW
                            </button>
                        </div>
                    </div>
                </div>

                {/* Customer Reviews Section */}
                <div className=" rounded-lg  mt-6">
                    {/* Reviews Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <div className="text-sm text-gray-500 mb-1">
                                    {reviews.length > 0 ? `1-${Math.min(reviewFilters.limit, reviews.length)} of ${totalReviews} Reviews` : 'No reviews yet'}
                                </div>
                                <h3 className="text-lg font-medium text-gray-800">Customer Reviews</h3>
                            </div>
                            <div className="flex items-center gap-6">
                                {/* Search */}
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            placeholder="Search customer reviews" 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="border border-gray-300 rounded pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:border-blue-500"
                                        />
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                                    </div>
                                </div>
                                
                                {/* Sort By */}
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600">Sort By:</span>
                                    <button 
                                        onClick={() => handleFilterChange('sortBy', 'helpfulVotes')}
                                        className={`text-sm ${reviewFilters.sortBy === 'helpfulVotes' ? 'text-[#e91e63] border-b-2 border-[#e91e63]' : 'text-gray-500 hover:text-gray-700'} pb-1 font-medium`}
                                    >
                                        Most Helpful
                                    </button>
                                    <button 
                                        onClick={() => handleFilterChange('sortBy', 'createdAt')}
                                        className={`text-sm ${reviewFilters.sortBy === 'createdAt' ? 'text-[#e91e63] border-b-2 border-[#e91e63]' : 'text-gray-500 hover:text-gray-700'} pb-1 font-medium`}
                                    >
                                        Most Recent
                                    </button>
                                </div>
                                
                                {/* Filter By */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Filter By:</span>
                                    <select 
                                        value={reviewFilters.rating}
                                        onChange={(e) => handleFilterChange('rating', e.target.value)}
                                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">All Stars</option>
                                        <option value="5">5 Stars</option>
                                        <option value="4">4 Stars</option>
                                        <option value="3">3 Stars</option>
                                        <option value="2">2 Stars</option>
                                        <option value="1">1 Star</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="divide-y divide-gray-200">
                        {reviewsLoading ? (
                            <div className="p-6 text-center">
                                <div className="text-gray-500">Loading reviews...</div>
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="p-6 text-center">
                                <div className="text-gray-500">No reviews yet. Be the first to review this product!</div>
                            </div>
                        ) : (
                            reviews
                                .filter(review => 
                                    searchQuery === '' || 
                                    review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    review.comment.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((review) => (
                                    <div key={review._id} className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center text-white font-medium text-lg">
                                                {getInitial(review.user?.name)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-orange-400 text-lg">
                                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                                    </span>
                                                    <span className="font-medium text-gray-800">{review.title}</span>
                                                </div>
                                                <div className="text-sm text-gray-600 mb-3">
                                                    by <span className="font-medium text-gray-800">{review.user?.name || 'Anonymous'}</span> on {formatDate(review.createdAt)}
                                                    {review.isVerifiedPurchase && (
                                                        <span className="ml-3 text-green-600 font-medium">✓ Verified Buyer</span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-700 mb-4 leading-relaxed">
                                                    {review.comment}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <span>{review.helpfulVotes} People found this review helpful. Was this review helpful?</span>
                                                    <button 
                                                        onClick={() => handleMarkHelpful(review._id)}
                                                        className="ml-4 flex items-center gap-2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        <span className="text-lg">👍</span>
                                                        <span>{review.helpfulVotes}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderQuestionsAnswers = () => (
        <div className="py-8">
            <div className="text-center">
                <div className="mb-4">
                    <i className="fas fa-question-circle text-4xl text-gray-300"></i>
                </div>
                <p className="text-gray-500 text-lg">No questions yet</p>
                <p className="text-gray-400 text-sm mt-2">Ask the first question about this product</p>
                <button 
                    onClick={() => setShowQuestionPopup(true)}
                    className="mt-4 bg-[#e40046] text-white px-6 py-2 rounded font-medium hover:bg-[#c2003d] transition-colors"
                >
                    Ask a Question
                </button>
            </div>
        </div>
    );

    // Question Popup Modal
    const QuestionPopup = () => {
        if (!showQuestionPopup) return null;

        const handleQuestionTypeChange = (type) => {
            setQuestionData(prev => ({
                ...prev,
                questionType: {
                    ...prev.questionType,
                    [type]: !prev.questionType[type]
                }
            }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            // Here you can add the logic to submit the question
            console.log('Question submitted:', questionData);
            // Reset form and close popup
            setQuestionData({
                question: '',
                questionType: {
                    color: false,
                    design: false,
                    material: false,
                    usage: false,
                    size: false
                },
                nickname: ''
            });
            setShowQuestionPopup(false);
        };

        const handleReset = () => {
            setQuestionData({
                question: '',
                questionType: {
                    color: false,
                    design: false,
                    material: false,
                    usage: false,
                    size: false
                },
                nickname: ''
            });
        };

        return (
            <div className="fixed inset-0  flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Have a question?</h2>
                        <button 
                            onClick={() => setShowQuestionPopup(false)}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Question Input */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Your Question:
                            </label>
                            <textarea
                                value={questionData.question}
                                onChange={(e) => setQuestionData(prev => ({ ...prev, question: e.target.value }))}
                                placeholder="- Questions on products and its features"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Question Type */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Question Type: <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={questionData.questionType.color}
                                        onChange={() => handleQuestionTypeChange('color')}
                                        className="mr-2"
                                    />
                                    <span className="text-gray-600">COLOR</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={questionData.questionType.design}
                                        onChange={() => handleQuestionTypeChange('design')}
                                        className="mr-2"
                                    />
                                    <span className="text-gray-600">DESIGN</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={questionData.questionType.material}
                                        onChange={() => handleQuestionTypeChange('material')}
                                        className="mr-2"
                                    />
                                    <span className="text-gray-600">MATERIAL</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={questionData.questionType.usage}
                                        onChange={() => handleQuestionTypeChange('usage')}
                                        className="mr-2"
                                    />
                                    <span className="text-gray-600">USAGE</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={questionData.questionType.size}
                                        onChange={() => handleQuestionTypeChange('size')}
                                        className="mr-2"
                                    />
                                    <span className="text-gray-600">SIZE</span>
                                </label>
                            </div>
                        </div>

                        {/* Nickname */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Nickname:
                            </label>
                            <input
                                type="text"
                                value={questionData.nickname}
                                onChange={(e) => setQuestionData(prev => ({ ...prev, nickname: e.target.value }))}
                                placeholder="Nickname appears near your answer. Avoid using email ID."
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="bg-[#e40046] text-white px-8 py-3 rounded font-medium hover:bg-[#c2003d] transition-colors"
                            >
                                SUBMIT
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="bg-gray-600 text-white px-8 py-3 rounded font-medium hover:bg-gray-700 transition-colors"
                            >
                                RESET
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <>

        <div className="flex">
        < div className="bg-white">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="flex w">
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
                        onClick={scrollToRatings}
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

            {/* Tab Content with Sidebar */}
            <div className="flex">
                {/* Main Content */}
                <div className="flex-[4] p-6 pr-0">
                    {activeTab === "details" && (
                        <div>
                            <AccordionSection
                                title="Highlights"
                                icon="fas fa-list-ul"
                                isOpen={openAccordions.highlights}
                                onToggle={() => toggleAccordion('highlights')}
                            >
                                {renderHighlights()}
                            </AccordionSection>

                            <AccordionSection
                                title="Other Specifications"
                                icon="fas fa-cog"
                                isOpen={openAccordions.specifications}
                                onToggle={() => toggleAccordion('specifications')}
                            >
                                {renderOtherSpecifications()}
                            </AccordionSection>

                            <AccordionSection
                                title="Description"
                                icon="fas fa-align-left"
                                isOpen={openAccordions.description}
                                onToggle={() => toggleAccordion('description')}
                            >
                                {renderDescription()}
                            </AccordionSection>

                            <AccordionSection
                                title="Terms & Conditions"
                                icon="fas fa-file-contract"
                                isOpen={openAccordions.terms}
                                onToggle={() => toggleAccordion('terms')}
                            >
                                {renderTermsConditions()}
                            </AccordionSection>
                            
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
                    
                    {activeTab === "questions" && renderQuestionsAnswers()}
                </div>

               
            </div>
        </div>
           {/* Right Sidebar*/}
                <div className="w-100  p-0 bg-gray-50 ml-10 space-y-3">
                    {/* Sold By Component */}
                    <div className="bg-white p-4  shadow-sm">
                        <div className="text-xs text-gray-500 mb-1">Sold By</div>
                        <div className="text-sm font-medium text-gray-800 mb-2">SHIVJARE BROTHERS</div>
                        <div className="flex items-center gap-1 mb-2">
                            <span className="text-orange-400 text-sm">
                                {(reviewStats.averageRating || 0) > 0 ? (
                                    <>
                                        {'★'.repeat(Math.round(reviewStats.averageRating))}
                                        {'☆'.repeat(5 - Math.round(reviewStats.averageRating))}
                                    </>
                                ) : (
                                    '☆☆☆☆☆'
                                )}
                            </span>
                            <span className="text-xs text-gray-600">({(reviewStats.averageRating || 0).toFixed(1)})</span>
                        </div>
                        <button className="text-blue-600 text-xs hover:underline">View Store &gt;</button>
                    </div>

                    {/* Sell on Snapdeal Component */}
                    <div className="bg-white p-4 shadow-sm">
                        <button className="text-blue-600 text-sm hover:underline">Sell On Snapdeal</button>
                    </div>

                    {/* Explore More Component */}
                    <div className="bg-white p-4 shadow-sm">
                        <div className="text-sm font-medium text-gray-800 mb-2">Explore More</div>
                        <button className="text-blue-600 text-sm hover:underline">&gt; Rudraksha &amp; Jap Malas</button>
                        
                        <div className="mt-4">
                            <div className="text-xs text-gray-400 mb-2">Alternative</div>
                            <button className="text-blue-600 text-xs hover:underline">More Rudraksha &amp; Jap Malas From jsk collection &gt;</button>
                        </div>

                        {/* Rating Circle */}
                        <div className="mt-4 flex justify-center">
                            <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-gray-400 text-sm">{Math.round(reviewStats.averageRating || 0)}</span>
                            </div>
                        </div>
                    </div>

                    {/* In Same Price Component */}
                    <div className="bg-white p-4  shadow-sm">
                        <div className="text-sm font-medium text-blue-600 mb-3">In Same Price</div>
                        <div>
                            <img 
                                src={product?.images[0] || "/api/placeholder/120/120"} 
                                alt="Related product" 
                                className="w-full h-24 object-cover rounded mb-2"
                            />
                            <h4 className="text-xs text-gray-800 mb-1 leading-tight">
                                {product.keyword}
                            </h4>
                            <div className="text-xs text-gray-500 mb-2">Rs. {product.price} <span className="line-through text-gray-400">Rs.{product.oldPrice}</span></div>
                            <button 
                                onClick={() => handleBuyNow()}
                                className="w-full bg-[#e40046] text-white text-xs py-2 rounded font-semibold hover:bg-[#c2003d] transition-colors"
                            >
                                BUY NOW
                            </button>
                        </div>
                    </div>

                </div>

                <div>
                   
                </div>
        
        </div>

        <div className="w-[1150px] h-30 bg-white mt-10"> 
            <span className="ml-10 mt-5"> Customer Product Selfies</span>
        </div>

        <div className="w-[1150px] h-[650px] bg-white mt-10 p-6" id="ratings-reviews-section">
            {renderRatingsReviews()}
        </div>

        {/* Review Submission Form Modal */}
        {showReviewForm && (
            <ReviewSubmissionForm
                productId={product?._id}
                orderId={null} // For now, allow reviews without order verification
                onReviewSubmitted={handleReviewSubmitted}
                onClose={() => setShowReviewForm(false)}
            />
        )}

        <div className="w-[1150px] mt-4 bg-white border border-gray-200">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Questions & Answers</h2>
                <div className="flex justify-between items-center bg-[#fafafa] p-6 rounded-lg">
                    <div className="flex-1">
                        <h3 className="text-base font-medium text-gray-800 mb-2">Have a Question?</h3>
                        <p className="text-sm text-gray-600">Get answers from experts and customers who have used this item.</p>
                    </div>
                    <div className="ml-6">
                        <button 
                            onClick={() => setShowQuestionPopup(true)}
                            className="bg-gray-800 text-white px-6 py-2 rounded font-medium hover:bg-gray-700 transition-colors"
                        >
                            ASK A QUESTION
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Seller Details Section */}
        <div className="w-[1150px] mt-4 bg-white border border-gray-200">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-gray-800">Seller Details</h2>
                    <button className="bg-[#e91e63] text-white px-6 py-2 rounded font-medium hover:bg-[#d81b60] transition-colors">
                        VIEW STORE
                    </button>
                </div>
                
                <div className="flex items-center bg-[#fafafa] p-6 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                        <div className="">
                            <i class="fas fa-store" style={{width:"60",h:"40"}}  ></i>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-800 mb-1">Savani Textile Industries Private Limited</h3>
                        <div className="flex items-center mb-3">
                            <span className="text-orange-400 text-sm">
                                ★★★★☆
                            </span>
                            <span className="text-sm text-gray-600 ml-2">(3.7)</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <span className="text-gray-600 mr-4">Expand your business to millions of customers</span>
                            <button className="text-blue-600 hover:underline">Sell this item on Snapdeal</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Full width footer sections - break out of parent container */}
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen mt-10">
            <CustomerTrustSection/>
            <ContentFooter/>
            <PaymentFooter/>
            <div className='bg-white w-full  h-11 flex  items-center justify-between  text-xs text-[#949aa2] '>
          <span className=' mt-3 ml-10'>Copyright © 2021, Snapdeal Limited. All Rights Reserved</span>
          <span className='mr-15' >Made for Bharat 
           <i className="fa-solid fa-heart text-red-500 hover:scale-125 transition-transform duration-300 ml-2"></i>
            </span>
             </div> 
        </div>
         
      
        {/* Question Popup */}
        <QuestionPopup />
        
        {/* OTP Verification Popup */}
        <OTPVerificationPopup
            isOpen={showOTPPopup}
            onClose={handleOTPClose}
            onPaymentSuccess={handlePaymentSuccess}
            orderTotal={buyNowProduct?.price || 0}
            buyNowProduct={buyNowProduct}
        />
        </>
    )
}

export default ProductDetailsTabs;

import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Swiper modules
import { Navigation, A11y } from "swiper/modules";

function TrendingProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/product")
            .then((res) => {
                const sorted = res.data.products.sort((a, b) => b.rating - a.rating);
                setProducts(sorted.slice(0, 10)); // ⬅️ take top 10
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load trending products");
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center mt-8">Loading trending products...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;


    return (
        <>
            <h3 className="text-xl text-[#333333] mb-4 ml-[90px] w-[80%] mx-auto">TRENDING PRODUCTS</h3>
            <div className="mt-8 mb-15 ml-[90px] w-[88%] mx-auto border border-[#f6f6f6] rounded-sm bg-white shadow-sm p-5">
                <Swiper
                    modules={[Navigation, A11y]}
                    spaceBetween={0}
                    slidesPerView={6}
                    navigation={true}
                    loop={true}
                >
                    {products.map((product, idx) => (
                        <SwiperSlide key={product._id || idx}>
                            <Link to={`/product/${product.keyword || product.name.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-')}/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div
                                    className="p-5 flex flex-col transition-all duration-200 hover:border-[#f6f6f6] hover:shadow-xl hover-bg-white"
                                    style={{ height: "393px" }}
                                >
                                    <img
                                        src={product.image || "https://via.placeholder.com/150"}
                                        alt={product.name}
                                        className="w-28 h-40 object-contain mb-2 rounded self-center"
                                    />
                                    <div className="w-full">
                                        <h4 className="font-semibold text-md mb-2 text-left w-full line-clamp-2">
                                            {product.name}
                                        </h4>
                                        {/* Rating */}
                                        <div className="mb-2 flex items-center">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <svg
                                                    key={star}
                                                    className={`w-4 h-4 mr-1 ${product.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.174 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
                                                </svg>
                                            ))}
                                        </div>
                                        {/* Price & Offer in single line */}
                                        <div className="flex items-center gap-2 flex-nowrap">
                                            <span className="line-through text-gray-400 text-sm whitespace-nowrap">
                                                Rs {product.oldPrice || product.price + 100}
                                            </span>
                                            <span className=" text-[#333333] text-md whitespace-nowrap">
                                                Rs {product.price}
                                            </span>
                                            <span className="text-xs text-gray-600 px-2 py-1 border border-gray-200 rounded shrink-0 whitespace-nowrap">
                                                {product.oldPrice
                                                    ? Math.round(100 - (product.price / product.oldPrice) * 100)
                                                    : Math.round(100 - (product.price / (product.price + 100)) * 100)}
                                                % OFF
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </>

    );
}

export default TrendingProducts;
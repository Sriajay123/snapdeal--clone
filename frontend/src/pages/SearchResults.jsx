import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import SortDropdown from '../components/SortDropdown';
import { sortProducts } from '../utils/sortProducts';



function SearchResults() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('popularity');

    useEffect(() => {
        if (query) {
            fetchSearchResults();
        }
    }, [query]);

    const fetchSearchResults = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/product/search?q=${encodeURIComponent(query)}`);
            if (response.data.success) {
                setProducts(response.data.products);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSortChange = (value) => {
        setSortBy(value);
        const sortedProducts = sortProducts([...products], value);
        setProducts(sortedProducts);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <Navbar />
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e40046]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-xl font-semibold text-gray-800 mb-2">
                        Search Results for "{query}"
                    </h1>
                    <p className="text-gray-600">
                        {products.length} products found
                    </p>
                </div>

                {products.length > 0 ? (
                    <>
                        <div className="flex justify-end mb-4">
                            <SortDropdown value={sortBy} onChange={handleSortChange} />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.map((product) => (

                                window.location.href = `/products/${product.category}/${product.subcategory}`
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">No products found</h2>
                        <p className="text-gray-600">Try different keywords or check the spelling</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchResults;
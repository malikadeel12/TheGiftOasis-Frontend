import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import WhatsAppButton from "../components/WhatsAppButton";
import ProductCard from "../components/ProductCard";
import HeroBanner from "../components/HeroBanner";
import DealBanner from "../components/DealBanner";
import CollectionsCarousel from "../components/CollectionsCarousel";
import Newsletter from "../components/Newsletter";
import { getHighlights } from "../services/api";

// Default fallback categories if API fails
const defaultCategories = [
    { name: 'Cash Bouquets', itemCount: 0, image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600' },
    { name: 'Makeup & Skincare', itemCount: 0, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600' },
    { name: 'Chocolates & Snacks', itemCount: 0, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600' },
    { name: 'Flowers', itemCount: 0, image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600' },
    { name: 'For Him', itemCount: 0, image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600' },
    { name: 'For Her', itemCount: 0, image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600' },
];

export default function Home({ addToCart = () => {}, addToWishlist, removeFromWishlist, isInWishlist }) {
    const [highlights, setHighlights] = useState({
        featured: [],
        bundles: [],
        newArrivals: [],
        bestSellers: [],
    });
    const [loadingHighlights, setLoadingHighlights] = useState(true);
    const [highlightError, setHighlightError] = useState("");

    // Get unique categories from all highlight products
    const categories = useMemo(() => {
        const allProducts = [
            ...highlights.featured,
            ...highlights.bundles,
            ...highlights.newArrivals,
            ...highlights.bestSellers
        ];
        
        const categoryMap = {};
        allProducts.forEach(product => {
            if (product.category) {
                const cat = product.category.trim();
                if (!categoryMap[cat]) {
                    categoryMap[cat] = { 
                        name: cat, 
                        count: 0,
                        image: product.imageUrl 
                    };
                }
                categoryMap[cat].count++;
            }
        });
        
        const extractedCategories = Object.entries(categoryMap).map(([name, data]) => ({
            name,
            itemCount: data.count,
            image: data.image
        })).sort((a, b) => b.count - a.count);

        // If we have real categories, use them; otherwise use defaults
        return extractedCategories.length > 0 ? extractedCategories : defaultCategories;
    }, [highlights]);

    useEffect(() => {
        const fetchHighlights = async () => {
            try {
                setLoadingHighlights(true);
                const res = await getHighlights();
                setHighlights({
                    featured: res.data?.featured || [],
                    bundles: res.data?.bundles || [],
                    newArrivals: res.data?.newArrivals || [],
                    bestSellers: res.data?.bestSellers || [],
                });
                setHighlightError("");
            } catch (err) {
                console.error("❌ Highlights load error:", err);
                setHighlightError(
                    err.response?.data?.message ||
                        err.message ||
                        "Unable to load highlights right now."
                );
            } finally {
                setLoadingHighlights(false);
            }
        };

        fetchHighlights();
    }, []);

    return (
        <div style={{ backgroundColor: '#fce7f3' }}>
            {/* Hero Banner */}
            <HeroBanner />

            {/* Deal Banner - Shows when admin sets discounts */}
            <DealBanner />

            {/* Our Collections - Carousel */}
            <CollectionsCarousel categories={categories} />

            {/* Product Sections - Combined */}
            <div className="pt-4 pb-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {loadingHighlights ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array(8).fill(0).map((_, idx) => (
                                <div
                                    key={`skeleton-${idx}`}
                                    className="aspect-square rounded-xl animate-pulse"
                                    style={{ backgroundColor: '#fbcfe8' }}
                                />
                            ))}
                        </div>
                    ) : highlightError ? (
                        <div className="text-center py-8 rounded-xl" style={{ backgroundColor: '#fbcfe8', color: '#e34f4d' }}>
                            {highlightError}
                        </div>
                    ) : (
                        <>
                            {/* Featured Products */}
                            {highlights.featured.length > 0 && (
                                <div className="mb-10">
                                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-6" style={{ color: '#1a1a1a' }}>
                                        Shop Now
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {highlights.featured.slice(0, 4).map((product) => (
                                            <ProductCard
                                                key={product._id}
                                                product={product}
                                                addToCart={addToCart}
                                                addToWishlist={addToWishlist}
                                                removeFromWishlist={removeFromWishlist}
                                                isInWishlist={isInWishlist}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Arrivals */}
                            {highlights.newArrivals.length > 0 && (
                                <div className="mb-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#1a1a1a' }}>
                                            New Arrivals
                                        </h2>
                                        <Link to="/shop" className="text-sm font-semibold hover:underline" style={{ color: '#e34f4d' }}>
                                            View All →
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {highlights.newArrivals.slice(0, 4).map((product) => (
                                            <ProductCard
                                                key={product._id}
                                                product={product}
                                                addToCart={addToCart}
                                                addToWishlist={addToWishlist}
                                                removeFromWishlist={removeFromWishlist}
                                                isInWishlist={isInWishlist}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Best Sellers */}
                            {highlights.bestSellers.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#1a1a1a' }}>
                                            Best Sellers
                                        </h2>
                                        <Link to="/shop" className="text-sm font-semibold hover:underline" style={{ color: '#e34f4d' }}>
                                            View All →
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {highlights.bestSellers.slice(0, 4).map((product) => (
                                            <ProductCard
                                                key={product._id}
                                                product={product}
                                                addToCart={addToCart}
                                                addToWishlist={addToWishlist}
                                                removeFromWishlist={removeFromWishlist}
                                                isInWishlist={isInWishlist}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* About Us Section */}
            <section 
                className="py-16 px-4"
                style={{ backgroundColor: '#ffffff' }}
            >
                <div className="max-w-4xl mx-auto text-center">
                    <h2 
                        className="text-2xl md:text-3xl font-bold mb-6"
                        style={{ color: '#1a1a1a' }}
                    >
                        About The Gift Oasis
                    </h2>
                    <p 
                        className="text-base md:text-lg mb-8 leading-relaxed"
                        style={{ color: '#666' }}
                    >
                        At The Gift Oasis, we believe every gift tells a story. That&apos;s why we design
                        personalized and budget-friendly gifts that speak from the heart. Whether you
                        want a chic ribbon bouquet, a luxury hamper, or a simple customized surprise,
                        we&apos;ve got you covered. Our mission is to make every celebration memorable 
                        with our unique collection of gifts.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: '✅', text: 'Customized gifts in your budget' },
                            { icon: '🎁', text: 'Quality products, wrapped with care' },
                            { icon: '🏷️', text: 'Delivery all across Pakistan' },
                            { icon: '❤️', text: 'Free personalized note with every gift' }
                        ].map((item, idx) => (
                            <div 
                                key={idx} 
                                className="p-4 rounded-xl"
                                style={{ backgroundColor: '#fbe8ec' }}
                            >
                                <div className="text-3xl mb-2">{item.icon}</div>
                                <p className="text-sm font-medium" style={{ color: '#4b3f3b' }}>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How to Order */}
            <section className="py-16 px-4 max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h2 
                        className="text-2xl md:text-3xl font-bold mb-4"
                        style={{ color: '#1a1a1a' }}
                    >
                        How to Order
                    </h2>
                    <p style={{ color: '#666' }}>
                        We believe in transparent pricing ✨ Product prices are fixed; delivery charges vary by location.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { step: 'Step 1', text: 'Select your product from our shop.' },
                        { step: 'Step 2', text: 'Make payment (product price only).' },
                        { step: 'Step 3', text: 'Send us your Name, Address, Contact Number, and Payment Screenshot on WhatsApp.' },
                        { step: 'Step 4', text: 'Delivery charges will be calculated separately and confirmed before dispatch.' }
                    ].map((item, idx) => (
                    <div 
                        key={idx}
                        className="p-6 rounded-xl"
                        style={{ backgroundColor: '#fbcfe8' }}
                    >
                            <h3 
                                className="font-semibold text-lg mb-2"
                                style={{ color: '#e34f4d' }}
                            >
                                {item.step}
                            </h3>
                            <p style={{ color: '#1a1a1a' }}>{item.text}</p>
                        </div>
                    ))}
                </div>

                <div 
                    className="mt-8 p-6 rounded-xl text-center"
                    style={{ backgroundColor: '#e34f4d', color: '#ffffff' }}
                >
                    <p className="font-medium">
                        Kindly note: Payment confirmation + delivery charges must be cleared before order dispatch 🚚
                    </p>
                </div>
            </section>

            {/* Newsletter */}
            <Newsletter />

            {/* WhatsApp Floating Button */}
            <WhatsAppButton />
        </div>
    );
}

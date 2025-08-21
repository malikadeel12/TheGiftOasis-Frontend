// src/pages/Home.jsx
import React from "react";
import { FaCheckCircle, FaGift, FaTags, FaRegHeart } from "react-icons/fa";
import LogoImage from "../assets/logo.jpg";
import WhatsAppButton from "../components/WhatsAppButton";

export default function Home() {
    return (
        <div className="bg-gradient-to-b from-pink-50 via-white to-pink-50">

            {/* Hero Section */}
            <section className="relative bg-pink-50 rounded-b-3xl overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid md:grid-cols-2 gap-10 items-center">
                    
                    {/* Left Content */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-pink-900 mb-4">
                            Welcome to <span className="text-pink-600">thegiftoasis_</span>
                        </h1>
                        <h2 className="text-2xl font-semibold text-pink-800 mb-3">
                            Your One-Stop Destination for Customized Gifts 💝
                        </h2>
                        <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                            From birthdays to anniversaries, from little surprises to big celebrations — 
                            we create gifts that fit your style and your budget.
                        </p>
                        <a
                            href="/shop"
                            className="inline-block bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full font-semibold transition duration-300 shadow-md hover:shadow-lg w-fit"
                        >
                            Shop Now
                        </a>
                    </div>

                    {/* Right Image */}
                    <div className="flex items-center justify-center">
                        <img
                            src={LogoImage}
                            alt="Celebration Gifts"
                            className="w-full max-w-sm object-contain rounded-2xl shadow-md"
                        />
                    </div>
                </div>
            </section>

            {/* About Us */}
            <section className="max-w-6xl mx-auto px-6 lg:px-12 py-20 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">About Us</h2>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-12">
                    At thegiftoasis, we believe every gift tells a story. That’s why we design
                    personalized and budget-friendly gifts that speak from the heart. Whether you
                    want a chic ribbon bouquet, a luxury hamper, or a simple customized surprise,
                    we’ve got you covered.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex items-start gap-3">
                        <FaCheckCircle className="text-pink-500 text-2xl mt-1" />
                        <p className="text-gray-700 text-lg">Customized gifts in your budget</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <FaGift className="text-pink-500 text-2xl mt-1" />
                        <p className="text-gray-700 text-lg">Quality products, wrapped with care</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <FaTags className="text-pink-500 text-2xl mt-1" />
                        <p className="text-gray-700 text-lg">Delivery all across Pakistan</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <FaRegHeart className="text-pink-500 text-2xl mt-1" />
                        <p className="text-gray-700 text-lg">Free personalized note with every gift</p>
                    </div>
                </div>
            </section>

            {/* Our Services */}
            <section className="bg-gradient-to-r from-pink-50 to-pink-100 py-20 px-6 lg:px-12 rounded-t-3xl shadow-inner">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold mb-3">Customized Hampers</h3>
                        <p className="text-gray-600">Build your own hamper with chocolates, skincare, candles & more</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold mb-3">Budget-Friendly Surprises</h3>
                        <p className="text-gray-600">Tell us your budget, we’ll create the magic</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold mb-3">Occasion-Based Gifts</h3>
                        <p className="text-gray-600">Birthday 🎉 | Anniversary 💍 | Baby Shower 👶 | Just Because 💌</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold mb-3">Special Add-ons</h3>
                        <p className="text-gray-600">Personalized name tags, greeting cards & photos</p>
                    </div>
                </div>
            </section>

            {/* How to Order / Order Policy */}
            <section className="py-20 px-6 lg:px-12 bg-white">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">How to Order</h2>
                    <p className="text-gray-600 text-lg mb-12">
                        We believe in transparent pricing ✨ Product prices are fixed; delivery charges vary by location and are calculated separately.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="bg-pink-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                            <h3 className="font-semibold text-lg mb-3 text-pink-600">Step 1</h3>
                            <p className="text-gray-700">Select your product from our shop.</p>
                        </div>
                        <div className="bg-pink-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                            <h3 className="font-semibold text-lg mb-3 text-pink-600">Step 2</h3>
                            <p className="text-gray-700">Make payment (product price only).</p>
                        </div>
                        <div className="bg-pink-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                            <h3 className="font-semibold text-lg mb-3 text-pink-600">Step 3</h3>
                            <p className="text-gray-700">
                                Send us your <strong>Name</strong>, <strong>Address</strong>, <strong>Contact Number</strong>, and <strong>Payment Screenshot</strong> on WhatsApp.
                            </p>
                        </div>
                        <div className="bg-pink-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                            <h3 className="font-semibold text-lg mb-3 text-pink-600">Step 4</h3>
                            <p className="text-gray-700">
                                Delivery charges will be calculated separately and confirmed before dispatch.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 bg-gradient-to-r from-pink-100 to-pink-200 py-6 px-6 rounded-2xl shadow-inner">
                        <p className="text-pink-800 font-medium text-lg">
                            Kindly note: Payment confirmation + delivery charges must be cleared before order dispatch 🚚
                        </p>
                    </div>
                </div>
            </section>

            {/* ✅ WhatsApp Floating Button */}
            <WhatsAppButton />
        </div>
    );
}

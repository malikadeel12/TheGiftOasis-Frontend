import { useEffect, useState } from "react";
import { LogIn, ShoppingCart, Heart, Search, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import logo from "../assets/logo.jpg";

export default function Navbar({ cartItems = [], wishlistCount = 0 }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
  const [isSticky, setIsSticky] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("authChange", handleAuthChange);
    
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar text-xs sm:text-sm font-medium">
        <div className="flex items-center justify-center gap-2 sm:gap-4 px-2 sm:px-4 py-2">
          <span className="truncate">📍 Rwp/Isb | Delivery all over Pakistan</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">NO COD ❌ | NO REFUNDS ❌</span>
        </div>
      </div>

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-50 animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSearch(false)}
          />
          
          {/* Search Container */}
          <div className="relative h-full flex flex-col items-center justify-start pt-32 px-4">
            {/* Close Button */}
            <button 
              onClick={() => setShowSearch(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-110"
            >
              <X size={24} />
            </button>

            {/* Search Box */}
            <div className="w-full max-w-2xl animate-slide-down">
              {/* Title */}
              <h2 className="text-white text-2xl md:text-3xl font-bold text-center mb-6">
                What are you looking for?
              </h2>
              
              {/* Search Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search size={24} className="text-gray-400 group-focus-within:text-[#e34f4d] transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search for gifts, bouquets, chocolates..."
                  className="w-full h-16 text-lg rounded-2xl pl-16 pr-14 bg-white shadow-2xl border-2 border-transparent focus:border-[#e34f4d] focus:outline-none transition-all"
                  autoFocus
                />
                <button className="absolute inset-y-0 right-2 flex items-center">
                  <span className="bg-[#e34f4d] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#c94543] transition-colors">
                    Search
                  </span>
                </button>
              </div>

              {/* Popular Searches */}
              <div className="mt-8">
                <p className="text-white/70 text-sm mb-3 text-center">Popular Searches</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Birthday Gifts', 'Flowers', 'Chocolates', 'Cash Bouquets', 'For Him', 'For Her'].map((term) => (
                    <button
                      key={term}
                      className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition-all hover:scale-105"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CSS Animations */}
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideDown {
              from { 
                opacity: 0;
                transform: translateY(-30px);
              }
              to { 
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fade-in {
              animation: fadeIn 0.3s ease-out;
            }
            .animate-slide-down {
              animation: slideDown 0.4s ease-out 0.1s both;
            }
          `}</style>
        </div>
      )}

      {/* Main Header */}
      <header 
        className={`sticky-header ${isSticky ? 'sticky-header-active' : ''} sticky top-0 z-40`}
        style={{ backgroundColor: '#ffd5d8' }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Left: Mobile Menu + Logo */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-white transition-colors"
                style={{ color: '#1a1a1a' }}
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="The Gift Oasis"
                  className="h-10 sm:h-12 lg:h-14 w-auto rounded-full border-2 border-white shadow-md"
                />
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="px-3 xl:px-4 py-2 rounded-lg text-sm xl:text-base font-medium transition-all hover:bg-white"
                  style={{ color: '#1a1a1a' }}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right: Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 rounded-lg hover:bg-white transition-colors"
                style={{ color: '#1a1a1a' }}
                title="Search"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2 rounded-lg hover:bg-white transition-colors"
                style={{ color: '#1a1a1a' }}
                title="Wishlist"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span 
                    className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full"
                    style={{ backgroundColor: '#e34f4d' }}
                  >
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 rounded-lg hover:bg-white transition-colors"
                style={{ color: '#1a1a1a' }}
                title="Cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span 
                    className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full"
                    style={{ backgroundColor: '#e34f4d' }}
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* My Orders - Only show when logged in */}
              {isLoggedIn && (
                <Link
                  to="/my-orders"
                  className="hidden md:flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium transition-all hover:bg-white"
                  style={{ color: '#1a1a1a' }}
                  title="My Orders"
                >
                  <span className="text-sm">📦</span>
                  <span className="hidden lg:inline text-xs sm:text-sm">Orders</span>
                </Link>
              )}

              {/* Login / Logout */}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-white text-xs sm:text-sm font-medium transition-all hover:opacity-90 ml-1"
                  style={{ backgroundColor: '#e34f4d' }}
                  title="Logout"
                >
                  <LogIn size={16} className="rotate-180" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-white text-xs sm:text-sm font-medium transition-all hover:opacity-90 ml-1"
                  style={{ backgroundColor: '#e34f4d' }}
                  title="Login"
                >
                  <LogIn size={16} />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div 
            className="lg:hidden border-t" 
            style={{ borderColor: 'rgba(227, 79, 77, 0.12)', backgroundColor: '#ffffff' }}
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block py-3 px-4 rounded-lg font-medium transition-colors hover:bg-[#fbe8ec]"
                  style={{ color: '#1a1a1a' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-3 mt-3 border-t" style={{ borderColor: 'rgba(227, 79, 77, 0.12)' }}>
                <div className="flex items-center gap-4 px-4 py-2">
                  <a
                    href="https://www.instagram.com/thegiftoasis_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                    style={{ color: '#e34f4d' }}
                  >
                    <FaInstagram size={20} />
                    <span>Instagram</span>
                  </a>
                  <a
                    href="http://www.tiktok.com/@thegiftoasis_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                    style={{ color: '#1a1a1a' }}
                  >
                    <FaTiktok size={20} />
                    <span>TikTok</span>
                  </a>
                </div>
              </div>

              <div className="pt-3 px-4 space-y-2">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/my-orders"
                      className="block w-full text-center py-3 rounded-lg font-medium"
                      style={{ backgroundColor: '#fbe8ec', color: '#e34f4d' }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      📦 My Orders
                    </Link>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-center py-3 rounded-lg font-medium text-white"
                      style={{ backgroundColor: '#e34f4d' }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block w-full text-center py-3 rounded-lg font-medium text-white"
                    style={{ backgroundColor: '#e34f4d' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

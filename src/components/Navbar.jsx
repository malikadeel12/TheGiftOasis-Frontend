import { useEffect, useState } from "react";
import { UserPlus, LogIn, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import logo from "../assets/logo.jpg";

export default function Navbar({ cartItems = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("authChange", handleAuthChange);
    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  // ✅ Total items count
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-pink-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="The Gift Oasis"
              className="h-12 w-auto rounded-full border-2 border-pink-300 shadow-sm"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-pink-600 hover:text-pink-800 font-medium">
              Home
            </Link>
            <Link to="/shop" className="text-pink-600 hover:text-pink-800 font-medium">
              Shop
            </Link>
            <Link to="/blog" className="text-pink-600 hover:text-pink-800 font-medium">
              Blog
            </Link>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/thegiftoasis_?igsh=OGxqZWE4ZXVsYTU2&utm_source=ig_contact_invite"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-medium"
            >
              <FaInstagram className="text-2xl text-pink-600 hover:text-pink-800 transition" />
              <span className="text-pink-600 hover:text-pink-800 transition">
                Instagram
              </span>
            </a>


            {/* TikTok */}
            <a
              href="http://www.tiktok.com/@thegiftoasis_"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-medium"
            >
              <FaTiktok className="text-2xl text-black drop-shadow-[0_0_6px_rgba(0,255,255,0.8)] hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.9)] transition" />
              <span className="text-black drop-shadow-[0_0_6px_rgba(0,255,255,0.8)] hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.9)] transition">
                TikTok
              </span>
            </a>

            {/* Actions */}
            {isLoggedIn ? (
              <>
                <Link
                  to="/my-orders"
                  className="flex items-center gap-1 bg-pink-200 text-pink-700 px-3 py-1 rounded-full shadow hover:bg-pink-300 transition"
                >
                  📦 My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 bg-pink-500 text-white px-3 py-1 rounded-full shadow hover:bg-pink-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1 bg-pink-500 text-white px-3 py-1 rounded-full shadow hover:bg-pink-600 transition"
                >
                  <LogIn size={18} />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1 bg-pink-200 text-pink-700 px-3 py-1 rounded-full shadow hover:bg-pink-300 transition"
                >
                  <UserPlus size={18} />
                  New Account
                </Link>
              </>
            )}
            <Link
              to="/cart"
              className="relative flex items-center gap-1 bg-pink-500 text-white px-3 py-1 rounded-full shadow hover:bg-pink-600 transition"
            >
              <ShoppingCart size={18} />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-pink-600 focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 py-3 space-y-3 border-t border-pink-200">
          <Link to="/" className="block text-pink-600 hover:text-pink-800">
            Home
          </Link>
          <Link to="/shop" className="block text-pink-600 hover:text-pink-800">
            Shop
          </Link>
              <Link to="/blog" className="block text-pink-600 hover:text-pink-800">
                Blog
              </Link>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/thegiftoasis_?igsh=OGxqZWE4ZXVsYTU2&utm_source=ig_contact_invite"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-medium"
          >
            <FaInstagram className="text-xl text-pink-600 hover:text-pink-800 transition" />

            <span className="bg-gradient-to-r from-pink-500 via-orange-500 to-purple-600 text-transparent bg-clip-text">
              Instagram
            </span>
          </a>

          {/* TikTok */}
          <a
            href="http://www.tiktok.com/@thegiftoasis_"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-medium"
          >
            <FaTiktok className="text-xl text-black drop-shadow-[0_0_6px_rgba(0,255,255,0.8)] hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.9)] transition" />
            <span className="text-black drop-shadow-[0_0_6px_rgba(0,255,255,0.8)] hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.9)] transition">
              TikTok
            </span>
          </a>

          <div className="flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <Link
                  to="/my-orders"
                  className="flex items-center gap-1 bg-pink-200 text-pink-700 px-3 py-1 rounded-full shadow hover:bg-pink-300 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📦 My Orders
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-1 bg-pink-500 text-white px-3 py-1 rounded-full shadow hover:bg-pink-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1 bg-pink-500 text-white px-3 py-1 rounded-full shadow hover:bg-pink-600 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn size={18} />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1 bg-pink-200 text-pink-700 px-3 py-1 rounded-full shadow hover:bg-pink-300 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserPlus size={18} />
                  New Account
                </Link>
              </>
            )}
            <Link
              to="/cart"
              className="relative flex items-center gap-1 bg-pink-500 text-white px-3 py-1 rounded-full shadow hover:bg-pink-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart size={18} />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

// src/components/Footer.jsx
import { FaInstagram, FaTiktok, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-pink-900 via-pink-800 to-rose-900 text-white mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-pink-300">thegiftoasis</h3>
            <p className="text-pink-100 text-sm leading-relaxed">
              Your one-stop destination for customized gifts. From birthdays to anniversaries, 
              we create gifts that fit your style and budget.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/thegiftoasis_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-pink-700 hover:bg-pink-600 flex items-center justify-center transition-all hover:scale-110"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="http://www.tiktok.com/@thegiftoasis_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-pink-700 hover:bg-pink-600 flex items-center justify-center transition-all hover:scale-110"
              >
                <FaTiktok size={20} />
              </a>
              <a
                href="https://wa.me/923295108102"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center transition-all hover:scale-110"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-pink-300">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-pink-100 hover:text-white transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-pink-100 hover:text-white transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-pink-100 hover:text-white transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-pink-100 hover:text-white transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="text-pink-100 hover:text-white transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-pink-300">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-pink-100 hover:text-white transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-pink-100 hover:text-white transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-pink-100 hover:text-white transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-pink-100 hover:text-white transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                  Returns Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-pink-100 hover:text-white transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-pink-100 hover:text-white transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-pink-300">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FaPhone className="text-pink-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-pink-200">Phone</p>
                  <a href="tel:+923295108102" className="text-white hover:text-pink-300 transition">
                    +92 329 5108102
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaWhatsapp className="text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-pink-200">WhatsApp</p>
                  <a 
                    href="https://wa.me/923295108102" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-green-400 transition"
                  >
                    +92 329 5108102
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaEnvelope className="text-pink-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-pink-200">Email</p>
                  <a href="mailto:thegiftoasis31@gmail.com" className="text-white hover:text-pink-300 transition text-sm">
                    thegiftoasis31@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-pink-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-pink-200">Location</p>
                  <p className="text-white text-sm">Pakistan</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-pink-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-pink-200 text-sm text-center md:text-left">
              © {currentYear} thegiftoasis. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/terms" className="text-pink-200 hover:text-white transition">
                Terms
              </Link>
              <Link to="/privacy" className="text-pink-200 hover:text-white transition">
                Privacy
              </Link>
              <Link to="/shipping" className="text-pink-200 hover:text-white transition">
                Shipping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

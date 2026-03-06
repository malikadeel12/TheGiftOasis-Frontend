import { FaInstagram, FaTiktok, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-0" style={{ color: '#ffffff' }}>
      {/* Background filler to match newsletter color */}
      <div 
        className="absolute top-0 left-0 right-0 h-20 -z-10"
        style={{ backgroundColor: '#fbe8ec' }}
      />
      
      {/* Wavy Top Border */}
      <div className="relative">
        <svg 
          viewBox="0 0 1440 60" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 md:h-16 lg:h-20"
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          <path 
            d="M0 30C120 40 240 50 360 45C480 40 600 25 720 20C840 15 960 20 1080 30C1200 40 1320 50 1380 55L1440 60V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0V30Z" 
            fill="#4b3f3b"
          />
        </svg>
      </div>

      {/* Main Footer */}
      <div style={{ backgroundColor: '#4b3f3b' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 
              className="text-2xl font-bold"
              style={{ color: '#ffb5c2' }}
            >
              The Gift Oasis
            </h3>
            <p 
              className="text-sm leading-relaxed"
              style={{ color: '#fbe8ec' }}
            >
              Your one-stop destination for customized gifts. From birthdays to anniversaries, 
              we create gifts that fit your style and budget.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/thegiftoasis_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ backgroundColor: '#e34f4d' }}
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="http://www.tiktok.com/@thegiftoasis_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ backgroundColor: '#e34f4d' }}
              >
                <FaTiktok size={20} />
              </a>
              <a
                href="https://wa.me/923295108102"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ backgroundColor: '#25d366' }}
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 
              className="text-lg font-semibold"
              style={{ color: '#ffb5c2' }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              {['Home', 'Shop', 'Cart', 'My Orders'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="transition flex items-center gap-2 hover:text-white"
                    style={{ color: '#fbe8ec' }}
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: '#e34f4d' }}
                    />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 
              className="text-lg font-semibold"
              style={{ color: '#ffb5c2' }}
            >
              Customer Service
            </h4>
            <ul className="space-y-2">
              {['Contact Us', 'FAQ', 'Shipping Info', 'Returns Policy', 'Terms & Conditions', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}
                    className="transition flex items-center gap-2 hover:text-white"
                    style={{ color: '#fbe8ec' }}
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: '#e34f4d' }}
                    />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 
              className="text-lg font-semibold"
              style={{ color: '#ffb5c2' }}
            >
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FaPhone 
                  className="mt-1 flex-shrink-0" 
                  style={{ color: '#ffb5c2' }}
                />
                <div>
                  <p className="text-sm" style={{ color: '#fbe8ec' }}>Phone</p>
                  <a 
                    href="tel:+923295108102" 
                    className="hover:text-white transition"
                    style={{ color: '#ffffff' }}
                  >
                    +92 329 5108102
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaWhatsapp 
                  className="mt-1 flex-shrink-0" 
                  style={{ color: '#25d366' }}
                />
                <div>
                  <p className="text-sm" style={{ color: '#fbe8ec' }}>WhatsApp</p>
                  <a 
                    href="https://wa.me/923295108102"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition"
                    style={{ color: '#ffffff' }}
                  >
                    +92 329 5108102
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaEnvelope 
                  className="mt-1 flex-shrink-0" 
                  style={{ color: '#ffb5c2' }}
                />
                <div>
                  <p className="text-sm" style={{ color: '#fbe8ec' }}>Email</p>
                  <a 
                    href="mailto:thegiftoasis31@gmail.com"
                    className="hover:text-white transition text-sm"
                    style={{ color: '#ffffff' }}
                  >
                    thegiftoasis31@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt 
                  className="mt-1 flex-shrink-0" 
                  style={{ color: '#ffb5c2' }}
                />
                <div>
                  <p className="text-sm" style={{ color: '#fbe8ec' }}>Location</p>
                  <p className="text-sm" style={{ color: '#ffffff' }}>Pakistan</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(255, 181, 194, 0.2)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p 
              className="text-sm text-center md:text-left"
              style={{ color: '#fbe8ec' }}
            >
              © {currentYear} The Gift Oasis. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              {['Terms', 'Privacy', 'Shipping'].map((item) => (
                <Link 
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="transition hover:text-white"
                  style={{ color: '#fbe8ec' }}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </footer>
  );
}

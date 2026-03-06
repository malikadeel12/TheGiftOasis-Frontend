import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo.jpg";

export default function HeroBanner() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-[500px] md:min-h-[600px] overflow-hidden">
      {/* Animated Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center animate-pulse-slow"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=1920")',
          transform: `scale(1.1) translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      />

      {/* Logo Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img 
          src={logo}
          alt="The Gift Oasis"
          className="w-64 h-64 md:w-96 md:h-96 object-contain opacity-10"
          style={{
            filter: 'blur(2px)',
          }}
        />
      </div>
      
      {/* Animated Gradient Overlay */}
      <div 
        className="absolute inset-0 animate-gradient"
        style={{ 
          background: 'linear-gradient(135deg, rgba(227, 79, 77, 0.95) 0%, rgba(75, 63, 59, 0.9) 50%, rgba(227, 79, 77, 0.95) 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 8s ease infinite'
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-64 h-64 bg-pink-400/30 rounded-full blur-3xl animate-pulse"
          style={{
            top: '10%',
            left: '10%',
            animation: 'pulse 4s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-amber-300/20 rounded-full blur-3xl animate-pulse"
          style={{
            bottom: '20%',
            right: '5%',
            animation: 'pulse 5s ease-in-out infinite 1s'
          }}
        />
        <div 
          className="absolute w-48 h-48 bg-white/20 rounded-full blur-2xl animate-pulse"
          style={{
            top: '50%',
            left: '50%',
            animation: 'pulse 6s ease-in-out infinite 2s'
          }}
        />
      </div>

      {/* Content with 3D Tilt Effect */}
      <div 
        className="relative z-10 flex flex-col items-center justify-center min-h-[500px] md:min-h-[600px] px-4 text-center"
        style={{
          transform: `perspective(1000px) rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        {/* Sparkle Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6 animate-bounce">
          <span className="text-2xl">✨</span>
          <span className="text-white font-medium text-sm">Premium Gift Collection</span>
          <span className="text-2xl">✨</span>
        </div>

        {/* Main Heading with Gradient Text */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 max-w-4xl leading-tight">
          <span className="text-white">Make Every Moment</span>
          <span 
            className="block mt-2 bg-clip-text text-transparent animate-gradient-text"
            style={{
              backgroundImage: 'linear-gradient(45deg, #ffd700, #ffb5c2, #ffd700)',
              backgroundSize: '200% 200%',
              animation: 'gradientText 3s ease infinite'
            }}
          >
            Extra Special
          </span>
        </h1>

        {/* Animated Subheading */}
        <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-8 animate-fade-in-up">
          Discover unique & personalized gifts that create lasting memories. 
          Perfect for birthdays, anniversaries, and celebrations.
        </p>

        {/* Glowing CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/shop"
            className="group relative px-8 py-4 bg-white text-[#e34f4d] font-bold rounded-full overflow-hidden transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:shadow-[0_0_50px_rgba(255,255,255,0.8)] transform hover:-translate-y-1"
          >
            <span className="relative z-10 flex items-center gap-2">
              Shop Now
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link
            to="/shop?category=Birthday"
            className="group px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
          >
            <span className="flex items-center gap-2">
              <span className="group-hover:rotate-12 transition-transform">🎁</span>
              Birthday Gifts
            </span>
          </Link>
        </div>


      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 md:h-20" preserveAspectRatio="none">
          <path 
            d="M0 30C240 50 480 10 720 30C960 50 1200 10 1440 30V60H0V30Z" 
            fill="#fce7f3"
          />
        </svg>
      </div>

      {/* Add CSS Animations */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes gradientText {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-100px) rotate(180deg); opacity: 0.8; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out;
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}

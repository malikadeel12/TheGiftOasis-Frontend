import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Clock, ArrowRight } from 'lucide-react';

export default function PromoBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set countdown target date (e.g., 7 days from now)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 7);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const padNumber = (num) => num.toString().padStart(2, '0');

  return (
    <div className="relative w-full overflow-hidden my-8">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1920")',
        }}
      />
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'linear-gradient(90deg, rgba(227, 79, 77, 0.95) 0%, rgba(180, 60, 58, 0.9) 50%, rgba(227, 79, 77, 0.95) 100%)'
        }}
      />

      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full"></div>
        <div className="absolute top-1/2 -right-16 w-48 h-48 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white/10 rounded-full"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-12 md:py-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
          <Gift className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-medium">Limited Time Offer</span>
        </div>
        
        {/* Main Heading */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
          Flash Sale
        </h2>
        
        {/* Subheading */}
        <p className="text-white/90 text-lg md:text-xl max-w-xl mb-8">
          Get up to 30% off on selected items. Don't miss out on these amazing deals!
        </p>
        
        {/* Countdown Timer */}
        <div className="flex gap-2 md:gap-4 mb-8">
          {[
            { value: timeLeft.days, label: 'Days' },
            { value: timeLeft.hours, label: 'Hours' },
            { value: timeLeft.minutes, label: 'Minutes' },
            { value: timeLeft.seconds, label: 'Seconds' }
          ].map((item, index) => (
            <div 
              key={index}
              className="text-center bg-white rounded-xl px-3 py-3 md:px-5 md:py-4 min-w-[70px] md:min-w-[90px] shadow-lg"
            >
              <span 
                className="block text-2xl md:text-3xl font-bold"
                style={{ color: '#e34f4d' }}
              >
                {padNumber(item.value)}
              </span>
              <span 
                className="block text-xs md:text-sm font-medium mt-1"
                style={{ color: '#666' }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
        
        {/* CTA Button */}
        <Link 
          to="/shop"
          className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-[#e34f4d] font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Shop Now
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Limited stock notice */}
        <p className="text-white/70 text-sm mt-4 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Offer ends soon!
        </p>
      </div>
    </div>
  );
}

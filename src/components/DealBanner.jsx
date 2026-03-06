import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Clock, ArrowRight, Sparkles } from 'lucide-react';
import api from '../services/api';

export default function DealBanner() {
  const [dealInfo, setDealInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const fetchDealInfo = async () => {
      try {
        const res = await api.get('/admin', { params: { limit: 100 } });
        const products = res.data.products || [];
        
        // Find products with active discounts
        const dealProducts = products.filter(p => 
          p.isDiscountActive && 
          p.discountPercentage > 0 && 
          (!p.discountExpiry || new Date(p.discountExpiry) > new Date())
        );
        
        if (dealProducts.length > 0) {
          // Get the nearest expiry date
          let nearestExpiry = null;
          dealProducts.forEach(p => {
            if (p.discountExpiry) {
              const expiry = new Date(p.discountExpiry);
              if (!nearestExpiry || expiry < nearestExpiry) {
                nearestExpiry = expiry;
              }
            }
          });
          
          // Calculate average discount
          const avgDiscount = Math.round(
            dealProducts.reduce((sum, p) => sum + (p.discountPercentage || 0), 0) / dealProducts.length
          );
          
          setDealInfo({
            productCount: dealProducts.length,
            avgDiscount,
            nearestExpiry: nearestExpiry,
            hasExpiry: !!nearestExpiry
          });
        }
      } catch (err) {
        console.error('Error fetching deal info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDealInfo();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!dealInfo?.nearestExpiry) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = new Date(dealInfo.nearestExpiry).getTime() - now;

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
  }, [dealInfo?.nearestExpiry]);

  const padNumber = (num) => num.toString().padStart(2, '0');

  if (loading || !dealInfo) return null;

  return (
    <div className="relative overflow-hidden my-6 mx-4 rounded-2xl">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1920")',
        }}
      />
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'linear-gradient(135deg, rgba(227, 79, 77, 0.95) 0%, rgba(180, 60, 58, 0.9) 100%)'
        }}
      />

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="absolute top-1/2 -right-8 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-white/10 rounded-full"></div>
        <Sparkles className="absolute top-4 left-1/4 w-6 h-6 text-white/30 animate-pulse" />
        <Sparkles className="absolute bottom-4 right-1/4 w-6 h-6 text-white/30 animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 py-6 md:px-10 md:py-8">
        {/* Left Side - Deal Info */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-3">
            <Tag className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">Limited Time Deal</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
            Up to {dealInfo.avgDiscount}% OFF
          </h2>
          
          <p className="text-white/90 text-lg">
            On {dealInfo.productCount} premium gifts
          </p>
        </div>

        {/* Right Side - Timer & CTA */}
        <div className="flex flex-col items-center">
          {dealInfo.hasExpiry && (
            <div className="flex gap-2 md:gap-3 mb-4">
              {[
                { value: timeLeft.days, label: 'Days' },
                { value: timeLeft.hours, label: 'Hours' },
                { value: timeLeft.minutes, label: 'Min' },
                { value: timeLeft.seconds, label: 'Sec' }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="text-center bg-white rounded-lg px-2 py-2 md:px-3 min-w-[50px] md:min-w-[65px] shadow-lg"
                >
                  <span className="block text-xl md:text-2xl font-bold" style={{ color: '#e34f4d' }}>
                    {padNumber(item.value)}
                  </span>
                  <span className="block text-[10px] md:text-xs font-medium" style={{ color: '#666' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          <Link 
            to="/shop"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-[#e34f4d] font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg"
          >
            Shop Deals
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const collectionImages = {
  '5 Senses': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600',
  'Cash Bouquets': 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600',
  'Chaand Raat': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600',
  'Chocolates': 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600',
  'Flowers': 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600',
  'Baby Boy': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600',
  'For Him': 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600',
  'Baby Girl': 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=600',
  'For Her': 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600',
  'Luxury': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600',
  'Anniversary': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600',
  'Birthday': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600',
};

const getCollectionImage = (name) => {
  const key = Object.keys(collectionImages).find(k => 
    name.toLowerCase().includes(k.toLowerCase())
  );
  return collectionImages[key] || 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600';
};

export default function CollectionsCarousel({ categories = [] }) {
  const scrollRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const displayCategories = categories.length > 0 ? categories.slice(0, 8) : [];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (displayCategories.length === 0) {
    return (
      <section className="pt-8 pb-16 px-4 relative overflow-hidden" style={{ backgroundColor: '#fce7f3' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p style={{ color: '#666' }}>Loading collections...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-8 pb-16 px-4 relative overflow-hidden" style={{ backgroundColor: '#fce7f3' }}>
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(227, 79, 77, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255, 181, 194, 0.1) 0%, transparent 50%)',
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Sparkle Effect */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-[#e34f4d] animate-pulse" />
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold"
              style={{ 
                background: 'linear-gradient(135deg, #e34f4d 0%, #4b3f3b 50%, #e34f4d 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradientShift 3s ease infinite'
              }}
            >
              Our Collections
            </h2>
            <Sparkles className="w-6 h-6 text-[#e34f4d] animate-pulse" />
          </div>
          <p 
            className="text-lg font-medium tracking-widest uppercase"
            style={{ color: '#4b3f3b' }}
          >
            THE GIFT OASIS
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons with Glow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 hover:shadow-[0_0_30px_rgba(227,79,77,0.5)]"
            style={{ 
              backgroundColor: '#ffffff', 
              color: '#e34f4d',
            }}
          >
            <ChevronLeft size={28} />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 hover:shadow-[0_0_30px_rgba(227,79,77,0.5)]"
            style={{ 
              backgroundColor: '#ffffff', 
              color: '#e34f4d',
            }}
          >
            <ChevronRight size={28} />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-16 py-8"
            style={{ 
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {displayCategories.map((category, index) => (
              <Link
                key={index}
                to={`/shop?category=${encodeURIComponent(category.name)}`}
                className="flex-shrink-0 w-72 group perspective-1000"
                style={{ scrollSnapAlign: 'center' }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div 
                  className="relative rounded-2xl overflow-hidden transition-all duration-500"
                  style={{ 
                    backgroundColor: '#ffffff',
                    transform: hoveredIndex === index ? 'rotateY(5deg) rotateX(5deg) scale(1.05)' : 'rotateY(0) rotateX(0) scale(1)',
                    transformStyle: 'preserve-3d',
                    boxShadow: hoveredIndex === index 
                      ? '0 25px 50px -12px rgba(227, 79, 77, 0.4), 0 0 30px rgba(227, 79, 77, 0.2)' 
                      : '0 10px 30px -10px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {/* Neon Border Effect */}
                  <div 
                    className="absolute inset-0 rounded-2xl transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(45deg, #e34f4d, #ffb5c2, #e34f4d)',
                      opacity: hoveredIndex === index ? 1 : 0,
                      padding: '3px',
                      zIndex: -1,
                    }}
                  />

                  {/* Image Container */}
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={category.image || getCollectionImage(category.name)}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700"
                      style={{
                        transform: hoveredIndex === index ? 'scale(1.1)' : 'scale(1)',
                      }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div 
                      className="absolute inset-0 transition-opacity duration-300"
                      style={{
                        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 100%)',
                        opacity: hoveredIndex === index ? 1 : 0.3,
                      }}
                    />

                    {/* Floating Sparkles on Hover */}
                    {hoveredIndex === index && (
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute text-yellow-400 animate-ping"
                            style={{
                              left: `${20 + i * 15}%`,
                              top: `${20 + (i % 3) * 20}%`,
                              animationDelay: `${i * 0.2}s`,
                              animationDuration: '1s',
                            }}
                          >
                            ✨
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Content with Glass Effect */}
                  <div className="absolute bottom-0 left-0 right-0 p-5"
                    style={{
                      background: 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <div className="text-center">
                      <h3 
                        className="font-bold text-lg mb-1 transition-colors"
                        style={{ 
                          color: hoveredIndex === index ? '#e34f4d' : '#1a1a1a',
                        }}
                      >
                        {category.name}
                      </h3>
                      
                      <p className="text-sm mb-3" style={{ color: '#666' }}>
                        {category.itemCount} Items
                      </p>
                      
                      <span 
                        className="inline-flex items-center gap-1 text-sm font-bold transition-all"
                        style={{ 
                          color: '#e34f4d',
                          transform: hoveredIndex === index ? 'translateX(5px)' : 'translateX(0)',
                        }}
                      >
                        Shop Now 
                        <span 
                          className="transition-transform"
                          style={{
                            transform: hoveredIndex === index ? 'translateX(5px)' : 'translateX(0)',
                          }}
                        >
                          →
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Item Count Badge */}
                  <div 
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white transition-all"
                    style={{
                      backgroundColor: '#e34f4d',
                      transform: hoveredIndex === index ? 'scale(1.1)' : 'scale(1)',
                      boxShadow: '0 4px 15px rgba(227, 79, 77, 0.4)',
                    }}
                  >
                    {category.itemCount} items
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Decorative Line */}
        <div className="flex justify-center mt-12">
          <div 
            className="h-1 w-32 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, #e34f4d, transparent)',
            }}
          />
        </div>
      </div>

      {/* Add CSS */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

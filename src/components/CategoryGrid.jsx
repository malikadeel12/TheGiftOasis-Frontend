import { Link } from 'react-router-dom';

const categoryImages = {
  'Cash Bouquets': 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600',
  'Makeup & Skincare': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600',
  'Chocolates': 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600',
  'Flowers': 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600',
  'For Him': 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600',
  'For Her': 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600',
  'Baby': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600',
  'Anniversary': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600',
  'Birthday': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600',
};

const getCategoryImage = (name) => {
  const key = Object.keys(categoryImages).find(k => 
    name.toLowerCase().includes(k.toLowerCase())
  );
  return categoryImages[key] || 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600';
};

export default function CategoryGrid({ categories = [] }) {
  // Use provided categories or show message if loading
  const displayCategories = categories.length > 0 ? categories.slice(0, 6) : [];

  // Always show section if we have categories or we're loading
  if (displayCategories.length === 0) {
    return (
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <div className="text-center">
          <p style={{ color: '#666' }}>Loading categories...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto">
      <div 
        className="grid gap-4 md:gap-6"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
        }}
      >
        {displayCategories.map((category, index) => (
          <Link
            key={index}
            to={`/shop?category=${encodeURIComponent(category.name)}`}
            className="group relative rounded-2xl overflow-hidden cursor-pointer collection-card-hover"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid transparent'
            }}
          >
            {/* Highlight Border Animation */}
            <div 
              className="absolute -inset-0.5 rounded-[18px] opacity-0 group-hover:opacity-100 transition-opacity -z-10 animate-highlight"
              style={{
                background: 'linear-gradient(45deg, #fbabaa, #ffb5c2, #fbabaa, #fbabaa)'
              }}
            />

            {/* Image Container */}
            <div className="relative h-52 md:h-64 overflow-hidden">
              <img
                src={category.image || getCategoryImage(category.name)}
                alt={category.name}
                className="w-full h-full object-cover collection-image"
              />
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.2) 100%)'
                }}
              />
            </div>

            {/* Content */}
            <div className="p-4 text-center">
              <h3 
                className="text-base md:text-lg font-medium mb-2 transition-colors group-hover:text-[#4b3f3b]"
                style={{ color: '#e34f4d' }}
              >
                {category.name}
              </h3>
              
              <p className="text-xs mb-3" style={{ color: '#999' }}>
                {category.itemCount} Items
              </p>
              
              <span 
                className="inline-block px-6 py-2.5 rounded-2xl text-sm font-medium transition-all"
                style={{
                  backgroundColor: '#e34f4d',
                  color: '#ffffff',
                  border: '1px solid #e34f4d'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#4b3f3b';
                  e.target.style.borderColor = '#4b3f3b';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#e34f4d';
                  e.target.style.borderColor = '#e34f4d';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Shop Now
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

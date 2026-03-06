import { Instagram, Heart } from "lucide-react";

const instagramImages = [
  "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=400",
  "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400",
  "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400",
  "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
  "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400"
];

export default function InstagramGallery() {
  return (
    <section className="py-16 px-4 bg-pink-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-[#e34f4d] mb-2">
            <Instagram className="w-5 h-5" />
            <span className="text-sm font-medium">Follow Us</span>
          </div>
          <h2 
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: '#1a1a1a' }}
          >
            @TheGiftOasis
          </h2>
          <p className="text-gray-500">
            Tag us to be featured!
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
          {instagramImages.map((img, index) => (
            <div 
              key={index}
              className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
            >
              <img
                src={img}
                alt={`Instagram ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                  <Heart className="w-8 h-8" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#e34f4d] text-white rounded-full font-medium hover:bg-[#c94543] transition-colors"
          >
            <Instagram className="w-5 h-5" />
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

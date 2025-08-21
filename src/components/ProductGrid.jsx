// src/components/ProductCarousel.jsx
import React, { useRef } from "react";

const handmadeProducts = [
  { id: 1, name: "Polaroids", image: "https://tse4.mm.bing.net/th/id/OIP.CnwHDnmN8IXy_JSYgwUHZwHaJ4?pid=Api&P=0&h=220" },
  { id: 2, name: "Frames", image: "https://cdn.framebridge.com/production/art_type_tiles/6/backgrounds/original/Quick-Ship_Preview_Desktop.jpg?1659539599" },
  { id: 3, name: "Midnight Surprise", image: "https://tse2.mm.bing.net/th/id/OIP.MywjVbT7_u9fJdszBE-zBAAAAA?pid=Api&P=0&h=220" },
  { id: 4, name: "Acrylic Boxes", image: "http://www.shoppopdisplays.com/mm5/graphics/00000001/5SideBoxCatImage.jpg" },
  { id: 5, name: "Eid Collection", image: "https://tse4.mm.bing.net/th/id/OIP.uX_ATCHySd60QMXNJAxl8wHaJ4?pid=Api&P=0&h=220" },
  { id: 6, name: "Gift Boxes", image: "https://tse1.mm.bing.net/th/id/OIP.vzNcJBmQBjx_jxIKRc0r6QHaF-?pid=Api&P=0&h=220" },
  { id: 7, name: "Bouquets", image: "https://www.elegantweddinginvites.com/wedding-blog/wp-content/uploads/2018/08/dusty-rose-vintage-wedding-bouquets-ideas.jpg" },
];

const ProductCarousel = () => {
  const carouselRef = useRef(null);

  return (
    <section className="py-14 bg-gradient-to-b from-pink-50 via-white to-pink-50 relative">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            🌸 Handmade With Love 🌸
          </h2>
          <p className="text-gray-600 text-lg">
            Every product here is crafted by hand, made to order, and sprinkled with love.
          </p>
        </div>

        {/* Swipeable Products Row */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing"
        >
          {handmadeProducts.map((product) => (
            <div
              key={product.id}
              className="min-w-[250px] bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="relative w-full h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;

import { Truck, ShieldCheck, RotateCcw, Heart, Gift, Star } from "lucide-react";

export default function FeatureBoxes() {
  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "All Pakistan Delivery",
      description: "Delivery to all major cities",
      color: "#e34f4d"
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "100% Original",
      description: "Authentic branded products",
      color: "#4b3f3b"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Quality Guaranteed",
      description: "Best quality for your loved ones",
      color: "#e34f4d"
    },
    {
      icon: <RotateCcw className="w-8 h-8" />,
      title: "Easy Returns",
      description: "Hassle-free return policy",
      color: "#4b3f3b"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Personalized Gifts",
      description: "Customized with love",
      color: "#e34f4d"
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Gift Wrapping",
      description: "Beautiful presentation",
      color: "#4b3f3b"
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group text-center p-4 md:p-6 rounded-2xl hover:bg-pink-50 transition-all duration-300"
            >
              <div 
                className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 transition-transform group-hover:scale-110"
                style={{ 
                  backgroundColor: `${feature.color}15`,
                  color: feature.color
                }}
              >
                {feature.icon}
              </div>
              <h3 
                className="font-semibold text-sm md:text-base mb-1"
                style={{ color: '#1a1a1a' }}
              >
                {feature.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

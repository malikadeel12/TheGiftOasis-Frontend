import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Ahmed",
    location: "Lahore",
    rating: 5,
    text: "Absolutely loved the personalized gift basket I ordered! The quality was amazing and delivery was on time. Will definitely order again!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
  },
  {
    name: "Ali Khan",
    location: "Karachi",
    rating: 5,
    text: "Best gift shop in Pakistan! The customization options are great and the team is very helpful. My wife loved her anniversary gift!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
  },
  {
    name: "Fatima Rashid",
    location: "Islamabad",
    rating: 5,
    text: "Amazing service and beautiful products. The packaging was exquisite and made my sister's birthday truly special. Highly recommended!",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"
  }
];

export default function Testimonials() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: '#1a1a1a' }}
          >
            What Our Customers Say
          </h2>
          <p className="text-gray-500">
            Don't just take our word for it
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="relative bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-pink-100"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-6">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#e34f4d' }}
                >
                  <Quote className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array(testimonial.rating).fill(0).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 
                    className="font-semibold"
                    style={{ color: '#1a1a1a' }}
                  >
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

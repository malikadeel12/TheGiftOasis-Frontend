import { Mail } from "lucide-react";

export default function Newsletter() {
  return (
    <section 
      className="py-16 px-4"
      style={{ backgroundColor: '#fbe8ec' }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: '#e34f4d' }}>
          <Mail className="w-6 h-6 text-white" />
        </div>
        <h2 
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: '#1a1a1a' }}
        >
          Subscribe to Our Newsletter
        </h2>
        <p className="text-gray-600 mb-6">
          Get the latest updates on new products and upcoming sales
        </p>
        
        <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 px-6 py-3 rounded-full border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[#e34f4d] focus:border-transparent"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-[#e34f4d] text-white font-semibold rounded-full hover:bg-[#c94543] transition-colors shadow-lg"
          >
            Subscribe
          </button>
        </form>
        
        <p className="text-xs text-gray-500 mt-4">
          By subscribing, you agree to our Privacy Policy and Terms of Service
        </p>
      </div>
    </section>
  );
}

export default function WelcomeBanner() {
  return (
    <div 
      className="relative py-12 md:py-16 text-center overflow-hidden"
      style={{ 
        backgroundColor: '#ffd5d8',
        borderBottom: '1px solid #eeeeee'
      }}
    >
      {/* Floating Icons */}
      <div 
        className="absolute top-[15%] left-[8%] text-2xl md:text-3xl opacity-70 animate-float"
        style={{ animationDelay: '0s' }}
      >
        🎁
      </div>
      <div 
        className="absolute top-[25%] right-[12%] text-xl md:text-2xl opacity-60 animate-float"
        style={{ animationDelay: '1s' }}
      >
        💐
      </div>
      <div 
        className="absolute bottom-[30%] left-[12%] text-lg md:text-xl opacity-80 animate-float"
        style={{ animationDelay: '2s' }}
      >
        🍫
      </div>
      <div 
        className="absolute bottom-[20%] right-[8%] text-xl md:text-2xl opacity-70 animate-float"
        style={{ animationDelay: '0.5s' }}
      >
        🎀
      </div>
      <div 
        className="absolute top-[60%] left-[5%] text-base md:text-lg opacity-50 animate-float"
        style={{ animationDelay: '1.5s' }}
      >
        ✨
      </div>
      <div 
        className="absolute top-[45%] right-[5%] text-lg md:text-xl opacity-60 animate-float"
        style={{ animationDelay: '2.5s' }}
      >
        ❤️
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4">
        <h1 
          className="heading-responsive font-semibold mb-3"
          style={{ color: '#333' }}
        >
          Welcome to The Gift Oasis
        </h1>
        <p 
          className="text-base md:text-lg max-w-2xl mx-auto"
          style={{ color: '#666' }}
        >
          Your Premier Destination for Customized Gifts & Luxury Hampers
        </p>
      </div>
    </div>
  );
}

import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const phone = "923295108102"; 
  const message = "Hi TheGiftOasis 👋 I want to know more about your gifts!";
  const encodedMessage = encodeURIComponent(message);

  // device detection
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const link = isMobile
    ? `https://wa.me/${phone}?text=${encodedMessage}`
    : `https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;

  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-2 z-50">
      {/* Bubble Text */}
      <div className="bg-white px-3 py-1 rounded-full shadow-md border text-pink-600 font-medium hidden md:block animate-bounce">
        Chat with us
      </div>

      {/* WhatsApp Button */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:scale-110 transition-transform"
      >
        <FaWhatsapp size={28} />

        {/* Glowing Pulse Effect */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
      </a>
    </div>
  );
}

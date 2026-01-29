// src/components/ImageZoom.jsx
import { useState, useRef } from "react";

export default function ImageZoom({ src, alt, className = "" }) {
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => setShowZoom(true);
  const handleMouseLeave = () => setShowZoom(false);

  return (
    <div className="relative">
      {/* Main Image */}
      <div
        ref={imageRef}
        className={`relative overflow-hidden cursor-crosshair ${className}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain"
        />
        
        {/* Zoom Indicator */}
        {showZoom && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
            Hover to zoom
          </div>
        )}
      </div>

      {/* Zoom Lens */}
      {showZoom && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full overflow-hidden"
            onClick={() => setShowZoom(false)}
          >
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-contain"
              style={{
                transform: `scale(2)`,
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />
            <button
              onClick={() => setShowZoom(false)}
              className="absolute top-4 right-4 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center text-2xl hover:bg-gray-200 transition"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Alternative: Magnifying glass style zoom
export function MagnifierZoom({ src, alt, zoomLevel = 2.5 }) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    setCursorPosition({ x, y });
    setMagnifierPosition({
      x: (x / width) * 100,
      y: (y / height) * 100,
    });
  };

  return (
    <div className="relative">
      <div
        ref={imageRef}
        className="relative cursor-none"
        onMouseEnter={() => setShowMagnifier(true)}
        onMouseLeave={() => setShowMagnifier(false)}
        onMouseMove={handleMouseMove}
      >
        <img src={src} alt={alt} className="w-full h-full object-contain" />
        
        {/* Magnifier */}
        {showMagnifier && (
          <div
            className="absolute w-32 h-32 rounded-full border-4 border-white shadow-xl pointer-events-none overflow-hidden bg-white"
            style={{
              left: cursorPosition.x - 64,
              top: cursorPosition.y - 64,
              backgroundImage: `url(${src})`,
              backgroundSize: `${zoomLevel * 100}%`,
              backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
              backgroundRepeat: "no-repeat",
            }}
          />
        )}
      </div>
    </div>
  );
}

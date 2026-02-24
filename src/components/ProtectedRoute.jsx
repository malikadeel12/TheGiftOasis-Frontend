import { jwtDecode } from "jwt-decode";
import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Small delay to ensure router context is fully initialized
    const timer = setTimeout(() => setIsReady(true), 0);
    return () => clearTimeout(timer);
  }, []);
  
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }
  
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;

  try {
    const decoded = jwtDecode(token);
    if (requireAdmin && decoded.role !== "admin") return <Navigate to="/" replace />;
    return children;
  } catch {
    return <Navigate to="/login" replace />;
  }
}

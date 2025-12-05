import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);
    if (requireAdmin && decoded.role !== "admin") return <Navigate to="/" replace />;
    return children;
  } catch {
    return <Navigate to="/login" replace />;
  }
}

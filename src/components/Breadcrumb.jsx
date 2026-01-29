// src/components/Breadcrumb.jsx
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Don't show breadcrumb on home page
  if (location.pathname === "/") return null;

  const routeNames = {
    shop: "Shop",
    products: "Product Details",
    cart: "Shopping Cart",
    checkout: "Checkout",
    "order-success": "Order Success",
    "my-orders": "My Orders",
    login: "Login",
    register: "Register",
    admin: "Admin Dashboard",
    blog: "Blog",
    "blog-post": "Blog Post",
  };

  return (
    <nav className="bg-pink-50/80 border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3">
        <ol className="flex items-center flex-wrap gap-2 text-sm">
          <li>
            <Link
              to="/"
              className="flex items-center gap-1 text-pink-600 hover:text-pink-800 transition"
            >
              <Home size={16} />
              <span>Home</span>
            </Link>
          </li>

          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            const displayName = routeNames[name] || name.replace(/-/g, " ");

            return (
              <li key={name} className="flex items-center gap-2">
                <ChevronRight size={16} className="text-pink-400" />
                {isLast ? (
                  <span className="text-gray-600 font-medium capitalize">
                    {displayName}
                  </span>
                ) : (
                  <Link
                    to={routeTo}
                    className="text-pink-600 hover:text-pink-800 transition capitalize"
                  >
                    {displayName}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

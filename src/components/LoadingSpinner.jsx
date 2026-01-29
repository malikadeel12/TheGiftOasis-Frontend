// src/components/LoadingSpinner.jsx
export default function LoadingSpinner({ size = "md", color = "pink" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const colorClasses = {
    pink: "border-pink-500",
    white: "border-white",
    gray: "border-gray-500",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-4 border-t-transparent ${colorClasses[color]} rounded-full animate-spin`}
      ></div>
    </div>
  );
}

// Button with loading state
export function LoadingButton({
  children,
  loading = false,
  loadingText = "Loading...",
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      disabled={loading || disabled}
      className={`relative ${className} ${loading || disabled ? "opacity-70 cursor-not-allowed" : ""}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <LoadingSpinner size="sm" color={className.includes("bg-white") ? "pink" : "white"} />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}

// Skeleton loader for cards
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 animate-pulse">
      <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
}

// Page loader
export function PageLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-pink-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}

// Skeleton grid
export function SkeletonGrid({ count = 4 }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <SkeletonCard key={i} />
        ))}
    </div>
  );
}

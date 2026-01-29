// src/components/OrderTimeline.jsx
import { 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  Home, 
  XCircle,
  Loader2
} from "lucide-react";

const statusConfig = {
  pending: {
    label: "Order Placed",
    description: "Your order has been received",
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-500",
  },
  confirmed: {
    label: "Order Confirmed",
    description: "Payment verified, order confirmed",
    icon: CheckCircle2,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500",
  },
  processing: {
    label: "Processing",
    description: "Preparing your items",
    icon: Package,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-500",
  },
  dispatched: {
    label: "Dispatched",
    description: "Order shipped, on the way",
    icon: Truck,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-500",
  },
  delivered: {
    label: "Delivered",
    description: "Order delivered successfully",
    icon: Home,
    color: "text-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-500",
  },
  cancelled: {
    label: "Cancelled",
    description: "Order has been cancelled",
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-500",
  },
};

const statusOrder = ["pending", "confirmed", "processing", "dispatched", "delivered"];

export default function OrderTimeline({ status, updatedAt }) {
  const currentStatusIndex = statusOrder.indexOf(status);
  const isCancelled = status === "cancelled";

  if (isCancelled) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-700">Order Cancelled</h3>
            <p className="text-red-600">This order has been cancelled</p>
            {updatedAt && (
              <p className="text-sm text-red-500 mt-1">
                Updated: {new Date(updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Order Status</h3>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-200 hidden md:block">
          <div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-pink-500 to-green-500 transition-all duration-500"
            style={{
              height: `${Math.max(0, (currentStatusIndex / (statusOrder.length - 1)) * 100)}%`,
            }}
          />
        </div>

        {/* Status Steps */}
        <div className="space-y-6">
          {statusOrder.map((stepStatus, index) => {
            const config = statusConfig[stepStatus];
            const Icon = config.icon;
            const isActive = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;

            return (
              <div
                key={stepStatus}
                className={`relative flex items-start gap-4 transition-all duration-300 ${
                  isActive ? "opacity-100" : "opacity-40"
                }`}
              >
                {/* Icon */}
                <div
                  className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isCurrent
                      ? `${config.bgColor} ${config.borderColor} border-2 ring-4 ring-opacity-30 ${config.bgColor.replace("bg-", "ring-")}`
                      : isActive
                      ? `${config.bgColor} ${config.borderColor} border-2`
                      : "bg-gray-100 border-2 border-gray-300"
                  }`}
                >
                  {isCurrent ? (
                    <Loader2 className={`w-7 h-7 ${config.color} animate-spin`} />
                  ) : (
                    <Icon className={`w-7 h-7 ${isActive ? config.color : "text-gray-400"}`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <h4
                      className={`font-bold text-lg ${
                        isActive ? "text-gray-800" : "text-gray-400"
                      }`}
                    >
                      {config.label}
                    </h4>
                    {isCurrent && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}>
                        Current
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      isActive ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {config.description}
                  </p>
                  {isCurrent && updatedAt && (
                    <p className={`text-xs mt-1 ${config.color}`}>
                      Last updated: {new Date(updatedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="mt-6 md:hidden">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-green-500 transition-all duration-500"
            style={{
              width: `${Math.max(0, (currentStatusIndex / (statusOrder.length - 1)) * 100)}%`,
            }}
          />
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">
          Step {currentStatusIndex + 1} of {statusOrder.length}
        </p>
      </div>
    </div>
  );
}

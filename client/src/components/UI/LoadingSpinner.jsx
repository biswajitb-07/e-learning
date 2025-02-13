import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Animated Spinner */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-green-600 border-r-green-600 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>

      {/* Loading Text */}
      <p className="mt-4 text-base sm:text-lg md:text-xl font-semibold text-gray-700 animate-pulse">
        Loading, please wait...
      </p>

      {/* Optional: Subtle Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-purple-100 to-blue-100 opacity-30 animate-rotate-background"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

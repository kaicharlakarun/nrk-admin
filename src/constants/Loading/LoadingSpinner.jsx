import React from "react";

const LoadingSpinner = ({ text = "Loading...", color = "#4caf51" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      {/* Spinner */}
      <svg
        className="animate-spin h-10 w-10 mb-2"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill={color}
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>

      {/* Loading text */}
      <p className="text-lg font-medium" style={{ color }}>
        {text}
      </p>
    </div>
  );
};

export default LoadingSpinner;

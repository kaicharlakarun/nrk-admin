import React from "react";

const StatsCards = ({ trips }) => {
  const totalTrips = trips.length;
  const totalTripAmount = trips.reduce((sum, trip) => sum + (trip.tripAmount || 0), 0);
  const totalExpenses = trips.reduce((sum, trip) => sum + (trip.totalExpenses || 0), 0);
  const profit = totalTripAmount - totalExpenses;

  // Format numbers with commas
  const formatNumber = (num) => {
    if (typeof num !== "number") return num;
    return num.toLocaleString("en-IN");
  };

  const DashboardCards = [
    { 
      title: "Total Trips", 
      value: formatNumber(totalTrips), 
      bg: "bg-gradient-to-r from-indigo-500 to-purple-500" 
    },
    { 
      title: "Total Trip Amount", 
      value: `₹${formatNumber(totalTripAmount)}`, 
      bg: "bg-gradient-to-r from-green-700 to-green-700" 
    },
    { 
      title: "Total Expenses", 
      value: `₹${formatNumber(totalExpenses)}`, 
      bg: "bg-gradient-to-r from-yellow-400 to-yellow-600" 
    },
    { 
      title: "Profit", 
      value: `₹${formatNumber(profit)}`, 
      bg: profit >= 0 
        ? "bg-gradient-to-r from-green-700 to-green-700" 
        : "bg-gradient-to-r from-red-400 to-red-600" 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 w-full">
      {DashboardCards.map((card, index) => (
        <div
          key={index}
          className={`p-6 rounded-xl shadow-lg hover:scale-105 transform transition-all duration-300 text-white ${card.bg}`}
        >
          <h3 className="text-sm font-semibold uppercase tracking-wide">{card.title}</h3>
          <p
            className={`mt-2 text-2xl font-bold break-words ${
              card.title === "Profit" && profit < 0 ? "text-red-100" : "text-white"
            }`}
          >
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;

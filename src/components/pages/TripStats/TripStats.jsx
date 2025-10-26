import React, { useState, useEffect } from "react";
import BASE_URL from "../../../constants/constants";
import LoadingSpinner from "../../../constants/Loading/LoadingSpinner";

const TripStats = () => {
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalTripAmount: 0,
    totalExpenses: 0,
    totalProfit: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/trips/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch stats");

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // ✅ format numbers with commas
  const formatNumber = (num) => {
    if (typeof num !== "number") return num;
    return num.toLocaleString("en-IN");
  };

  const DashboardCards = [
    { title: "Total Trips", value: formatNumber(stats.totalTrips), bg: "bg-gradient-to-r from-indigo-500 to-purple-500" },

    { title: "Total Trip Amount", value: `₹${formatNumber(stats.totalTripAmount)}`, bg: "bg-green-700" },

    { title: "Total Expenses", value: `₹${formatNumber(stats.totalExpenses)}`, bg: "bg-gradient-to-r from-yellow-400 to-yellow-600" },
    { 
      title: "Profit", 
      value: `₹${formatNumber(stats.totalProfit)}`, 
      bg: stats.totalProfit >= 0 
        ? "bg-green-700" 
        : "bg-gradient-to-r from-red-400 to-red-600" 
    },
  ];
  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 w-full">
      {loading ? (
        <div className="col-span-full">
          <LoadingSpinner text="Loading stats..." />
        </div>
      ) : (
        DashboardCards.map((card, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-lg hover:scale-105 transform transition-all duration-300 text-white ${card.bg}`}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wide">{card.title}</h3>
            <p
              className={`mt-2 text-2xl font-bold break-words ${
                card.title === "Profit" && stats.totalProfit < 0 ? "text-red-100" : "text-white"
              }`}
            >
              {card.value}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default TripStats;

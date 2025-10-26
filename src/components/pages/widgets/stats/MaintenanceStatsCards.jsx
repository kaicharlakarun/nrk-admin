import React from "react";

const MaintenanceStatsCards = ({ maintenances }) => {
  const totalMaintenances = maintenances.length;
  const totalMaintenanceCost = maintenances.reduce(
    (sum, m) => sum + (parseFloat(m.maintenanceCost) || 0),
    0
  );

  // Format numbers with commas
  const formatNumber = (num) => {
    if (typeof num !== "number") return num;
    return num.toLocaleString("en-IN");
  };

  const DashboardCards = [
    { title: "Total Maintenances", value: formatNumber(totalMaintenances), bg: "bg-gradient-to-r from-indigo-500 to-purple-500" },
    { title: "Total Maintenance Cost", value: `₹${formatNumber(totalMaintenanceCost)}`, bg: "bg-gradient-to-r from-green-700 to-green-700" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 w-full">
      {DashboardCards.map((card, index) => (
        <div
          key={index}
          className={`p-6 rounded-xl shadow-lg hover:scale-105 transform transition-all duration-300 text-white ${card.bg}`}
        >
          <h3 className="text-sm font-semibold uppercase tracking-wide">{card.title}</h3>
          <p className="mt-2 text-2xl font-bold break-words">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default MaintenanceStatsCards;

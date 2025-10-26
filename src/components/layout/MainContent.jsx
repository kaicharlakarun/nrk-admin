import React from "react";
import Dashboard from "../pages/Dashboard";
import Trips from "../pages/Trips";
import Drivers from "../pages/Drivers";
import Vehicles from "../pages/Vehicles";
import Reports from "../pages/Reports"
import Maintenance from "../pages/Maintenace";
import Ads from "../pages/Ads";

const MainContent = ({ activePage,adminToken }) => {
  return (
    <main className="flex-1 p-6 overflow-auto bg-white">
      {activePage === "Dashboard" && <Dashboard />}
      {activePage === "Trips" && <Trips />}
      {activePage === "Drivers" && <Drivers adminToken={adminToken} />}
      {activePage === "Vehicles" && <Vehicles />}
      {activePage === "Maintenance" && <Maintenance />}
      {activePage === "Reports" && <Reports />}
      {activePage === "Ads" && <Ads />}
    </main>
  );
};

export default MainContent;

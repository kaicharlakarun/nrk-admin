import React from "react";
import Dashboard from "../../pages/driver-pages/Dashboard/Dashboard";
import Trips from "../../pages/driver-pages/trips/Trips";
import Maintenance from "../../pages/Maintenace";



const DriverMainContent = ({activePage}) => {
  return (
    <main className="flex-1 p-6 overflow-auto bg-white">
      {activePage === "Dashboard" && <Dashboard />}
      {activePage === "Trips" && <Trips />}
      {activePage === "Maintenance" && <Maintenance />}
    </main>
  );
};

export default DriverMainContent;

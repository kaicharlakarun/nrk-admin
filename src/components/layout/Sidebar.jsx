import React from "react";
import { Zap, LayoutDashboard, User, Wrench, Car, Map,BarChart3,Megaphone } from "lucide-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen, activePage, setActivePage }) => {
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard className="w-5 h-5 mr-3" /> },
    { name: "Trips", icon: <Map className="w-5 h-5 mr-3" /> },
    { name: "Maintenance", icon: <Wrench className="w-5 h-5 mr-3" /> },
    { name: "Drivers", icon: <User className="w-5 h-5 mr-3" /> },
    { name: "Vehicles", icon: <Car className="w-5 h-5 mr-3" /> },
    { name: "Reports", icon: <BarChart3 className="w-5 h-5 mr-3" /> },
    { name: "Ads", icon: <Megaphone className="w-5 h-5 mr-3" /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-20 transition-opacity lg:hidden ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white border-r border-green-100 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-6 border-b border-green-100">
        <div className="flex items-center space-x-3">
  {/* Logo box */}
  <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-white">
    <img
      src="https://nrktravels.com/uploads/0000/6/2025/03/07/nrktravel-logo.png"
      alt="NRK Travels Logo"
      className="w-8 h-8 object-contain"
    />
  </div>

  {/* Text */}
  <div>
    <h1 className="text-xl font-bold text-green-700">NRK Travels</h1>
    <p className="text-xs text-green-700">Admin Panel</p>
  </div>
</div>


          <button
            className="lg:hidden text-green-500"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                activePage === item.name
                  ? "bg-green-700 text-white" // selected state: green background + white text
                  : "text-green-700 hover:bg-green-700 hover:text-white" // unselected: green text + hover effect
              }`}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

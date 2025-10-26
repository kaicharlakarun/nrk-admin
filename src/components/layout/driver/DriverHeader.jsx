import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DriverHeader = ({ setSidebarOpen }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch stored username (saved during login)
    const name = localStorage.getItem("name") || "Driver";
    setUserName(name);
  }, []);

  const handleSignOut = () => {
    // Clear login data
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("userId");

    // Redirect to login
    navigate("/login");
  };

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-green-100 bg-white sticky top-0 z-10">
        
        {/* Left: Sidebar toggle & greeting */}
        <div className="flex items-center gap-2">
          <button
            className="lg:hidden text-green-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Greeting */}
          <h1 className="text-sm sm:text-base md:text-lg font-semibold text-gray-700">
            Hello, <span className="text-green-600">{userName} 👋</span>
          </h1>
        </div>

        {/* Right: Sign Out button */}
        <div className="flex items-center">
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 rounded border border-green-500 text-green-500 bg-white hover:bg-green-500 hover:text-white transition-colors duration-300"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md transform transition-all">
            <h2 className="text-lg font-semibold text-gray-800 text-center">
              Are you sure you want to sign out?
            </h2>
            <p className="mt-2 text-sm text-gray-500 text-center">
              You will need to log in again to access the dashboard.
            </p>

            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DriverHeader;

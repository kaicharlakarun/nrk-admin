import React, { useState, useEffect } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import MainContent from "./components/layout/MainContent";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/pages/login/Login.jsx";
import DriverSidebar from "./components/layout/driver/DriverSidebar.jsx";
import DriverHeader from "./components/layout/driver/DriverHeader.jsx";
import DriverMainContent from "./components/layout/driver/DriverMainContent.jsx";

// ✅ Toastify imports
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");

  // Initialize role from localStorage to persist state on reload
  const [role, setRole] = useState(() => localStorage.getItem("role"));

  // Optional: watch localStorage changes (if multiple tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <>
      {/* ✅ Global Toast Container (works everywhere) */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />

      <Routes>
        {/* Login Page */}
        <Route path="/login" element={<Login setRole={setRole} />} />

        {/* Protected Admin Layout */}
        <Route
          path="/"
          element={
            role === "admin" ? (
              <div className="min-h-screen flex bg-white transition-all duration-500">
                <Sidebar
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                  activePage={activePage}
                  setActivePage={setActivePage}
                />
                <div className="flex flex-col flex-1 min-h-screen overflow-hidden lg:ml-64">
                  <Header setSidebarOpen={setSidebarOpen} />
                  <MainContent activePage={activePage} />
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected Driver Layout */}
        <Route
          path="/driver"
          element={
            role === "driver" ? (
              <div className="min-h-screen flex bg-white transition-all duration-500">
                <DriverSidebar
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                  activePage={activePage}
                  setActivePage={setActivePage}
                />
                <div className="flex flex-col flex-1 min-h-screen overflow-hidden lg:ml-64">
                  <DriverHeader setSidebarOpen={setSidebarOpen} />
                  <DriverMainContent activePage={activePage} />
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;

import React, { useEffect, useState, useRef } from "react";
import BASE_URL from "../../../../../constants/constants";

const DriverSection = ({ formData, handleChange }) => {
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const role = (localStorage.getItem("role") || "").toLowerCase(); // ✅ normalize role
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const token = localStorage.getItem("token");

        if (role === "admin") {
          // ✅ Admin: fetch all drivers
          const res = await fetch(`${BASE_URL}/api/drivers`, {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
          });
          if (!res.ok) throw new Error("Failed to fetch drivers");
          const data = await res.json();
          setDrivers(data.drivers || []);
        } else if (role === "driver") {
          // ✅ Driver: fetch own details
          const res = await fetch(`${BASE_URL}/api/drivers/me`, {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
          });
          if (!res.ok) throw new Error("Failed to fetch driver");
          const data = await res.json();

          console.log("Fetched driver response:", data); // 🔍 debug

          const driver = data.driver || data; // ✅ handle both {driver:{}} and {}
          if (driver?._id) {
            handleChange({ target: { name: "driverId", value: driver._id } });
            handleChange({ target: { name: "driverName", value: driver.name } });
            handleChange({
              target: { name: "driverNumber", value: driver.phone || "" },
            });
          }
        }
      } catch (err) {
        console.error("Error fetching drivers:", err.message);
      }
    };

    fetchDrivers();
  }, [role, userId, handleChange]);

  const filteredDrivers = drivers.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (driver) => {
    handleChange({ target: { name: "driverId", value: driver._id } });
    handleChange({ target: { name: "driverName", value: driver.name } });
    handleChange({ target: { name: "driverNumber", value: driver.phone || "" } });
    setIsOpen(false);
    setSearchTerm("");
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Render differently for admin vs driver
  if (role === "driver") {
    return (
      <div className="relative">
        <label className="text-sm font-medium mb-1 block">Driver</label>
        <div className="border rounded px-3 py-2 bg-gray-100 cursor-not-allowed">
          {formData.driverName || "Loading..."}{" "}
          {formData.driverNumber && `(${formData.driverNumber})`}
        </div>
      </div>
    );
  }

  // ✅ Admin dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-sm font-medium mb-1 block">Select Driver</label>
      <div
  tabIndex={0} // ✅ make it focusable
  className="p-2 border border-gray-300 rounded-md w-full 
             focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none 
             bg-white cursor-pointer flex justify-between items-center"
  onClick={() => setIsOpen(!isOpen)}
>
  {formData.driverId ? (
    <>
      {formData.driverName}
      {formData.driverNumber ? ` (${formData.driverNumber})` : ""}
    </>
  ) : (
    "Select Driver..."
  )}
  <span className="ml-2">&#9662;</span>
</div>


      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-auto">
          <input
            type="text"
            placeholder="Search driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border-b focus:outline-none"
          />
          {filteredDrivers.length > 0 ? (
            filteredDrivers.map((d) => (
              <div
                key={d._id}
                onClick={() => handleSelect(d)}
                className="px-3 py-2 hover:bg-green-100 cursor-pointer"
              >
                {d.name} {d.phone ? `(${d.phone})` : ""}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500">No drivers found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DriverSection;

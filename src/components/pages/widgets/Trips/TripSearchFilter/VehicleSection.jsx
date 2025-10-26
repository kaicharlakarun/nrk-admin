import React, { useEffect, useState, useRef } from "react";
import BASE_URL from "../../../../../constants/constants";

const VehicleSection = ({ formData, handleChange }) => {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/vehicles`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });

        if (!res.ok) throw new Error("Failed to fetch vehicles");
        const data = await res.json();
        setVehicles(data || []);
      } catch (err) {
        console.error("Error fetching vehicles:", err.message);
      }
    };
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter((v) =>
    v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (vehicle) => {
    handleChange({ target: { name: "vehicleId", value: vehicle._id } });
    handleChange({
      target: { name: "vehicleNumber", value: vehicle.vehicleNumber },
    });
    handleChange({
      target: { name: "vehicleType", value: vehicle.vehicleType },
    });
    setIsOpen(false);
    setSearchTerm("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-sm font-medium mb-1 block">Select Vehicle</label>
      <div
        tabIndex={0} // ✅ make it focusable
        className="p-2 border border-gray-300 rounded-md w-full 
                   focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none 
                   bg-white cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {formData.vehicleId
          ? vehicles.find((v) => v._id === formData.vehicleId)?.vehicleNumber
          : "Select Vehicle..."}
        <span className="ml-2">&#9662;</span>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-auto">
          <input
            type="text"
            placeholder="Search vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border-b border-gray-300 w-full 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none"
          />
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((v) => (
              <div
                key={v._id}
                onClick={() => handleSelect(v)}
                className="px-3 py-2 hover:bg-green-100 cursor-pointer"
              >
                {v.vehicleNumber} ({v.vehicleType})
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500">No vehicles found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleSection;

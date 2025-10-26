import React, { useEffect, useState } from "react";
import BASE_URL from "../../constants/constants";
import LoadingSpinner from "../../constants/Loading/LoadingSpinner";
import VehicleForm from "../pages/widgets/Vehicles/VehicleForm"; 
import VehiclesTable from "../pages/widgets/Vehicles/VehiclesTable"; 

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(""); // search state

  const [formData, setFormData] = useState({
    vehicleType: "",
    seatingCapacity: "",
    vehicleNumber: "",
  });
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // fetch all vehicles
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/vehicles`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch vehicles");

      const data = await res.json();
      setVehicles(data || []);
      setFilteredVehicles(data || []); // initialize filtered list
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = vehicles.filter((v) =>
      v.vehicleType?.toLowerCase().includes(search.toLowerCase()) ||
      v.vehicleNumber?.toLowerCase().includes(search.toLowerCase()) ||
      (v.seatingCapacity + "").includes(search)
    );
    setFilteredVehicles(filtered);
  }, [search, vehicles]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const method = editId ? "PUT" : "POST";
      const url = editId
        ? `${BASE_URL}/api/vehicles/${editId}`
        : `${BASE_URL}/api/vehicles`;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to save vehicle");
      }

      await fetchVehicles();
      resetForm();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ vehicleType: "", seatingCapacity: "", vehicleNumber: "" });
    setEditId(null);
  };

  const handleEdit = (vehicle) => {
    setEditId(vehicle._id);
    setFormData({
      vehicleType: vehicle.vehicleType,
      seatingCapacity: vehicle.seatingCapacity,
      vehicleNumber: vehicle.vehicleNumber,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/vehicles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete vehicle");
      }

      setVehicles((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <div className="col-span-full">
        <LoadingSpinner text="Loading Vehicles..." />
      </div>
    );

  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="space-y-6">
      {/* Vehicle Form */}
      <VehicleForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        submitting={submitting}
        editId={editId}
        resetForm={resetForm}
      />

      {/* Heading + Search */}
      <div className="flex justify-between items-center mt-6 mb-4">
        <h2 className="text-xl font-semibold text-green-700">All Vehicles</h2>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700 w-60"
        />
      </div>

      {/* Vehicles Table */}
      <VehiclesTable
        vehicles={filteredVehicles}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Vehicles;

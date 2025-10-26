import React, { useEffect, useState } from "react";
import BASE_URL from "../../constants/constants";
import LoadingSpinner from "../../constants/Loading/LoadingSpinner";
import DriversTable from "../pages/widgets/Drivers/DriversTable";
import DriverForm from "../pages/widgets/Drivers/DriverForm";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(""); // ✅ search state

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // fetch all drivers
  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/drivers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch drivers");

      const data = await res.json();
      setDrivers(data.drivers || []);
      setFilteredDrivers(data.drivers || []); // ✅ initialize filtered list
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = drivers.filter((d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.email?.toLowerCase().includes(search.toLowerCase()) ||
      d.phone?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredDrivers(filtered);
  }, [search, drivers]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const method = editId ? "PUT" : "POST";
      const url = editId
        ? `${BASE_URL}/api/drivers/${editId}`
        : `${BASE_URL}/api/drivers`;

      let payload = { ...formData };
      if (editId && !payload.password) delete payload.password;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to save driver");
      }

      await fetchDrivers();
      resetForm();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", password: "" });
    setEditId(null);
  };

  const handleEdit = (driver) => {
    setEditId(driver._id);
    setFormData({
      name: driver.name,
      email: driver.email,
      phone: driver.phone || "",
      password: "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/drivers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete driver");
      }

      setDrivers((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <div className="col-span-full">
        <LoadingSpinner text="Loading Drivers..." />
      </div>
    );

  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="space-y-6">
    {/* Driver Form */}
    <DriverForm
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      submitting={submitting}
      editId={editId}
      resetForm={resetForm}
    />
  
    {/* Heading + Search */}
    <div className="flex justify-between items-center mt-6 mb-4">
      <h2 className="text-xl font-semibold text-green-700">All Drivers</h2>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-3 py-2 border border-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700 w-60" // smaller width
      />
    </div>
  
    {/* Drivers Table */}
    <DriversTable
      drivers={filteredDrivers}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  </div>
  
  );
};

export default Drivers;

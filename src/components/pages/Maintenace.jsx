import React, { useEffect, useState } from "react";
import BASE_URL from "../../constants/constants";
import LoadingSpinner from "../../constants/Loading/LoadingSpinner";
import MaintenanceForm from "./widgets/Maintenance/MaintenanceForm.jsx";
import MaintenanceTable from "./widgets/Maintenance/MaintenanceTable.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import MaintenanceStatsCards from "./widgets/stats/MaintenanceStatsCards.jsx";

const Maintenance = () => {
  const [maintenances, setMaintenances] = useState([]);
  const [filteredMaintenances, setFilteredMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const [formData, setFormData] = useState({
    date: "",
    maintenanceType: "",
    maintenanceCost: "",
    vehicleId: "",
    vehicleNumber: "",
    vehicleType: "",
    kmAtMaintenance: "",
    nextOilChangeKm: "",
    originalOdometerKm: "",
    driverId: "",
    driverName: "",
    driverNumber: "",
    company: "",
    paymentMode: "Cash",
    description: "",
  });

  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all maintenances
  const fetchMaintenances = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/maintenance`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch maintenances");

      const data = await res.json();
      setMaintenances(data || []);
      setFilteredMaintenances(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenances();
  }, []);

  // Search + month/year filter
  useEffect(() => {
    let temp = [...maintenances];

    if (search) {
      const term = search.toLowerCase();
      temp = temp.filter(
        (m) =>
          m.maintenanceType?.toLowerCase().includes(term) ||
          m.vehicleNumber?.toLowerCase().includes(term) ||
          m.driverName?.toLowerCase().includes(term) ||
          m.company?.toLowerCase().includes(term)
      );
    }

    if (monthFilter) {
      temp = temp.filter(
        (m) => new Date(m.date).getMonth() + 1 === parseInt(monthFilter)
      );
    }

    if (yearFilter) {
      temp = temp.filter(
        (m) => new Date(m.date).getFullYear() === parseInt(yearFilter)
      );
    }

    setFilteredMaintenances(temp);
  }, [search, monthFilter, yearFilter, maintenances]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const method = editId ? "PUT" : "POST";
      const url = editId
        ? `${BASE_URL}/api/maintenance/${editId}`
        : `${BASE_URL}/api/maintenance`;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          driver: formData.driverId,
          vehicle: formData.vehicleId,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to save maintenance");
      }

      toast.success(editId ? "Maintenance updated!" : "Maintenance added!");
      await fetchMaintenances();
      resetForm();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      date: "",
      maintenanceType: "",
      maintenanceCost: "",
      vehicleId: "",
      vehicleNumber: "",
      vehicleType: "",
      kmAtMaintenance: "",
      nextOilChangeKm: "",
      originalOdometerKm: "",
      driverId: "",
      driverName: "",
      driverNumber: "",
      company: "",
      paymentMode: "Cash",
      description: "",
    });
    setEditId(null);
  };

  const handleEdit = (m) => {
    setEditId(m._id);
    setFormData({
      date: m.date?.split("T")[0] || "",
      maintenanceType: m.maintenanceType || "",
      maintenanceCost: m.maintenanceCost || "",
      vehicleId: m.vehicle?._id || "",
      vehicleNumber: m.vehicle?.vehicleNumber || "",
      vehicleType: m.vehicle?.vehicleType || "",
      kmAtMaintenance: m.kmAtMaintenance || "",
      nextOilChangeKm: m.nextOilChangeKm || "",
      originalOdometerKm: m.originalOdometerKm || "",
      driverId: m.driver?._id || "",
      driverName: m.driver?.name || "",
      driverNumber: m.driver?.phone || "",
      company: m.company || "",
      paymentMode: m.paymentMode || "Cash",
      description: m.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/maintenance/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete maintenance");
      }

      toast.success("Maintenance deleted!");
      setMaintenances((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const exportToExcel = () => {
    if (filteredMaintenances.length === 0) {
      toast.warning("No maintenance records to export!");
      return;
    }

    const data = filteredMaintenances.map((m) => ({
      Date: m.date,
      "Maintenance Type": m.maintenanceType,
      "Maintenance Cost": m.maintenanceCost,
      "Vehicle Number": m.vehicleNumber,
      "Vehicle Type": m.vehicleType,
      "Driver Name": m.driverName,
      Company: m.company,
      "Payment Mode": m.paymentMode,
      Description: m.description,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Maintenance");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `maintenance_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (loading)
    return <LoadingSpinner text="Loading Maintenances..." />;

  if (error) return <p className="text-red-600">Error: {error}</p>;

  const years = Array.from(
    new Set(maintenances.map((m) => new Date(m.date).getFullYear()))
  ).sort((a, b) => b - a);

  return (
    <div className="p-4 relative">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      {/* Maintenance Stats */}
<MaintenanceStatsCards maintenances={filteredMaintenances} />

      {/* Maintenance Form */}
      <MaintenanceForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        submitting={submitting}
        editId={editId}
        resetForm={resetForm}
      />

      {/* Filters + Export */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-green-700">All Maintenances</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="Search by type, vehicle, driver, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
          />
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="px-3 py-2 border border-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
          >
            <option value="">All Months</option>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-3 py-2 border border-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={exportToExcel}
            className="px-4 py-2 rounded border border-green-700 text-white bg-green-700 hover:bg-white hover:text-green-700 transition-colors duration-300"
          >
            Export to Excel
          </button>
        </div>
      </div>

      {/* Maintenance Table */}
      <MaintenanceTable
        maintenances={filteredMaintenances}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Maintenance;

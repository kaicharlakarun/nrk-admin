import React, { useEffect, useState } from "react";
import TripsTable from "./widgets/Trips/TripsTable";
import EditTripSheet from "./widgets/Trips/EditTripSheet";
import BASE_URL from "../../constants/constants";
import LoadingSpinner from "../../constants/Loading/LoadingSpinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import StatsCards from "./widgets/stats/TripStatsCards";

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1); // 1-12
  const [yearFilter, setYearFilter] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    tripId: null,
    hardDelete: false,
  });
  const [editingTrip, setEditingTrip] = useState(null);

  // ✅ Fetch trips
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/trips`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch trips");

        const data = await res.json();
        setTrips(data.rows || []);
        setFilteredTrips(data.rows || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // ✅ Filters & search (based on startDate instead of bookingDate)
  useEffect(() => {
    let tempTrips = [...trips];

    if (search) {
      tempTrips = tempTrips.filter(
        (trip) =>
          trip.driverName?.toLowerCase().includes(search.toLowerCase()) ||
          trip.vehicleNumber?.toLowerCase().includes(search.toLowerCase()) ||
          (trip.startDate &&
            new Date(trip.startDate)
              .toLocaleDateString("en-IN")
              .includes(search))
      );
    }

    if (monthFilter) {
      tempTrips = tempTrips.filter((trip) => {
        if (!trip.startDate) return false;
        const month = new Date(trip.startDate).getMonth() + 1;
        return month === parseInt(monthFilter);
      });
    }

    if (yearFilter) {
      tempTrips = tempTrips.filter((trip) => {
        if (!trip.startDate) return false;
        const year = new Date(trip.startDate).getFullYear();
        return year === parseInt(yearFilter);
      });
    }

    setFilteredTrips(tempTrips);
  }, [search, monthFilter, yearFilter, trips]);

  // ✅ Handle Edit
  const handleEdit = (trip) => setEditingTrip(trip);

  // ✅ Handle Update
  const handleUpdate = (updatedTrip) => {
    setTrips((prev) =>
      prev.map((t) => (t._id === updatedTrip._id ? updatedTrip : t))
    );
    setFilteredTrips((prev) =>
      prev.map((t) => (t._id === updatedTrip._id ? updatedTrip : t))
    );
  };

  // ✅ Handle Delete
  const handleDelete = async (id, hardDelete = false) => {
    try {
      const res = await fetch(`${BASE_URL}/api/trips/${id}?hard=${hardDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete trip");

      toast.success(data.message || "Trip deleted successfully!");

      setTrips((prev) => prev.filter((trip) => trip._id !== id));
      setFilteredTrips((prev) => prev.filter((trip) => trip._id !== id));

      setDeleteModal({ open: false, tripId: null, hardDelete: false });
    } catch (err) {
      toast.error(err.message || "Failed to delete trip");
    }
  };

  // ✅ Export to Excel
  const exportToExcel = () => {
    if (filteredTrips.length === 0) {
      toast.warning("No trips to export!");
      return;
    }

    const data = filteredTrips.map((trip) => ({
      "Starting Date": trip.startDate
        ? new Date(trip.startDate).toLocaleDateString("en-IN")
        : "-",
      "Booking Id": trip.bookingId,
      "Driver Name": trip.driverName,
      "Vehicle Number": trip.vehicleNumber,
      "Customer Name": trip.customerName,
      "Travels Name": trip.travelsName || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trips");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `trips_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (loading)
    return (
      <div className="col-span-full">
        <LoadingSpinner text="Loading Trips..." />
      </div>
    );

  if (error) return <p className="text-red-600">Error: {error}</p>;

  // ✅ Build unique years from startDate
  const years = Array.from(
    new Set(
      trips
        .filter((t) => t.startDate)
        .map((t) => new Date(t.startDate).getFullYear())
    )
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

      {/* Stats Cards */}
      <StatsCards trips={filteredTrips} />

      {/* Filters + Export */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-green-700">All Trips</h2>

        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="Search by driver, vehicle, or date..."
            className="px-3 py-2 border border-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Month Filter */}
          <select
            className="px-3 py-2 border border-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          >
            <option value="">All Months</option>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          {/* Year Filter */}
          <select
            className="px-3 py-2 border border-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Export Button */}
          <button
            onClick={exportToExcel}
            className="px-4 py-2 rounded border border-green-700 text-white bg-green-700 hover:bg-white hover:text-green-700 transition-colors duration-300"
          >
            Export to Excel
          </button>
        </div>
      </div>

      {/* Trips Table */}
      {filteredTrips.length > 0 ? (
        <TripsTable
          trips={filteredTrips}
          handleEdit={handleEdit}
          handleDelete={(id) =>
            setDeleteModal({ open: true, tripId: id, hardDelete: false })
          }
        />
      ) : (
        <p className="text-center text-gray-500 mt-6">
          No trips found for this month.
        </p>
      )}

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this trip? This action cannot be
              undone.
            </p>
            <div className="flex items-center mb-4 gap-2">
              <input
                type="checkbox"
                id="hardDelete"
                checked={deleteModal.hardDelete}
                onChange={(e) =>
                  setDeleteModal((prev) => ({
                    ...prev,
                    hardDelete: e.target.checked,
                  }))
                }
                className="w-4 h-4"
              />
              <label htmlFor="hardDelete" className="text-sm text-gray-700">
                Hard Delete
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setDeleteModal({ open: false, tripId: null, hardDelete: false })
                }
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleDelete(deleteModal.tripId, deleteModal.hardDelete)
                }
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Trip Modal */}
      {editingTrip && (
        <EditTripSheet
          trip={editingTrip}
          onClose={() => setEditingTrip(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default Trips;

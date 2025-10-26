import React, { useEffect, useState } from "react";
import TripsTable from "./TripsTable";
import EditTripSheet from "./EditTripSheet";
import BASE_URL from "../../../../constants/constants";
import LoadingSpinner from "../../../../constants/Loading/LoadingSpinner";

const DriverTrips = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    tripId: null,
    hardDelete: false,
  });
  const [editingTrip, setEditingTrip] = useState(null);

  // Helper: format date as DD/MM/YYYY
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch trips for driver
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

  // Filters & search
  useEffect(() => {
    let tempTrips = [...trips];

    if (search) {
      const searchLower = search.toLowerCase();
      tempTrips = tempTrips.filter((trip) => {
        const vehicleMatch = trip.vehicleNumber?.toLowerCase().includes(searchLower);
        const dateMatch = formatDate(trip.startDate).includes(search);
        return vehicleMatch || dateMatch;
      });
    }

    if (monthFilter) {
      tempTrips = tempTrips.filter(
        (trip) =>
          trip.startDate &&
          new Date(trip.startDate).getMonth() + 1 === parseInt(monthFilter)
      );
    }

    if (yearFilter) {
      tempTrips = tempTrips.filter(
        (trip) =>
          trip.startDate &&
          new Date(trip.startDate).getFullYear() === parseInt(yearFilter)
      );
    }

    setFilteredTrips(tempTrips);
  }, [search, monthFilter, yearFilter, trips]);

  const handleEdit = (trip) => {
    setEditingTrip(trip);
  };

  const handleUpdate = (updatedTrip) => {
    setTrips((prev) => prev.map((t) => (t._id === updatedTrip._id ? updatedTrip : t)));
    setFilteredTrips((prev) => prev.map((t) => (t._id === updatedTrip._id ? updatedTrip : t)));
  };

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

      alert(data.message);

      setTrips((prev) => prev.filter((trip) => trip._id !== id));
      setFilteredTrips((prev) => prev.filter((trip) => trip._id !== id));
      setDeleteModal({ open: false, tripId: null, hardDelete: false });
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading)
    return (
      <div className="col-span-full">
        <LoadingSpinner text="Loading Trips..." />
      </div>
    );
  if (error) return <p className="text-red-600">Error: {error}</p>;

  // Unique years from startDate
  const years = Array.from(
    new Set(trips.map((t) => t.startDate ? new Date(t.startDate).getFullYear() : null).filter(Boolean))
  ).sort((a, b) => b - a);

  return (
    <div className="p-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-green-700">My Trips</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="Search by vehicle, start date (DD/MM/YYYY)..."
            className="px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
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
          <select
            className="px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
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
        </div>
      </div>

      <TripsTable
        trips={filteredTrips}
        handleEdit={handleEdit}
        handleDelete={(id) =>
          setDeleteModal({ open: true, tripId: id, hardDelete: false })
        }
      />

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
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

      {editingTrip && (
        <EditTripSheet
          trip={editingTrip}
          onClose={() => setEditingTrip(null)}
          onUpdate={handleUpdate}
          isDriverView={true}
        />
      )}
    </div>
  );
};

export default DriverTrips;

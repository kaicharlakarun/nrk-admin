import React, { useEffect, useState } from "react";
import BASE_URL from "../../../../constants/constants";
import LoadingSpinner from "../../../../constants/Loading/LoadingSpinner"

const UpcomingTrips = () => {
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUpcomingTrips = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/trips`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch trips");

        const data = await res.json();
        const today = new Date();

        // Filter trips with startDate in the future and sort earliest first
        const upcoming = data.rows
          .filter((trip) => new Date(trip.startDate) > today)
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        setUpcomingTrips(upcoming);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingTrips();
  }, []);

  const getCardColor = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();
    const diffDays = Math.ceil((start - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return "bg-red-500 text-white"; // today/tomorrow
    if (diffDays <= 7) return "bg-yellow-400 text-gray-900"; // within a week
    return "bg-green-700 text-white"; // after a week
  };

  if (loading) return <div className="col-span-full">
  <LoadingSpinner text="Loading upcoming journeys..." />
</div>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!upcomingTrips.length) return <p className="text-gray-400">No upcoming journeys.</p>;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-green-700 mb-3">Upcoming Journeys</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {upcomingTrips.map((trip) => (
          <div
            key={trip._id}
            className={`p-4 rounded-xl shadow-md hover:shadow-xl transition-all border ${getCardColor(trip.startDate)}`}
          >
            <h4 className="font-semibold mb-1">{trip.bookingId}</h4>
            <p className="text-sm mb-1">
              <strong>Driver:</strong> {trip.driverName}
            </p>
            <p className="text-sm mb-1">
              <strong>Vehicle:</strong> {trip.vehicleType} ({trip.vehicleNumber})
            </p>
            <p className="text-sm mb-1">
              <strong>Customer:</strong> {trip.customerName}
            </p>
            <p className="text-sm mb-1">
              <strong>From → To:</strong> {trip.fromLocation} → {trip.endLocation}
            </p>
            <p className="text-sm mb-1">
              <strong>Start Date:</strong> {new Date(trip.startDate).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingTrips;

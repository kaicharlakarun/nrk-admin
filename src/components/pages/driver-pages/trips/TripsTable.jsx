import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const TripsTable = ({ trips, handleEdit, handleDelete }) => {
  // helper function to format only date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d)) return dateString; // fallback if not a valid date
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

   // helper function to format date + time
   const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d)) return dateString;
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow bg-white">
      <table className="min-w-full divide-y divide-green-100">
        <thead className="bg-green-50">
          <tr>
            {[
              "SL.NO",
              "Booking ID",
              "Booking Date",
              "Driver",
              "Vehicle",
              "Customer",
              "Trip Duration",
              "Starting Reading (km)",
              "Ending Reading (km)",
              "From → To",
              "Trip Amount",
              "Advance",
              "Balance",
              "Payment Mode",
              "Received By",
              "Fuel Type",
              "Fuel Amount",
              "Tolls",
              "Parking",
              "Driver Beta",
              "Description",
              "Total Expenses",
              "Profit",
              "Actions",
            ].map((head, idx) => (
              <th
                key={idx}
                className="px-4 py-2 text-xs font-semibold text-left text-green-700 uppercase tracking-wider"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-green-100">
          {trips.map((trip, index) => (
            <tr
              key={trip._id || index}
              className="hover:bg-green-50 transition-colors"
            >
              <td className="px-4 py-2 text-sm">{index + 1}</td>
              <td className="px-4 py-2 text-sm">{trip.bookingId}</td>
              <td className="px-4 py-2 text-sm">{formatDate(trip.bookingDate)}</td>

              {/* Driver */}
              <td className="px-4 py-2 text-sm">
                {trip.driverName} <br />
                <span className="text-xs text-gray-500">{trip.driverNumber}</span>
              </td>

              {/* Vehicle */}
              <td className="px-4 py-2 text-sm">
                {trip.vehicleType} <br />
                <span className="text-xs text-gray-500">{trip.vehicleNumber}</span>
              </td>

              {/* Customer */}
              <td className="px-4 py-2 text-sm">
                {trip.customerName} <br />
                <span className="text-xs text-gray-500">{trip.customerNumber}</span>
              </td>

               {/* Trip Duration */}
               <td className="px-4 py-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Start:</span>{" "}
                  {formatDateTime(trip.startDate)}
                </div>
                <div className="mt-1">
                  <span className="font-medium text-gray-700">End:</span>{" "}
                  {formatDateTime(trip.endDate)}
                </div>
              </td>

               {/* Starting Reading */}
               <td className="px-4 py-2 text-sm">
                {trip.startingReading ? `${trip.startingReading} km` : "-"}
              </td>

              {/* Ending Reading */}
              <td className="px-4 py-2 text-sm">
                {trip.endingReading ? `${trip.endingReading} km` : "-"}
              </td>

              {/* Locations */}
              <td className="px-4 py-2 text-sm">
                {trip.fromLocation} → {trip.endLocation}
              </td>

              {/* Financials */}
              <td className="px-4 py-2 text-sm">₹{trip.tripAmount}</td>
              <td className="px-4 py-2 text-sm">₹{trip.advanceAmount}</td>
              <td className="px-4 py-2 text-sm">₹{trip.balanceAmount}</td>
              <td className="px-4 py-2 text-sm">{trip.paymentMode}</td>
              <td className="px-4 py-2 text-sm">{trip.tripAmountReceivedBy}</td>

              {/* Fuel & Expenses */}
              <td className="px-4 py-2 text-sm">{trip.fuelType}</td>
              <td className="px-4 py-2 text-sm">₹{trip.fuelAmount}</td>
              <td className="px-4 py-2 text-sm">₹{trip.tolls}</td>
              <td className="px-4 py-2 text-sm">₹{trip.parkingCharges}</td>
              <td className="px-4 py-2 text-sm">₹{trip.driverBeta}</td>
              <td className="px-4 py-2 text-sm">{trip.description}</td>
              <td className="px-4 py-2 text-sm">₹{trip.totalExpenses}</td>

              {/* Profit */}
              <td
                className={`px-4 py-2 text-sm font-semibold ${
                  trip.profit >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ₹{trip.profit}
              </td>

              {/* Actions */}
              <td className="px-4 py-2 text-sm flex gap-3">
                <button
                  onClick={() => handleEdit(trip)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(trip._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TripsTable;

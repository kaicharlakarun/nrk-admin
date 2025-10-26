import React, { useState } from "react";
import { Pencil, Trash2, MessageCircle } from "lucide-react";
import axios from "axios";
import BASE_URL from "../../../../constants/constants";

const TripsTable = ({ trips, handleEdit, handleDelete }) => {
  const [selectedTrip, setSelectedTrip] = useState(null);

  // helper function to format date + time
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // ✅ enable AM/PM format
      timeZone: "Asia/Kolkata", // ✅ show in local Indian time
    });
  };
  
  
  // handle WhatsApp redirect
  const handleSendWhatsApp = async (tripId, sendTo) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/api/trips/${tripId}/whatsapp?sendTo=${sendTo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.whatsappUrl) {
        window.open(res.data.whatsappUrl, "_blank"); // ✅ open WhatsApp
      }

      setSelectedTrip(null);
    } catch (err) {
      console.error("Failed to send WhatsApp:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to send WhatsApp");
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow bg-white">
      <table className="min-w-full divide-y divide-green-100">
        <thead className="bg-green-50">
          <tr>
            {[
              "SL.NO",
              "Booking ID",
              "Travels Name", // ✅ replaced Booking Date with Travels Name
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
              "Driver Amount",
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

              {/* ✅ Travels Name instead of Booking Date */}
              <td className="px-4 py-2 text-sm">
                {trip.travelsName || "-"}
              </td>

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
                <button
                  onClick={() => setSelectedTrip(trip)}
                  className="text-green-600 hover:text-green-800"
                >
                  <MessageCircle size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* WhatsApp Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button
              onClick={() => setSelectedTrip(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold text-xl"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">
              Send Trip Details
            </h2>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleSendWhatsApp(selectedTrip._id, "customer")}
                className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-md transform transition duration-300 hover:scale-105"
              >
                Customer
              </button>

              <button
                onClick={() => handleSendWhatsApp(selectedTrip._id, "driver")}
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md transform transition duration-300 hover:scale-105"
              >
                Driver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripsTable;

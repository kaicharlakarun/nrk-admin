import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TextInput from "../Trips/TripSearchFilter/TextInput";
import NumberInput from "../Trips/TripSearchFilter/NumberInput";
import SelectInput from "../Trips/TripSearchFilter/SelectInput";
import DriverSection from "../Trips/TripSearchFilter/DriverSection";
import VehicleSection from "../Trips/TripSearchFilter/VehicleSection";
import BASE_URL from "../../../../constants/constants";

const EditTripSheet = ({ trip, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ ...trip });
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const formatForDateTimeLocal = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  useEffect(() => {
    const fetchDrivers = async () => {
      const res = await fetch(`${BASE_URL}/api/drivers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setDrivers(data.rows || []);
    };

    const fetchVehicles = async () => {
      const res = await fetch(`${BASE_URL}/api/vehicles`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setVehicles(data.rows || []);
    };

    fetchDrivers();
    fetchVehicles();
  }, []);

  useEffect(() => {
    let initialData = { ...trip };

    // Format startDate & endDate for datetime-local input
    if (trip.startDate) {
      initialData.startDate = formatForDateTimeLocal(trip.startDate);
    }
    if (trip.endDate) {
      initialData.endDate = formatForDateTimeLocal(trip.endDate);
    }

    // Handle Petrol & CNG split
    if (trip.fuelType === "Petrol & CNG" && typeof trip.fuelAmount === "string") {
      const petrolMatch = trip.fuelAmount.match(/Petrol:\s*(\d+)/);
      const cngMatch = trip.fuelAmount.match(/CNG:\s*(\d+)/);
      initialData.petrolAmount = petrolMatch ? parseInt(petrolMatch[1], 10) : 0;
      initialData.cngAmount = cngMatch ? parseInt(cngMatch[1], 10) : 0;
    }

    setFormData(initialData);
  }, [trip]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = { ...formData };

      // Combine Petrol + CNG if needed
      if (formData.fuelType === "Petrol & CNG") {
        payload.fuelAmount = `Petrol: ${formData.petrolAmount}, CNG: ${formData.cngAmount}`;
      }

      const res = await fetch(`${BASE_URL}/api/trips/${trip._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update trip");
      const updatedTrip = await res.json();

      toast.success("Trip updated successfully!");
      onUpdate(updatedTrip);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-start z-50 backdrop-blur-sm overflow-auto p-4">
      <div className="bg-white w-full md:w-4/5 lg:w-3/4 xl:w-2/3 rounded-lg shadow-lg p-6 mt-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-green-700">Edit Trip</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Driver + Vehicle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DriverSection
              formData={formData}
              handleChange={handleChange}
              drivers={drivers}
            />
            <VehicleSection
              formData={formData}
              handleChange={handleChange}
              vehicles={vehicles}
            />
          </div>

          {/* ✅ Replace Booking Date with Travels Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Travels Name"
              name="travelsName"
              value={formData.travelsName || ""}
              onChange={handleChange}
              placeholder="Enter travels name (optional)"
            />
            <NumberInput
              label="Driver Amount"
              name="driverBeta"
              value={formData.driverBeta}
              onChange={handleChange}
            />
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Customer Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
            />
            <TextInput
              label="Customer Number"
              name="customerNumber"
              value={formData.customerNumber}
              onChange={handleChange}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Start Date & Time"
              name="startDate"
              type="datetime-local"
              value={formData.startDate}
              onChange={handleChange}
            />
            <TextInput
              label="End Date & Time"
              name="endDate"
              type="datetime-local"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>

          {/* Readings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumberInput
              label="Starting Reading (km)"
              name="startingReading"
              value={formData.startingReading}
              onChange={handleChange}
            />
            <NumberInput
              label="Ending Reading (km)"
              name="endingReading"
              value={formData.endingReading}
              onChange={handleChange}
            />
          </div>

          {/* Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="From Location"
              name="fromLocation"
              value={formData.fromLocation}
              onChange={handleChange}
            />
            <TextInput
              label="End Location"
              name="endLocation"
              value={formData.endLocation}
              onChange={handleChange}
            />
          </div>

          {/* Amounts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumberInput
              label="Trip Amount"
              name="tripAmount"
              value={formData.tripAmount}
              onChange={handleChange}
            />
            <NumberInput
              label="Advance Amount"
              name="advanceAmount"
              value={formData.advanceAmount}
              onChange={handleChange}
            />
          </div>

          {/* Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Received By"
              name="tripAmountReceivedBy"
              value={formData.tripAmountReceivedBy}
              onChange={handleChange}
            />
            <SelectInput
              label="Payment Mode"
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleChange}
              options={[
                { label: "Cash", value: "Cash" },
                { label: "UPI", value: "UPI" },
                { label: "Credit Card", value: "Credit Card" },
              ]}
            />
          </div>

          {/* Fuel & Expenses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectInput
              label="Fuel Type"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              options={[
                { label: "Petrol", value: "Petrol" },
                { label: "Diesel", value: "Diesel" },
                { label: "CNG", value: "CNG" },
                { label: "Petrol & CNG", value: "Petrol & CNG" },
              ]}
            />

            {formData.fuelType === "Petrol & CNG" ? (
              <>
                <NumberInput
                  label="Petrol Amount"
                  name="petrolAmount"
                  value={formData.petrolAmount}
                  onChange={handleChange}
                />
                <NumberInput
                  label="CNG Amount"
                  name="cngAmount"
                  value={formData.cngAmount}
                  onChange={handleChange}
                />
              </>
            ) : (
              <NumberInput
                label="Fuel Amount"
                name="fuelAmount"
                value={formData.fuelAmount}
                onChange={handleChange}
              />
            )}
          </div>

          {/* Tolls & Parking */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumberInput
              label="Tolls"
              name="tolls"
              value={formData.tolls}
              onChange={handleChange}
            />
            <NumberInput
              label="Parking Charges"
              name="parkingCharges"
              value={formData.parkingCharges}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows="3"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              {loading ? "Updating..." : "Update Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTripSheet;

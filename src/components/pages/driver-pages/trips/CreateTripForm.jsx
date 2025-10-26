import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TextInput from "../../widgets/Trips/TripSearchFilter/TextInput";
import NumberInput from "../../widgets/Trips/TripSearchFilter/NumberInput";
import SelectInput from "../../widgets/Trips/TripSearchFilter/SelectInput";
import DriverSection from "../../widgets/Trips/TripSearchFilter/DriverSection";
import VehicleSection from "../../widgets/Trips/TripSearchFilter/VehicleSection";
import BASE_URL from "../../../../constants/constants";

const CreateTripForm = () => {
  const [formData, setFormData] = useState({
    bookingDate: "",
    driverId: "",
    driverName: "",
    driverNumber: "",
    vehicleId: "",
    vehicleType: "",
    vehicleNumber: "",
    customerName: "",
    customerNumber: "",
    startDate: "",
    fromLocation: "",
    endDate: "",
    endLocation: "",
    startingReading: 0,   // ✅ added
    endingReading: 0,     // ✅ added
    tripAmount: 0,
    advanceAmount: 0,
    paymentMode: "Cash",
    tripAmountReceivedBy: "",
    fuelType: "Petrol",
    fuelAmount: 0,        // for single fuel
    petrolAmount: 0,      // for Petrol & CNG
    cngAmount: 0,         // for Petrol & CNG
    tolls: 0,
    parkingCharges: 0,
    driverBeta: 0,
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.driverId || !formData.vehicleId) {
      toast.error("Driver and Vehicle are mandatory!");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Handle Petrol & CNG fuel type
      const payload = { ...formData };
      if (formData.fuelType === "Petrol & CNG") {
        payload.fuelAmount = `Petrol: ${formData.petrolAmount}, CNG: ${formData.cngAmount}`;
      }

      const res = await fetch(`${BASE_URL}/api/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create trip");

      toast.success("Trip created successfully!");

      // Reset form
      setFormData({
        bookingDate: "",
        driverId: "",
        driverName: "",
        driverNumber: "",
        vehicleId: "",
        vehicleType: "",
        vehicleNumber: "",
        customerName: "",
        customerNumber: "",
        startDate: "",
        fromLocation: "",
        endDate: "",
        endLocation: "",
        startingReading: 0,
        endingReading: 0,
        tripAmount: 0,
        advanceAmount: 0,
        paymentMode: "Cash",
        tripAmountReceivedBy: "",
        fuelType: "Petrol",
        fuelAmount: 0,
        petrolAmount: 0,
        cngAmount: 0,
        tolls: 0,
        parkingCharges: 0,
        driverBeta: 0,
        description: "",
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-green-700">Create Trip</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Driver & Vehicle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DriverSection formData={formData} handleChange={handleChange} />
          <VehicleSection formData={formData} handleChange={handleChange} />
        </div>

        {/* Booking & Driver Beta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Booking Date"
            name="bookingDate"
            type="date"
            value={formData.bookingDate}
            onChange={handleChange}
          />
          <NumberInput
            label="Driver Beta"
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

        {/* Start & End Date-Time */}
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

        {/* Meter Readings */}
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

        {/* Trip & Advance Amount */}
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

        {/* Payment */}
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

        {/* Fuel */}
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
            rows="3"
            className="p-2 border border-gray-300 rounded-md w-full 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded border border-green-500 text-white bg-green-500 hover:bg-white hover:text-green-500 transition-colors duration-300"
          >
            {loading ? "Creating..." : "Create Trip"}
          </button>
        </div>
      </form>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default CreateTripForm;

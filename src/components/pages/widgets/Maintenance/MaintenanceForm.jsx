import React from "react";
import DriverSection from "../../widgets/Trips/TripSearchFilter/DriverSection";
import VehicleSection from "../../widgets/Trips/TripSearchFilter/VehicleSection";
import SelectInput from "../Trips/TripSearchFilter/SelectInput";
import TextInput from "../Trips/TripSearchFilter/TextInput";

const MaintenanceForm = ({
  formData,
  handleChange,
  handleSubmit,
  submitting,
  editId,
  resetForm,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-xl shadow-md space-y-6"
    >
      {/* Title */}
      <h3 className="text-xl font-semibold text-green-700 text-center">
        {editId ? "Edit Maintenance" : "Add Maintenance"}
      </h3>

      {/* Grid Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date */}
        <div>
          <label className="text-sm font-medium mb-1 block">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md w-full 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none"
            required
          />
        </div>

        {/* Maintenance Type */}
        <SelectInput
          label="Maintenance Type"
          name="maintenanceType"
          value={formData.maintenanceType}
          onChange={handleChange}
          options={[
            { label: "Oil Change", value: "Oil Change" },
            { label: "Tire Replacement", value: "Tire Replacement" },
            { label: "Brake Service", value: "Brake Service" },
            { label: "Battery Replacement", value: "Battery Replacement" },
            { label: "General Service", value: "General Service" },
            { label: "Transmission Service", value: "Transmission Service" },
            { label: "Engine Repair", value: "Engine Repair" },
            { label: "AC Repair", value: "AC Repair" },
            { label: "Other", value: "Other" },
          ]}
        />

        {/* Maintenance Cost */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Maintenance Cost (₹)
          </label>
          <input
            type="number"
            name="maintenanceCost"
            placeholder="Enter cost..."
            value={formData.maintenanceCost}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md w-full 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none"
            required
          />
        </div>

        {/* Vehicle Dropdown */}
        <VehicleSection formData={formData} handleChange={handleChange} />

        {/* KM at Maintenance */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            KM at Maintenance
          </label>
          <input
            type="number"
            name="kmAtMaintenance"
            placeholder="Enter KM..."
            value={formData.kmAtMaintenance}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md w-full 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none"
            required
          />
        </div>

        {/* Next Oil Change KM */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Next Oil Change KM
          </label>
          <input
            type="number"
            name="nextOilChangeKm"
            placeholder="Enter KM..."
            value={formData.nextOilChangeKm}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md w-full 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none"
          />
        </div>

        {/* Original Odometer KM */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Original Odometer KM
          </label>
          <input
            type="number"
            name="originalOdometerKm"
            placeholder="Enter KM..."
            value={formData.originalOdometerKm}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md w-full 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none"
            required
          />
        </div>

        {/* Driver Dropdown */}
        <DriverSection formData={formData} handleChange={handleChange} />

        {/* Company */}
        <div>
          <label className="text-sm font-medium mb-1 block">Company</label>
          <input
            type="text"
            name="company"
            placeholder="Enter company..."
            value={formData.company}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md w-full 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none"
          />
        </div>

        {/* Payment Mode */}
        <SelectInput
          label="Payment Mode"
          name="paymentMode"
          value={formData.paymentMode}
          onChange={handleChange}
          options={[
            { label: "Cash", value: "Cash" },
            { label: "Card", value: "Card" },
            { label: "Online", value: "Online" },
            { label: "Other", value: "Other" },
          ]}
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium mb-1 block">Description</label>
        <textarea
          name="description"
          placeholder="Enter details..."
          value={formData.description}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md w-full 
                     focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none"
          rows={3}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-center">
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 rounded border border-green-700 text-white bg-green-700 hover:bg-white hover:text-green-700 transition-colors duration-300"
        >
          {submitting ? "Adding..." : editId ? "Update" : "Add Maintenance"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={resetForm}
            className="px-5 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default MaintenanceForm;

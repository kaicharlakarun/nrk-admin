import React from "react";

const VehicleForm = ({
  formData,
  handleChange,
  handleSubmit,
  submitting,
  editId,
  resetForm,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-green-700 mb-4">
        {editId ? "Edit Vehicle" : "Add Vehicle"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          name="vehicleType"
          placeholder="Vehicle Type (Car, Bus, Van)"
          className="border rounded-lg p-2 focus:ring-2 focus:ring-green-400"
          value={formData.vehicleType}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="seatingCapacity"
          placeholder="Seating Capacity"
          className="border rounded-lg p-2 focus:ring-2 focus:ring-green-400"
          value={formData.seatingCapacity}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="vehicleNumber"
          placeholder="Vehicle Number (e.g. MH12AB1234)"
          className="border rounded-lg p-2 focus:ring-2 focus:ring-green-400"
          value={formData.vehicleNumber}
          onChange={handleChange}
          required
        />

        <div className="col-span-full flex gap-3 mt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded border border-green-700 text-white bg-green-700 hover:bg-white hover:text-green-700 transition-colors duration-300"
          >
            {submitting
              ? editId
                ? "Updating..."
                : "Saving..."
              : editId
              ? "Update Vehicle"
              : "Add Vehicle"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;

import React from "react";

const AdsForm = ({ formData, handleChange, handleSubmit, submitting, editId, resetForm }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-green-700 mb-4">
        {editId ? "Edit Ad" : "Add Ad"}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="border rounded-lg p-2 focus:ring-2 focus:ring-green-400"
          required
        />
        <input
          type="text"
          name="paymentMode"
          placeholder="Payment Mode (cash, online, upi)"
          value={formData.paymentMode}
          onChange={handleChange}
          className="border rounded-lg p-2 focus:ring-2 focus:ring-green-400"
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="border rounded-lg p-2 focus:ring-2 focus:ring-green-400"
          required
        />

        <div className="col-span-full flex gap-3 mt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded border border-green-700 text-white bg-green-700 hover:bg-white hover:text-green-700 transition-colors duration-300"
          >
            {submitting ? (editId ? "Updating..." : "Saving...") : editId ? "Update Ad" : "Add Ad"}
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

export default AdsForm;

import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const VehiclesTable = ({ vehicles, handleEdit, handleDelete }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow bg-white">
      <table className="min-w-full divide-y divide-green-100">
        <thead className="bg-green-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
              SL.NO
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
              Vehicle Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
              Seating Capacity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
              Vehicle Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-green-100">
          {vehicles.map((vehicle, index) => (
            <tr
              key={vehicle._id || index}
              className="hover:bg-green-50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">
                {index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">
                {vehicle.vehicleType}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">
                {vehicle.seatingCapacity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">
                {vehicle.vehicleNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 flex gap-3">
                <button
                  onClick={() => handleEdit(vehicle)}
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(vehicle._id)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {vehicles.length === 0 && (
        <p className="text-center text-gray-500 py-4">No vehicles found.</p>
      )}
    </div>
  );
};

export default VehiclesTable;


import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const MaintenanceTable = ({ maintenances, handleEdit, handleDelete }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow bg-white">
      <table className="min-w-full divide-y divide-green-100">
      <thead className="bg-green-50">
  <tr>
    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase">SL.NO</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase">Date</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase">Type</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase">Cost (₹)</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase">Vehicle</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase">Driver</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase">KM at Maintenance</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase">Next Oil Change</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase">Original Odometer</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase">Company</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase">Payment Mode</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase">Description</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase">Actions</th>
  </tr>
</thead>
<tbody className="divide-y divide-green-100">
  {maintenances.map((m, index) => (
    <tr key={m._id} className="hover:bg-green-50 transition-colors">
      <td className="px-6 py-4 text-sm text-green-700">{index + 1}</td>
      <td className="px-6 py-4 text-sm text-green-700">
        {new Date(m.date).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-sm text-green-700">{m.maintenanceType}</td>
      <td className="px-6 py-4 text-sm text-green-700">₹{m.maintenanceCost}</td>
      <td className="px-6 py-4 text-sm text-green-700">{m.vehicle?.vehicleNumber} ({m.vehicle?.vehicleType})</td>
      <td className="px-6 py-4 text-sm text-green-700">{m.driver?.name} ({m.driver?.phone})</td>
      <td className="px-6 py-4 text-sm text-green-700">{m.kmAtMaintenance}</td>
      <td className="px-6 py-4 text-sm text-green-700">{m.nextOilChangeKm || "-"}</td>
      <td className="px-6 py-4 text-sm text-green-700">{m.originalOdometerKm}</td>
      <td className="px-6 py-4 text-sm text-green-700">{m.company || "-"}</td>
      <td className="px-6 py-4 text-sm text-green-700">{m.paymentMode}</td>
      <td className="px-6 py-4 text-sm text-green-700">{m.description || "-"}</td>
      <td className="px-6 py-4 text-sm text-green-700 flex gap-3">
        <button onClick={() => handleEdit(m)} className="text-blue-600 hover:text-blue-800 transition">
          <Pencil size={18} />
        </button>
        <button onClick={() => handleDelete(m._id)} className="text-red-600 hover:text-red-800 transition">
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
      {maintenances.length === 0 && (
        <p className="text-center text-gray-500 py-4">No maintenance records found.</p>
      )}
    </div>
  );
};

export default MaintenanceTable;

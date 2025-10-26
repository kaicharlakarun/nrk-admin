import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const AdsTable = ({ ads, handleEdit, handleDelete }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow bg-white">
      <table className="min-w-full divide-y divide-green-100">
        <thead className="bg-green-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">SL.NO</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Payment Mode</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-green-100">
          {ads.map((ad, index) => (
            <tr key={ad._id || index} className="hover:bg-green-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">{ad.date.split("T")[0]}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">{ad.paymentMode}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">{ad.amount}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 flex gap-3">
                <button onClick={() => handleEdit(ad)} className="text-blue-600 hover:text-blue-800 transition">
                  <Pencil size={18} />
                </button>
                <button onClick={() => handleDelete(ad._id)} className="text-red-600 hover:text-red-800 transition">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {ads.length === 0 && <p className="text-center text-gray-500 py-4">No ads found.</p>}
    </div>
  );
};

export default AdsTable;

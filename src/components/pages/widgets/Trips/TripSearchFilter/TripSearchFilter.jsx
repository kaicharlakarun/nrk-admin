import React, { useState } from "react";

const TripSearchFilter = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // send search term to parent
  };

  const handleMonthChange = (e) => {
    const value = e.target.value;
    setMonth(value);
    onFilter({ month: value, year }); // send filter to parent
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    setYear(value);
    onFilter({ month, year: value });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 p-4 bg-white rounded-lg shadow">
      {/* Left Side Text */}
      <div>
        <h2 className="text-lg font-semibold text-green-700">All Trips</h2>
      </div>

      {/* Right Side Filters */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <input
          type="text"
          placeholder="Search by driver, vehicle, booking date..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border rounded px-3 py-2 w-full sm:w-64"
        />

        <select
          value={month}
          onChange={handleMonthChange}
          className="border rounded px-3 py-2 w-full sm:w-40"
        >
          <option value="">Month</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>

        <select
          value={year}
          onChange={handleYearChange}
          className="border rounded px-3 py-2 w-full sm:w-32"
        >
          <option value="">Year</option>
          {Array.from({ length: 5 }, (_, i) => {
            const y = new Date().getFullYear() - i;
            return <option key={y} value={y}>{y}</option>;
          })}
        </select>
      </div>
    </div>
  );
};

export default TripSearchFilter;

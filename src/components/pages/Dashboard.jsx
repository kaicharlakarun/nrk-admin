import React from "react";
import TripStats from "./TripStats/TripStats";
import CreateTripForm from "./CreateTripForm/CreateTripForm";
import UpcomingTrips from "./widgets/Trips/UpcomingTrips";

const Dashboard = () => {
  return (
    <div className="p-4 space-y-6">
      <TripStats />
      <CreateTripForm />
      <UpcomingTrips />
    </div>
  );
};

export default Dashboard;

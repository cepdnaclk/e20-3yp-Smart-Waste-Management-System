// 


import React from 'react';
import CollectionDate from './dashboard/CollectionDate';
import AvailableTrucks from './dashboard/AvailableTrucks';
import MaintenanceRequests from './dashboard/MaintenanceRequests.jsx';
import TotalBins from './dashboard/Totalbins.jsx';
import Map from './dashboard/Map';
import History from './dashboard/History';

const Dashboard = () => {
  return (
    <main className="dashboard">
      <div className="dashboard__grid">
        <CollectionDate />
        <AvailableTrucks />
        <MaintenanceRequests />
        <TotalBins />
        <Map />
        <History />
      </div>
    </main>
  );
};

export default Dashboard;
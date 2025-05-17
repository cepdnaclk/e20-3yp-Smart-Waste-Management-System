// 


import React from 'react';
import CollectionDate from './dashboard/CollectionDate';
import AvailableTrucks from './dashboard/AvailableTrucks';
import MaintenanceRequests from './dashboard/MaintenanceRequests.jsx';
import TotalBins from './dashboard/Totalbins.jsx';
import History from './dashboard/History';
import '../styles/styles.css';
import MyMap from '../components/dashboard/MyMap.jsx';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS globally

const Dashboard = () => {
  return (
    <main className="dashboard">
      <div className="dashboard__grid">
        <CollectionDate />
        <AvailableTrucks />
        <MaintenanceRequests />
        <TotalBins />
        <History />
        <MyMap />
        
      </div>
    </main>
  );
};

export default Dashboard;
// src/components/DashboardView.jsx
import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import IconWrapper from './IconWrapper';
import { mockData } from '../data/mockData';
import { CalendarDays, Truck, Wrench, Maximize2, Minimize2, MapPin } from 'lucide-react';

const DashboardView = ({ isMobile }) => {
  const [isMapMaximized, setIsMapMaximized] = useState(false);
  // This state will determine if the layout should hide side elements for maximized map on mobile
  const [applyMobileMapMaximizedLayout, setApplyMobileMapMaximizedLayout] = useState(false);

  useEffect(() => {
    setApplyMobileMapMaximizedLayout(isMobile && isMapMaximized);
  }, [isMobile, isMapMaximized]);


  return (
    <div className="dashboard-view">
      <h2 className="dashboard-section-title">Dashboard</h2>

      <div className="stats-row">
        <StatCard
          title="Next Collection Date"
          value={mockData.nextCollectionDate}
          subValue={mockData.nextCollectionTomorrow ? "Tomorrow" : ""}
          Icon={CalendarDays}
        />
        <StatCard title="Available Trucks">
          <div className="stat-card-content-row">
            <div>
              <p style={{ color: '#63B3ED' }}>{mockData.availableTrucks.idle}</p>
              <p>Idle</p>
            </div>
            <div>
              <p style={{ color: '#F6E05E' }}>{mockData.availableTrucks.onRoute}</p>
              <p>On Route</p>
            </div>
            <div>
              <p style={{ color: '#FC8181' }}>{mockData.availableTrucks.needRepair}</p>
              <p>Need Repair</p>
            </div>
          </div>
        </StatCard>
        <StatCard title="Maintenance & Requests">
            <div className="stat-card-content-row">
                <div>
                    <p style={{ color: '#F6AD55' }}>{mockData.maintenanceRequests.emergency}</p>
                    <p>Emergency</p>
                </div>
                <div>
                    <p style={{ color: '#4FD1C5' }}>{mockData.maintenanceRequests.binRepair}</p>
                    <p>Bin Repairs</p>
                </div>
            </div>
        </StatCard>
      </div>

      <div className={`main-content-layout ${applyMobileMapMaximizedLayout ? 'map-maximized-mobile' : ''}`}>
        <div className="content-column-minor">
          <div className="dashboard-card bin-status-card">
            <h3 className="dashboard-card-title">Total Bins</h3>
            <p className="bin-status-main-value">{mockData.bins.total}</p>
            <div className="bin-status-details">
              <div>
                <p style={{ color: '#63B3ED' }}>{mockData.bins.active}/{mockData.bins.total}</p>
                <p>Active</p>
              </div>
              <div>
                <p style={{ color: '#FC8181' }}>{mockData.bins.full}/{mockData.bins.total}</p>
                <p>Full</p>
              </div>
              <div>
                <p style={{ color: '#F6E05E' }}>{mockData.bins.empty}/{mockData.bins.total}</p>
                <p>Empty</p>
              </div>
            </div>
          </div>

          <div className="dashboard-card history-card">
            <h3 className="dashboard-card-title">History</h3>
            <ul className="history-list">
              {mockData.history.length > 0 ? mockData.history.map(item => (
                <li key={item.id} className="history-item">
                  <div>
                    <p className="history-item-action">{item.action}</p>
                    <p className="history-item-meta">By: {item.user}</p>
                  </div>
                  <p className="history-item-time">{item.time}</p>
                </li>
              )) : (
                <p>No recent activity.</p>
              )}
            </ul>
          </div>
        </div>
        
        <div className="content-column-major">
            <div className={`dashboard-card map-placeholder-card ${isMapMaximized ? 'maximized' : ''}`}>
                <div className="map-header">
                <h3 className="dashboard-card-title">Map Satellite</h3>
                <button
                    onClick={() => setIsMapMaximized(!isMapMaximized)}
                    className="map-action-button"
                    aria-label={isMapMaximized ? "Minimize Map" : "Maximize Map"}
                >
                    <IconWrapper IconComponent={isMapMaximized ? Minimize2 : Maximize2} size={18} />
                    <span>{isMapMaximized ? 'Minimize' : 'Maximize'}</span>
                </button>
                </div>
                <div className="map-content-area">
                  <IconWrapper IconComponent={MapPin} size={isMapMaximized ? 60 : 40} />
                  <p>Map Placeholder</p>
                </div>
                <p className="map-data-attribution">Map data &copy; GreenPulse Maps</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
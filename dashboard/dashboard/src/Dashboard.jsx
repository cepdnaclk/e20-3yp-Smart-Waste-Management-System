// dashboard.jsx
import React from 'react';
import './dashboard.css';

// Importing icons (assuming you'll use a library like Font Awesome or SVGs)
// For now, using placeholder text or simple characters for icons.
import { FaTachometerAlt, FaBinoculars, FaTruck, FaClipboardList, FaChartBar, FaUsers, FaCog, FaQuestionCircle, FaUserCircle, FaSearch, FaBell } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <MainContent />
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">GreenPulse</div>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className="active">
            {/* <FaTachometerAlt /> for icon */}
            <span>&#9737;</span> Dashboard
          </li>
          <li>
            <span>&#128465;</span> Bin Management
          </li>
          <li>
            <span>&#128666;</span> Truck Management
          </li>
          <li>
            <span>&#128221;</span> Garbage Collection Monitoring
          </li>
          <li>
            <span>&#128202;</span> Reports & Analytics
          </li>
          <li>
            <span>&#128101;</span> User Management
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <ul>
          <li>
            <span>&#9881;</span> Settings
          </li>
          <li>
            <span>&#10067;</span> Support
          </li>
        </ul>
        <div className="admin-profile">
          <div className="admin-avatar">A</div>
          <span>Admin User</span>
        </div>
      </div>
    </div>
  );
};

const MainContent = () => {
  return (
    <div className="main-content">
      <Header />
      <div className="content-area">
        <div className="stats-grid">
          <StatCard title="Next Collection Date" className="collection-date-card">
            <div className="date-display">3<sup>rd</sup> March 2025</div>
            <div className="date-tomorrow">Tomorrow</div>
          </StatCard>

          <StatCard title="Available Trucks" className="trucks-card">
            <div className="truck-stats">
              <div>
                <div className="truck-count">2</div>
                <div>Idle</div>
              </div>
              <div>
                <div className="truck-count">3</div>
                <div>On Route</div>
              </div>
              <div>
                <div className="truck-count truck-need-repair">1</div>
                <div>Need Repair</div>
              </div>
            </div>
          </StatCard>

          <StatCard title="Maintenance & Requests" className="maintenance-card">
            <div className="maintenance-stats">
              <div>
                <div className="maintenance-count maintenance-emergency">2</div>
                <div>Emergency Requests</div>
              </div>
              <div>
                <div className="maintenance-count">1</div>
                <div>Bin Repair Requests</div>
              </div>
            </div>
          </StatCard>
        </div>

        <div className="lower-grid">
          <StatCard title="Total Bins" className="total-bins-card">
            <div className="total-bins-main">15</div>
            <div className="bin-categories">
              <div>
                <span className="bin-value">14</span>
                <span className="bin-label">Active</span>
              </div>
              <div>
                <span className="bin-value">2</span>
                <span className="bin-label">Full</span>
              </div>
              <div>
                <span className="bin-value">12</span>
                <span className="bin-label">Empty</span>
              </div>
            </div>
          </StatCard>

          <div className="history-card">
            <h3 className="card-title">History</h3>
            <div className="history-content">
              {/* Placeholder for history chart or data */}
              <p>History data will be displayed here.</p>
            </div>
          </div>

          <div className="map-card">
             <div className="map-header-controls">
                <h3 className="card-title">Map</h3>
                <div>
                    <button className="map-btn active">Map</button>
                    <button className="map-btn">Satellite</button>
                </div>
             </div>
            <div className="map-placeholder">
              {/* Placeholder for map embed */}
              <img src="" alt="Map Placeholder" style={{width: '100%', height: 'auto', display: 'block'}}/>
              {/* In a real app, you would embed a map component here e.g. Google Maps, Leaflet */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <div className="header">
      <div className="header-welcome">
        Welcome <br />
        <strong>Admin User</strong>
      </div>
      <div className="header-search">
        <span>&#128269;</span> {/* Search Icon */}
        <input type="text" placeholder="Find Something" />
      </div>
      <div className="header-icons">
        <span>&#128276;</span> {/* Bell Icon */}
        <span>&#128100;</span> {/* User/Profile Icon */}
      </div>
    </div>
  );
};

const StatCard = ({ title, children, className }) => {
  return (
    <div className={`stat-card ${className || ''}`}>
      <h3 className="card-title">{title}</h3>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { Truck } from 'lucide-react';

const TruckManagement = () => {
  return (
    <main className="page-content">
      <div className="page-header">
        <Truck size={24} />
        <h1 className="page-title">Truck Management</h1>
      </div>
      
      <div className="page-grid">
        <section className="card">
          <h3 className="card__title">Fleet Status</h3>
          <div className="truck-status-summary">
            <div className="status-card status-card--idle">
              <h4>Idle</h4>
              <div className="status-card__value">2</div>
              <div className="status-card__subtext">Available for assignment</div>
            </div>
            <div className="status-card status-card--active">
              <h4>On Route</h4>
              <div className="status-card__value">3</div>
              <div className="status-card__subtext">Currently collecting</div>
            </div>
            <div className="status-card status-card--repair">
              <h4>In Repair</h4>
              <div className="status-card__value">1</div>
              <div className="status-card__subtext">Undergoing maintenance</div>
            </div>
          </div>
        </section>
        
        <section className="card">
          <h3 className="card__title">Active Fleet</h3>
          <div className="truck-list">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Truck ID</th>
                  <th>Driver</th>
                  <th>Current Route</th>
                  <th>Status</th>
                  <th>Last Maintenance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>TRK-001</td>
                  <td>John Smith</td>
                  <td>Downtown Route</td>
                  <td><span className="status-badge status-badge--active">On Route</span></td>
                  <td>10 May 2025</td>
                  <td>
                    <button className="btn btn--small">Track</button>
                    <button className="btn btn--small btn--outline">Details</button>
                  </td>
                </tr>
                <tr>
                  <td>TRK-002</td>
                  <td>Sarah Johnson</td>
                  <td>North District</td>
                  <td><span className="status-badge status-badge--active">On Route</span></td>
                  <td>12 May 2025</td>
                  <td>
                    <button className="btn btn--small">Track</button>
                    <button className="btn btn--small btn--outline">Details</button>
                  </td>
                </tr>
                <tr>
                  <td>TRK-003</td>
                  <td>Mike Wilson</td>
                  <td>South District</td>
                  <td><span className="status-badge status-badge--active">On Route</span></td>
                  <td>8 May 2025</td>
                  <td>
                    <button className="btn btn--small">Track</button>
                    <button className="btn btn--small btn--outline">Details</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        
        <section className="card">
          <h3 className="card__title">Fleet Map View</h3>
          <div className="map">
            {/* Map would go here */}
            <div className="map-placeholder">
              <span>Interactive truck location tracking map would appear here</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default TruckManagement;
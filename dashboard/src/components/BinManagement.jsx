import React from 'react';
import { Trash2 } from 'lucide-react';

const BinManagement = () => {
  return (
    <main className="page-content">
      <div className="page-header">
        <Trash2 size={24} />
        <h1 className="page-title">Bin Management</h1>
      </div>
      
      <div className="page-grid">
        <section className="card">
          <h3 className="card__title">Active Bins</h3>
          <div className="bin-list">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bin ID</th>
                  <th>Location</th>
                  <th>Last Emptied</th>
                  <th>Status</th>
                  <th>Fill Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>BIN-001</td>
                  <td>Central Park</td>
                  <td>15 May 2025</td>
                  <td>Active</td>
                  <td>
                    <div className="progress-bar">
                      <div className="progress-bar__fill" style={{width: '75%'}}></div>
                    </div>
                    <span>75%</span>
                  </td>
                  <td>
                    <button className="btn btn--small">View</button>
                    <button className="btn btn--small btn--outline">Edit</button>
                  </td>
                </tr>
                <tr>
                  <td>BIN-002</td>
                  <td>Main Street</td>
                  <td>14 May 2025</td>
                  <td>Active</td>
                  <td>
                    <div className="progress-bar">
                      <div className="progress-bar__fill" style={{width: '90%'}}></div>
                    </div>
                    <span>90%</span>
                  </td>
                  <td>
                    <button className="btn btn--small">View</button>
                    <button className="btn btn--small btn--outline">Edit</button>
                  </td>
                </tr>
                <tr>
                  <td>BIN-003</td>
                  <td>City Hall</td>
                  <td>16 May 2025</td>
                  <td>Active</td>
                  <td>
                    <div className="progress-bar">
                      <div className="progress-bar__fill" style={{width: '45%'}}></div>
                    </div>
                    <span>45%</span>
                  </td>
                  <td>
                    <button className="btn btn--small">View</button>
                    <button className="btn btn--small btn--outline">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        
        <section className="card">
          <h3 className="card__title">Bin Distribution Map</h3>
          <div className="map">
            {/* Map would go here */}
            <div className="map-placeholder">
              <span>Interactive bin locations map would appear here</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};




export default BinManagement;
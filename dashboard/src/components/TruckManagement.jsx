import React from 'react';
import "../styles/TruckManagement.css"
import { Truck } from 'lucide-react';

const TruckManagement = () => {
  return (
    <div className='truck-management'>
    <main className="page-content">
      <div className="page-header">
        <Truck size={24} />
        <h1 className="page-title">Truck Management</h1>
      </div>
      
      <div className="page-grid">   
        <section className="card">
          <h3 className="card__title">Active Fleet</h3>
          <div className="truck-list">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Truck ID</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>TRK-001</td>
                  <td><span className="status-badge status-badge--active">On Route</span></td>
                </tr>
                <tr>
                  <td>TRK-002</td>
                  <td><span className="status-badge status-badge--active">On Route</span></td>
                </tr>
                <tr>
                  <td>TRK-003</td>
                  <td><span className="status-badge status-badge--active">On Route</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        
      </div>
    </main>
    </div>
  );
};

export default TruckManagement;
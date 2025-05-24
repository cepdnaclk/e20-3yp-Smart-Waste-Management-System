import React from 'react';
import { LineChart } from 'lucide-react';

const GarbageCollection = () => {
  return (
    <main className="page-content">
      <div className="page-header">
        <LineChart size={24} />
        <h1 className="page-title">Garbage Collection Monitoring</h1>
      </div>
      
      <div className="page-grid">
        <section className="card">
          <h3 className="card__title">Collection Schedule</h3>
          <div className="calendar-view">
            <div className="calendar-header">
              <h4>May 2025</h4>
              <div className="calendar-controls">
                <button className="btn btn--icon">&lt;</button>
                <button className="btn btn--icon">&gt;</button>
              </div>
            </div>
            <div className="calendar-grid">
              {/* Calendar would go here */}
              <div className="calendar-placeholder">
                Calendar view of collection schedule
              </div>
            </div>
          </div>
        </section>
        
        <section className="card">
          <h3 className="card__title">Collection Metrics</h3>
          <div className="metrics-summary">
            <div className="metric-card">
              <h4>Monthly Collection</h4>
              <div className="metric-card__value">43.2 tons</div>
              <div className="metric-card__change metric-card__change--positive">+5.2% from last month</div>
            </div>
            <div className="metric-card">
              <h4>Average Per Day</h4>
              <div className="metric-card__value">1.4 tons</div>
              <div className="metric-card__change metric-card__change--negative">-2.1% from last month</div>
            </div>
            <div className="metric-card">
              <h4>Recycling Rate</h4>
              <div className="metric-card__value">37%</div>
              <div className="metric-card__change metric-card__change--positive">+3.5% from last month</div>
            </div>
          </div>
        </section>
        
        <section className="card full-width">
          <h3 className="card__title">Collection Trends</h3>
          <div className="chart-container">
            {/* Chart would go here */}
            <div className="chart-placeholder">
              <span>Line chart showing collection volume trends over time would appear here</span>
            </div>
          </div>
        </section>
        
        <section className="card">
          <h3 className="card__title">Recent Collections</h3>
          <div className="collection-list">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Route</th>
                  <th>Truck</th>
                  <th>Volume</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>16 May 2025</td>
                  <td>East District</td>
                  <td>TRK-004</td>
                  <td>1.3 tons</td>
                  <td><span className="status-badge status-badge--complete">Complete</span></td>
                </tr>
                <tr>
                  <td>15 May 2025</td>
                  <td>North District</td>
                  <td>TRK-002</td>
                  <td>1.6 tons</td>
                  <td><span className="status-badge status-badge--complete">Complete</span></td>
                </tr>
                <tr>
                  <td>15 May 2025</td>
                  <td>West District</td>
                  <td>TRK-001</td>
                  <td>1.2 tons</td>
                  <td><span className="status-badge status-badge--complete">Complete</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
};

export default GarbageCollection;
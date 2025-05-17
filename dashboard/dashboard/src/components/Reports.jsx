import React from 'react';
import { BarChart } from 'lucide-react';

const Reports = () => {
  return (
    <main className="page-content">
      <div className="page-header">
        <BarChart size={24} />
        <h1 className="page-title">Reports & Analytics</h1>
      </div>
      
      <div className="page-grid">
        <section className="card">
          <h3 className="card__title">Performance Overview</h3>
          <div className="performance-summary">
            <div className="metric-card">
              <h4>Collection Efficiency</h4>
              <div className="metric-card__value">94%</div>
              <div className="metric-card__change metric-card__change--positive">+2% from last quarter</div>
            </div>
            <div className="metric-card">
              <h4>Bin Utilization</h4>
              <div className="metric-card__value">78%</div>
              <div className="metric-card__change metric-card__change--positive">+5% from last quarter</div>
            </div>
            <div className="metric-card">
              <h4>Cost per Ton</h4>
              <div className="metric-card__value">$42.15</div>
              <div className="metric-card__change metric-card__change--negative">+$1.20 from last quarter</div>
            </div>
          </div>
        </section>
        
        <section className="card full-width">
          <h3 className="card__title">Waste Collection by Category</h3>
          <div className="chart-container">
            {/* Chart would go here */}
            <div className="chart-placeholder">
              <span>Bar chart showing waste collection by category would appear here</span>
            </div>
          </div>
        </section>
        
        <section className="card">
          <h3 className="card__title">Route Efficiency Analysis</h3>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Avg Time</th>
                  <th>Bins Serviced</th>
                  <th>Avg Volume</th>
                  <th>Efficiency Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Downtown</td>
                  <td>2h 15m</td>
                  <td>28</td>
                  <td>1.4 tons</td>
                  <td>
                    <div className="progress-bar">
                      <div className="progress-bar__fill progress-bar__fill--high" style={{width: '92%'}}></div>
                    </div>
                    <span>92%</span>
                  </td>
                </tr>
                <tr>
                  <td>North District</td>
                  <td>3h 05m</td>
                  <td>32</td>
                  <td>1.6 tons</td>
                  <td>
                    <div className="progress-bar">
                      <div className="progress-bar__fill progress-bar__fill--high" style={{width: '88%'}}></div>
                    </div>
                    <span>88%</span>
                  </td>
                </tr>
                <tr>
                  <td>South District</td>
                  <td>2h 40m</td>
                  <td>25</td>
                  <td>1.2 tons</td>
                  <td>
                    <div className="progress-bar">
                      <div className="progress-bar__fill progress-bar__fill--medium" style={{width: '78%'}}></div>
                    </div>
                    <span>78%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        
        <section className="card">
          <h3 className="card__title">Generated Reports</h3>
          <div className="reports-list">
            <div className="report-item">
              <div className="report-item__icon">
                <BarChart size={20} />
              </div>
              <div className="report-item__details">
                <h4>Monthly Performance Report - April 2025</h4>
                <span className="report-item__date">Generated: 05/02/2025</span>
              </div>
              <button className="btn btn--small">Download</button>
            </div>
            <div className="report-item">
              <div className="report-item__icon">
                <BarChart size={20} />
              </div>
              <div className="report-item__details">
                <h4>Quarterly Waste Analysis Q1 2025</h4>
                <span className="report-item__date">Generated: 04/05/2025</span>
              </div>
              <button className="btn btn--small">Download</button>
            </div>
            <div className="report-item">
              <div className="report-item__icon">
                <BarChart size={20} />
              </div>
              <div className="report-item__details">
                <h4>Fleet Maintenance Cost Report - Q1 2025</h4>
                <span className="report-item__date">Generated: 04/02/2025</span>
              </div>
              <button className="btn btn--small">Download</button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Reports;
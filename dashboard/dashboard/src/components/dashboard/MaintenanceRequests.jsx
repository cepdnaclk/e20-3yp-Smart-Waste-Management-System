import React from 'react';

const MaintenanceRequests = () => {
  return (
    <section className="card maintenance-requests">
      <h3 className="card__title">Maintenance & Requests</h3>
      <div className="maintenance-requests__stats">
        <div className="maintenance-requests__stat">
          <span className="maintenance-requests__label">Emergency Requests</span>
          <span className="maintenance-requests__value maintenance-requests__value--emergency">2</span>
        </div>
        <div className="maintenance-requests__stat">
          <span className="maintenance-requests__label">Bin Repair Requests</span>
          <span className="maintenance-requests__value maintenance-requests__value--repair">1</span>
        </div>
      </div>
    </section>
  );
};

export default MaintenanceRequests;
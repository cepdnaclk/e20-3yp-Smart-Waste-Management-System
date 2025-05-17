import React from 'react';

const AvailableTrucks = () => {
  return (
    <section className="card available-trucks">
      <h3 className="card__title">Available Trucks</h3>
      <div className="available-trucks__stats">
        <div className="available-trucks__stat">
          <span className="available-trucks__label">Idle</span>
          <span className="available-trucks__value available-trucks__value--idle">2</span>
        </div>
        <div className="available-trucks__stat">
          <span className="available-trucks__label">On Route</span>
          <span className="available-trucks__value available-trucks__value--route">3</span>
        </div>
        <div className="available-trucks__stat">
          <span className="available-trucks__label">Need Repair</span>
          <span className="available-trucks__value available-trucks__value--repair">1</span>
        </div>
      </div>
    </section>
  );
};

export default AvailableTrucks;
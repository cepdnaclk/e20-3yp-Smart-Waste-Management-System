import React from 'react';

const TotalBins = () => {
  return (
    <section className="card total-bins">
      <h3 className="card__title">Total Bins</h3>
      <div className="total-bins__total">15</div>
      
      <div className="total-bins__stats">
        <div className="total-bins__stat">
          <span className="total-bins__label">Active</span>
          <div className="total-bins__value-container">
            <span className="total-bins__value">14</span>
            <span className="total-bins__fraction">/15</span>
          </div>
        </div>
        
        <div className="total-bins__stat">
          <span className="total-bins__label">Full</span>
          <div className="total-bins__value-container">
            <span className="total-bins__value">2</span>
            <span className="total-bins__fraction">/15</span>
          </div>
        </div>
        
        <div className="total-bins__stat">
          <span className="total-bins__label">Empty</span>
          <div className="total-bins__value-container">
            <span className="total-bins__value">12</span>
            <span className="total-bins__fraction">/15</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TotalBins;
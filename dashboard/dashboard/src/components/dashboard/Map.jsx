import React from 'react';

const Map = () => {
  return (
    <section className="card map">
      <div className="map__container">
        <div className="map__options">
          <button className="map__option map__option--active">Map</button>
          <button className="map__option">Satellite</button>
        </div>
        <div className="map__content">
          {/* This would typically be integrated with Google Maps or similar */}
          <img 
            src="/map-placeholder.png" 
            alt="Map View" 
            className="map__image" 
          />
        </div>
        <div className="map__attribution">
          <span>Map data ©2019 Google</span>
          <div className="map__links">
            <a href="#" className="map__link">Terms of Use</a>
            <a href="#" className="map__link">Report a map error</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Map;
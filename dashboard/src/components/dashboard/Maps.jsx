import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
const apiKey = import.meta.env.API_KEY;


const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: -3.1390,
  lng: 57.4909
};

const MyMapComponent = () => {
  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={['places']}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        <Marker position={center} />
        {/* Add more components like markers, info windows, etc. */}
      </GoogleMap>
    </LoadScript>
  );
};

export default MyMapComponent;
import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

const UserMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLoading(false);
        },
        (err) => {
          setError('Geolocation permission denied. Centering on a default location.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported. Centering on a default location.');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading map and location...</div>;
  }

  // The map will center on the user's location if available, otherwise it falls back to a default.
  const mapCenter = userLocation || { lat: 6.9271, lng: 79.8612 }; // Default to Colombo

  // Define other static locations for additional markers.
  const otherLocation1 = { lat: 7.2906, lng: 80.6337 }; // Kandy
  const otherLocation2 = { lat: 6.0535, lng: 80.2210 }; // Galle

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      {error && <div style={{ color: 'orange', textAlign: 'center', padding: '10px' }}>{error}</div>}
      <Map
        zoom={userLocation ? 12 : 8} // Zoom in if we have the user's location
        center={mapCenter}
        mapId="YOUR_MAP_ID" // Replace with your Map ID
      >
        {/* Marker 1: Only shows at the user's actual location IF permission is granted */}
        {userLocation && (
          <AdvancedMarker position={userLocation} title={'Your Location'} />
        )}

        {/* Marker 2: A fixed location */}
        <AdvancedMarker position={otherLocation1} title={'Kandy'} />

        {/* Marker 3: Another fixed location */}
        <AdvancedMarker position={otherLocation2} title={'Galle'} />
      </Map>
    </div>
  );
};

// The main component that provides the API key
const MyMap = () => {
  const apiKey = import.meta.env.VITE_Maps_API_KEY;

  if (!apiKey) {
    console.error("Error: Missing Google Maps API Key.");
    return <div style={{color: 'red', textAlign: 'center', marginTop: '50px'}}>Error: Missing Google Maps API Key.</div>;
  }

  return (
    <APIProvider apiKey={apiKey}>
      <UserMap />
    </APIProvider>
  );
};

export default MyMap;
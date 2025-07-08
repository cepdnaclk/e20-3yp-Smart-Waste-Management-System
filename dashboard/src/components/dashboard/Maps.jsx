import React from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

// The MyMap component now properly encapsulates all map logic.
const MyMap = () => {
  // Retrieve the API key from environment variables.
  const apiKey = import.meta.env.VITE_Maps_API_KEY;
  const position = { lat: -25.344, lng: 131.031 };

  if (!apiKey) {
    return <div>Error: Missing Google Maps API Key.</div>;
  }

  return (
    // The APIProvider handles loading the Google Maps script.
    <APIProvider apiKey={apiKey}>
      <div style={{ height: '100vh', width: '100%' }}>
        {/* The Map component renders the map. */}
        <Map
          defaultZoom={4}
          defaultCenter={position}
          mapId="DEMO_MAP_ID" // Use your own Map ID for production
        >
          {/* The AdvancedMarker component places a marker. */}
          <AdvancedMarker position={position} title={'Uluru'} />
        </Map>
      </div>
    </APIProvider>
  );
};

// Export the component function itself, not the result of calling it.
export default MyMap;
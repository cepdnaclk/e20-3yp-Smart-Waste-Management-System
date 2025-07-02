
// export default MyMap;
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

function MyMap() {
  const mapContainerRef = useRef(null); // Ref for the map container div
  const mapInstanceRef = useRef(null); // Ref to store the map instance

  useEffect(() => {
    // Only initialize the map if the container exists and map hasn't been initialized yet
    if (mapContainerRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current); // Initialize map on the div

      // Example: If line 33 in MyMap.jsx is map.setView()
      mapInstanceRef.current.setView([51.505, -0.09], 13); // Set initial view

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }

    // Cleanup function: Remove map when component unmounts
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Empty dependency array: runs once on mount, cleans up on unmount

  // Ensure the div has dimensions, e.g., via CSS or inline style
  return <div ref={mapContainerRef} style={{ height: '400px', width: '100%' }} />;
}

export default MyMap;
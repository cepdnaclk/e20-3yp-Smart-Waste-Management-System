// // MyMap.jsx
// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Fix Leaflet marker icons
// import iconUrl from 'leaflet/dist/images/marker-icon.png';
// import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
// import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl,
//   iconUrl,
//   shadowUrl,
// });

// // Component to center map on user location
// const SetUserLocation = ({ setUserPosition }) => {
//   const map = useMap();

//   useEffect(() => {
//     if (!navigator.geolocation) {
//       alert("Geolocation is not supported by your browser");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         const latlng = [latitude, longitude];
//         map.setView(latlng, 13);
//         setUserPosition(latlng);
//       },
//       (error) => {
//         alert("Unable to retrieve your location");
//         console.error(error);
//       }
//     );
//   }, [map, setUserPosition]);

//   return null;
// };

// const MyMap = () => {
//   const [userPosition, setUserPosition] = useState(null);

//   return (
//     <MapContainer center={[6.9271, 79.8612]} zoom={7} style={{ height: '600px', width: '100%' }}>
//       <TileLayer
//         attribution='&copy; OpenStreetMap contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       <SetUserLocation setUserPosition={setUserPosition} />
//       {userPosition && <Marker position={userPosition} />}
//     </MapContainer>
//   );
// };

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
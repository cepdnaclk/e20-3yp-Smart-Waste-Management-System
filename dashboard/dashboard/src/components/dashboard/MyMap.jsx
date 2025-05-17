// MyMap.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Component to center map on user location
const SetUserLocation = ({ setUserPosition }) => {
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const latlng = [latitude, longitude];
        map.setView(latlng, 13);
        setUserPosition(latlng);
      },
      (error) => {
        alert("Unable to retrieve your location");
        console.error(error);
      }
    );
  }, [map, setUserPosition]);

  return null;
};

const MyMap = () => {
  const [userPosition, setUserPosition] = useState(null);

  return (
    <MapContainer center={[6.9271, 79.8612]} zoom={7} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SetUserLocation setUserPosition={setUserPosition} />
      {userPosition && <Marker position={userPosition} />}
    </MapContainer>
  );
};

export default MyMap;

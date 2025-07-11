import { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";

const Maps = () => {
  const [position, setPosition] = useState({ lat: 7.2699, lng: 80.5938 });
  const [open, setOpen] = useState(false);

  const apiKey = import.meta.env.VITE_Maps_API_KEY;
  const mapId = import.meta.env.VITE_Maps_ID;

  const staticMarkers = [
    { lat: 7.2699, lng: 80.5938, color: "grey" },
    { lat: 7.2850, lng: 80.6, color: "red" },
    { lat: 7.25, lng: 80.59, color: "orange" },
    { lat: 7.275, lng: 80.58, color: "green" },
    { lat: 7.29, lng: 80.61, color: "yellow" },
    { lat: 7.265, lng: 80.6, color: "purple" },
    { lat: 7.28, lng: 80.62, color: "cyan" },
    { lat: 7.27, lng: 80.605, color: "pink" },
    { lat: 7.26, lng: 80.595, color: "brown" },
    { lat: 7.295, lng: 80.615, color: "lime" },
    { lat: 7.286, lng: 80.582, color: "magenta" },
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Error getting location:", err);
          setPosition({ lat: 7.2699, lng: 80.5938 }); // fallback
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  if (!apiKey || !mapId) {
    return <p>Error: Map API key or Map ID is missing.</p>;
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ height: "100vh", width: "100%" }}>
        <Map zoom={13} center={position} mapId={mapId}>
          {/* User's current location marker */}
          <AdvancedMarker position={position} onClick={() => setOpen(true)}>
            <Pin background="blue" borderColor="white" glyphColor="white" />
          </AdvancedMarker>

          {/* Static markers with unique colors */}
          {staticMarkers.map((marker, index) => (
            <AdvancedMarker key={index} position={{ lat: marker.lat, lng: marker.lng }}>
              <Pin
                background={marker.color}
                borderColor="black"
                glyphColor="white"
              />
            </AdvancedMarker>
          ))}

          {open && (
            <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
              <p>You are here</p>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
};

export default Maps;

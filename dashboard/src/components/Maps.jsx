import { useState, useEffect, useMemo } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

import "../styles/Maps.css"

// At the top of Maps.jsx

// Define the expanded list of stops for the route
const initialStops = [
  { lat: 7.2906, lng: 80.6337, label: "A" }, // Kandy City Center
  { lat: 7.2934, lng: 80.6414, label: "B" }, // Temple of the Tooth Relic
  { lat: 7.2714, lng: 80.6238, label: "C" }, // Peradeniya Botanical Gardens
  { lat: 7.2969, lng: 80.6384, label: "D" }, // Kandy View Point
  { lat: 7.2915, lng: 80.6298, label: "E" }, // Bahirawakanda Vihara Buddha Statue
  { lat: 7.2995, lng: 80.64},// Udawatta Kele Sanctuary
  { lat: 7.2686, lng: 80.6328, label: "G" }, // Ceylon Tea Museum
  { lat: 7.3005, lng: 80.3872, label: "H" }, // Pinnawala Elephant Orphanage
];

const Maps = () => {
  const apiKey = import.meta.env.VITE_Maps_API_KEY;
  if (!apiKey) {
    return <p>Error: Missing Google Maps API Key.</p>;
  }

  return (
    <APIProvider apiKey={apiKey} libraries={["geometry"]}>
      <MapWithRoute />
    </APIProvider>
  );
};

export default Maps;

// This component contains the full logic for the map and route
const MapWithRoute = () => {
  const [routePath, setRoutePath] = useState([]);
  const [optimizedMarkers, setOptimizedMarkers] = useState([]);
  const [info, setInfo] = useState({ distance: "", duration: "" });

  const geometry = useMapsLibrary("geometry");
  const apiKey = import.meta.env.VITE_Maps_API_KEY;
  const mapId = import.meta.env.VITE_Maps_ID;

  // Use the optimized list of markers if available, otherwise use the initial list
  const stops = useMemo(() => (optimizedMarkers.length ? optimizedMarkers : initialStops), [optimizedMarkers]);

  // Effect to fetch the route from Google's API when stops change
  useEffect(() => {
    if (!geometry || stops.length < 2 || !apiKey) return;

    const fetchRoute = async () => {
      const formatWaypoint = (stop) => ({
        location: { latLng: { latitude: stop.lat, longitude: stop.lng } },
      });

      const originWaypoint = formatWaypoint(stops[0]);
      const destinationWaypoint = formatWaypoint(stops[stops.length - 1]);
      const intermediateWaypoints = stops.slice(1, -1).map(formatWaypoint);

      try {
        const res = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.optimizedIntermediateWaypointIndex",
          },
          body: JSON.stringify({
            origin: originWaypoint,
            destination: destinationWaypoint,
            intermediates: intermediateWaypoints,
            travelMode: "DRIVE",
            routingPreference: "TRAFFIC_AWARE",
            optimizeWaypointOrder: true,
          }),
        });

        if (!res.ok) {
          const errorBody = await res.json();
          throw new Error(`Route request failed: ${errorBody.error?.message || 'Unknown error'}`);
        }

        const data = await res.json();
        const route = data.routes?.[0];
        if (!route) return;

        const decodedPath = google.maps.geometry.encoding.decodePath(route.polyline.encodedPolyline);
        setRoutePath(decodedPath);
        
        setInfo({
          distance: `${(route.distanceMeters / 1000).toFixed(1)} km`,
          duration: `${Math.round(parseInt(route.duration, 10) / 60)} mins`,
        });

        const origin = stops[0];
        const destination = stops[stops.length - 1];
        const intermediates = stops.slice(1, -1);
        
        const order = route.optimizedIntermediateWaypointIndex || [];
        const reorderedIntermediates = order.map(i => intermediates[i]);
        const newOptimizedStops = [ origin, ...reorderedIntermediates, destination ];
        
        const newOrder = newOptimizedStops.filter(Boolean).map(s => s.label).join('');
        const oldOrder = stops.filter(Boolean).map(s => s.label).join('');

        if (newOrder !== oldOrder) {
            setOptimizedMarkers(newOptimizedStops.filter(Boolean));
        }

      } catch (error) {
        console.error(error);
      }
    };

    fetchRoute();
  }, [geometry, stops, apiKey]);

  // Handler for when a marker is dragged to a new position
  const handleDragEnd = (idx, e) => {
    const updated = [...stops];
    updated[idx] = { ...updated[idx], lat: e.latLng.lat(), lng: e.latLng.lng() };
    setOptimizedMarkers(updated);
  };

  if (!mapId) return <p>Error: Missing Map ID.</p>;

  return (
    <div className="map-container-wrapper">
      <div className="map-sidebar">
        <h3>Stops</h3>
        <ol>
          {stops.map((s, i) => (
            <li key={`${s.label}-${i}`}>
              <b>{s.label}:</b> {s.lat.toFixed(4)}, {s.lng.toFixed(4)}
            </li>
          ))}
        </ol>
        <hr />
        <h4>Info:</h4>
        <p>
          <b>Distance:</b> {info.distance}
        </p>
        <p>
          <b>Duration:</b> {info.duration}
        </p>
      </div>

      <Map defaultZoom={12} defaultCenter={initialStops[0]} mapId={mapId}>
        {stops.map((s, i) => (
          <AdvancedMarker
            key={`${s.label}-${i}`}
            position={{ lat: s.lat, lng: s.lng }}
            draggable
            onDragEnd={(e) => handleDragEnd(i, e)}
          >
            <Pin background={"#4285F4"} borderColor={"white"} glyphColor={"white"}>
              {s.label}
            </Pin>
          </AdvancedMarker>
        ))}

        <DirectionsPolyline path={routePath} />
      </Map>
    </div>
  );
};

// Custom component to draw the route line on the map
function DirectionsPolyline({ path }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !path || path.length === 0) return;

    const polyline = new google.maps.Polyline({
      path: path,
      map: map,
      strokeColor: "#4285F4",
      strokeOpacity: 0.8,
      strokeWeight: 6,
    });

    return () => {
      polyline.setMap(null);
    };
  }, [map, path]);

  return null;
}
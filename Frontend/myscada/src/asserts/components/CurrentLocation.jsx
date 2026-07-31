import { Marker, Circle,Tooltip, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

const userIcon = L.divIcon({
  className: "user-marker",
  html: `<div class="user-dot"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const CurrentLocation = () => {
  const map = useMap();
  const [position, setPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      return;
    }

    navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setPosition([lat, lng]);
        setAccuracy(pos.coords.accuracy);

        // OPTIONAL: zoom to user once
        // map.setView([lat, lng], 10);
      },
      (err) => {
        console.error("Location error:", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }, [map]);

  if (!position) return null;

  return (
    <>
      <Marker position={position} icon={userIcon} >
        <Tooltip>
  You are here (approximate)
</Tooltip>
      </Marker>
      
      {accuracy && accuracy < 5000 && (
  <Circle
    center={position}
    radius={accuracy}
    pathOptions={{ color: "blue", fillOpacity: 0.115 }}
  />
)}
    </>
  );
};

export default CurrentLocation;

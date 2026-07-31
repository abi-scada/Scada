import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import BURL from "./URL";
import '../styles/MapView.css'
import { useNavigate } from "react-router-dom";
import CurrentLocation from "./CurrentLocation";
import "leaflet-velocity";
import MapCompass from "./MapCompass";


const RecenterButton = ({ machines }) => {
  const map = useMap();

  const handleRecenter = () => {
    if (!machines.length) return;

    const bounds = L.latLngBounds(
      machines?.map(m => [m.mc_lat, m.mc_long])
    );

    map.fitBounds(bounds, { padding: [50, 50] });
  };

  return (
    <button
      onClick={handleRecenter}
      className="recenter-btn"
    >
      Recenter Turbines
    </button>
  );
};

const getStyle = (mc) => {
  let style = "map_ro";

  if (!mc || !mc.status) {
    return style;
  }

  const status = mc.status.toUpperCase();
  const wind = Number(mc.wind || 0);

  if (status === "GRID DROP") {
    style += " blue";

  } else if (status !== "RUN") {
    style += " red";

  } else {
    // RUN state
    if (wind < 3) {
      style += " orange";
    }

    if (wind > 25) {
      style += " overWind";
    }
  }
  //console.log("style : "+ style)
  return style;
};

const createRotorIcon = (mc) =>{
  const sty = getStyle(mc);
  return L.divIcon({
    className: "rotor-marker",   
    html: `
      <div style="position: relative; width: 100px; height: 120px;">
        <img
          src="/icons/ro.png"
          class="${sty}"
          alt="rotor"
        />
        <div class="machine-label">
          ${mc.mc_name}
        </div>
      </div>

    `,
    iconSize: [150, 150],
    iconAnchor: [75, 75],          
    popupAnchor: [0, -50],
  });}


const FitBounds = ({ machines }) => {
  const map = useMap();
  const fittedRef = useRef(false);

  useEffect(() => {
    if (!machines.length || fittedRef.current ) return;//
    const bounds = L.latLngBounds(
  machines.map(m => [m.mc_lat, m.mc_long])
);
    //const bounds = machines.map(m => [m.mc_lat, m.mc_long]);
    map.fitBounds(bounds, { padding: [50, 50] });

    fittedRef.current = true;
  }, [machines]);

  return null;
};

const FixMapSize = () => {
  const map = useMap();

  useEffect(() => {
    const resize = () => {
      map.invalidateSize();
    };

    window.addEventListener("resize", resize);

    setTimeout(() => {
      map.invalidateSize();
    }, 500);

    return () => window.removeEventListener("resize", resize);
  }, [map]);

  return null;
};


const MapView = ({machine}) => {
  const [machines, setMachines] = useState([]);
  const [mapType, setMapType] = useState("normal");

  //console.log(userid);

  const navigate = useNavigate();
  
  
useEffect(()=>{
  setMachines(machine);
},[machine]);


  return (
    <div className="map_root">
      <MapContainer
      center={[8.34, 77.56]}
      zoom={11}
      className="map_container"
      preferCanvas={true}
      
    >
      <FixMapSize/>
      
      <div className="map-controls">
  <button onClick={() => setMapType("normal")}>Normal</button>
  <button onClick={() => setMapType("satellite")}>Satellite</button>
  <button onClick={() => setMapType("terrain")}>Terrain</button>
</div>

      
      {mapType === "normal" && (
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution="&copy; OpenStreetMap contributors"
  />
)}

{mapType === "satellite" && (
  <TileLayer
  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"

  //  url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
    attribution="© Google"
  />



)}


{mapType === "terrain" && (
  <TileLayer
    //url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
    attribution="&copy; OpenStreetMap HOT"
  />
)}

      <FitBounds machines={machines} />
      <CurrentLocation />
      <RecenterButton machines={machines} />
      <MapCompass />



      {machines?.map(machine => (
        <Marker
          key={machine.mid}
          position={[machine.mc_lat, machine.mc_long]}
          icon={createRotorIcon(machine)}
          eventHandlers={{
    click: () => navigate('/detailed', {state:machine})
  }}
        >
          <Tooltip direction="top">
            <b>{machine.mc_name.toUpperCase()}</b><br />
            {machine.status}<br />
    Wind: {machine.wind} m/s<br />
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
    </div>
  );
};

export default MapView;

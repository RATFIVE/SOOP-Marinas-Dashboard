"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import stationData from "@/data/station.json";
import L from 'leaflet';

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[üÜ]/g, 'ue')
    .replace(/[öÖ]/g, 'oe')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function LeafletMap({ center = [54.3233, 10.1228], zoom = 12, height = 450 }: { center?: [number, number]; zoom?: number; height?: number }) {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
  // Use a RAF to avoid SSR rendering differences
  let raf = requestAnimationFrame(() => setReady(true));
  return () => cancelAnimationFrame(raf);
    }
  }, []);
  if (typeof window === "undefined" || !ready) return <div style={{ width: "100%", height }} />;
  return (
    <div style={{ width: "100%", height }}>
      <MapContainer center={center} zoom={zoom} style={{ width: "100%", height: "100%", borderRadius: "0.5rem" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {((stationData as any).stations || []).map((s: any, i: number) => {
          const coords = s.location?.coordinates;
          if (!coords || coords.length < 2) return null;
          const lat = coords[0];
          const lon = coords[1];
          const slug = slugify(s.name);
          // use a DivIcon with inline SVG to avoid loading external PNG assets from node_modules
          const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 24 24">
              <path d="M12 2C8 2 5 5 5 9c0 6 7 13 7 13s7-7 7-13c0-4-3-7-7-7z" fill="#2563eb"/>
              <circle cx="12" cy="9" r="2.5" fill="#ffffff"/>
            </svg>
          `;
          const icon = L.divIcon({
            html: svg,
            className: '',
            iconSize: [28, 36],
            iconAnchor: [14, 36],
            popupAnchor: [0, -36],
          });

          return (
            <Marker key={slug || i} position={[lat, lon]} icon={icon}>
              <Popup>
                <div className="max-w-xs">
                  <div className="font-bold">{s.name}</div>
                  <div className="text-xs text-gray-500">{lat}, {lon}</div>
                  <div className="mt-2">
                    <a className="text-blue-600 underline" href={`/stations/${slug}`}>Details</a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import stationData from "@/data/station.json";

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
          return (
            <Marker key={slug || i} position={[lat, lon]}>
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

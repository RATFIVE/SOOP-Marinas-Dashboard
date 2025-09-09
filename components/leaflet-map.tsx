"use client";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";

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
      </MapContainer>
    </div>
  );
}

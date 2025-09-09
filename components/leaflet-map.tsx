"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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

function FitBounds({ coordsList, meanCenter, bounds, zoom }: { coordsList: [number, number][]; meanCenter?: [number, number]; bounds?: L.LatLngBounds; zoom: number }) {
  const map = useMap();
  React.useEffect(() => {
    if (!map) return;
    try {
      if (bounds) {
        const neededZoom = map.getBoundsZoom(bounds, false);
        map.setView(meanCenter as L.LatLngExpression, neededZoom);
      } else if (coordsList.length === 1) {
        map.setView(coordsList[0] as L.LatLngExpression, zoom);
      }
    } catch (e) {
      // ignore
    }
  }, [map, coordsList, meanCenter, bounds, zoom]);
  return null;
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

  // compute coords and mean center
  const coordsList: [number, number][] = ((stationData as any).stations || [])
    .map((s: any) => s.location?.coordinates)
    .filter((c: any) => Array.isArray(c) && c.length >= 2)
    .map((c: any) => [c[0], c[1]] as [number, number]);

  let meanCenter: [number, number] | undefined = undefined;
  if (coordsList.length > 0) {
    const sum = coordsList.reduce((acc, cur) => [acc[0] + cur[0], acc[1] + cur[1]], [0, 0]);
    meanCenter = [sum[0] / coordsList.length, sum[1] / coordsList.length];
  }

  // bounds to calculate needed zoom
  let bounds: L.LatLngBounds | undefined = undefined;
  if (coordsList.length > 1) bounds = L.latLngBounds(coordsList as L.LatLngExpression[]);

  return (
    <div style={{ width: "100%", height }}>
      <MapContainer center={meanCenter || center} zoom={zoom} style={{ width: "100%", height: "100%", borderRadius: "0.5rem" }}>
        {/* FitBounds adjusts the map view after the map is ready */}
        <FitBounds coordsList={coordsList} meanCenter={meanCenter} bounds={bounds} zoom={zoom} />
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
                    <a className="text-accent underline" href={`/stations/${slug}`}>Details</a>
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

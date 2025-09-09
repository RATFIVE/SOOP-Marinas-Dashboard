"use client";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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
        {(() => {
          // SafeMarker waits until the map's tooltip pane exists before rendering the Tooltip
          function SafeMarker({ position, icon, slug, station }: { position: [number, number]; icon: L.DivIcon; slug: string; station: any }) {
            const map = useMap();
            const [paneReady, setPaneReady] = React.useState(false);
            React.useEffect(() => {
              if (!map) return;
              try {
                if (map.getPane && map.getPane('tooltipPane')) {
                  setPaneReady(true);
                  return;
                }
              } catch (e) {
                // ignore
              }
              const id = window.setInterval(() => {
                try {
                  if (map.getPane && map.getPane('tooltipPane')) {
                    setPaneReady(true);
                    clearInterval(id);
                  }
                } catch (e) {}
              }, 50);
              return () => clearInterval(id);
            }, [map]);

            return (
              <Marker position={position} icon={icon} eventHandlers={{ click: () => router.push(`/stations/${slug}`) }}>
                {paneReady ? (
                  <Tooltip direction="top" offset={[0, -52]} opacity={1}>
                    <div className="inline-block max-w-xs">
                      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-3">
                        <div className="font-bold">{station.name}</div>
                        <div className="text-xs text-gray-500">{position[0]}, {position[1]}</div>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{station.info}</p>
                      </div>
                    </div>
                  </Tooltip>
                ) : null}
              </Marker>
            );
          }

          return ((stationData as any).stations || []).map((s: any, i: number) => {
            const coords = s.location?.coordinates;
            if (!coords || coords.length < 2) return null;
            const lat = coords[0];
            const lon = coords[1];
            const slug = slugify(s.name);
            // use a DivIcon with inline SVG to avoid loading external PNG assets from node_modules
            const svg = `
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 24 24">
                <path d="M12 2C8 2 5 5 5 9c0 6 7 13 7 13s7-7 7-13c0-4-3-7-7-7z" fill="var(--destructive)"/>
                <circle cx="12" cy="9" r="3.5" fill="var(--primary-foreground)"/>
              </svg>
            `;
            const icon = L.divIcon({
              html: svg,
              className: '',
              iconSize: [40, 52],
              iconAnchor: [20, 52],
              popupAnchor: [0, -52],
            });

            return (
              <SafeMarker key={slug || i} position={[lat, lon]} icon={icon} slug={slug} station={s} />
            );
          });
        })()}
      </MapContainer>
    </div>
  );
}

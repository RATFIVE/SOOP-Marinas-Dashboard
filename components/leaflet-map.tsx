"use client";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import stationData from "@/data/station.json";
import typedStations from '@/lib/station';
import { useRouter } from "next/navigation";
import StationCard from "@/components/station-card";
import { createRoot, Root } from "react-dom/client";

type Props = {
  center?: [number, number];
  zoom?: number;
  height?: number | "full";
  single?: boolean;
  /** Tile-Stil: 'osm' (Standard), 'grey' (CartoDB Positron), 'dark' (CartoDB Dark Matter) */
  tiles?: 'osm' | 'grey' | 'dark';
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/Ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/Ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/Ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// custom green pin (SVG) similar to previous design
const markerSvg = encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='#78D278' d='M12 2C8 2 5 5 5 9c0 6 7 13 7 13s7-7 7-13c0-4-3-7-7-7z'/><circle fill='#ffffff' cx='12' cy='9' r='3.5'/></svg>"
);
const stationIcon = L.icon({
  iconUrl: `data:image/svg+xml;utf8,${markerSvg}`,
  iconSize: [32, 44],
  iconAnchor: [16, 44],
  popupAnchor: [0, -44]
});

export default function LeafletMap({ center = [54.3233, 10.1228], zoom = 7, height = "full", single = false, tiles = 'grey' }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [ready, setReady] = useState(false);

  // defer until client
  useEffect(() => { if (typeof window !== "undefined") setReady(true); }, []);

  // initialize map
  useEffect(() => {
    if (!ready || !containerRef.current) return;
    // cleanup existing
    if (mapRef.current) { try { mapRef.current.remove(); } catch (_) {} mapRef.current = null; }

    const c = containerRef.current;
    if (typeof height === "number") {
      c.style.height = `${height}px`;
    } else if (height === "full") {
      c.style.height = "100%";
    } else {
      // fallback numeric default when height is undefined
      c.style.height = `500px`;
    }
    c.style.width = "100%";

    const map = L.map(c, { zoomControl: false, attributionControl: true });
    mapRef.current = map;
    map.setView([center[0], center[1]], zoom);
    L.control.zoom({ position: "topright" }).addTo(map);

    // Tile-Layer Auswahl
    let tileUrl: string;
    let attribution = "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors";
    switch (tiles) {
      case 'grey':
        tileUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
        attribution += " &copy; <a href='https://carto.com/attributions'>CARTO</a>";
        break;
      case 'dark':
        tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
        attribution += " &copy; <a href='https://carto.com/attributions'>CARTO</a>";
        break;
      case 'osm':
      default:
        tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        break;
    }
    L.tileLayer(tileUrl, { maxZoom: 19, attribution }).addTo(map);

    // add markers
    const stations = typedStations.filter(s => s.location?.coordinates && s.location.coordinates.length >= 2);
    const markers: L.Marker[] = [];

    const popupRoots: Root[] = [];

    function addStation(lat: number, lon: number, name: string, status: 'online' | 'offline' = 'offline', info?: string) {
      const marker = L.marker([lat, lon], { icon: stationIcon }).addTo(map);
      markers.push(marker);

      // React StationCard im Popup rendern, damit Stil identisch zur Kachel ist
      const el = document.createElement('div');
      el.className = 'leaflet-station-popup react-station-card';
      const root = createRoot(el);
      popupRoots.push(root);
      const slug = slugify(name);
      const metrics = [
        { label: 'Lat', value: lat.toFixed(4) },
        { label: 'Lon', value: lon.toFixed(4) }
      ];
      root.render(
        <StationCard
          name={name}
          lat={lat}
          lon={lon}
          online={status === 'online'}
          metrics={metrics}
          lastUpdateISO={new Date().toISOString()}
          compact
          onMoreDetails={() => { try { router.push(`/stations/${slug}`); } catch (_) {} }}
        />
      );
      marker.bindPopup(el, { maxWidth: 340, className: 'station-popup-wrapper' });
    }

    if (single) {
      addStation(center[0], center[1], "Station");
    } else {
      for (const s of stations) {
        if (s.location?.coordinates && s.location.coordinates.length >= 2) {
          const [lat, lon] = [Number(s.location.coordinates[0]), Number(s.location.coordinates[1])];
          addStation(lat, lon, s.name || "Station", s.status || 'offline', s.info);
        }
      }
    }

    // fit bounds if multiple
    try {
      if (!single && stations.length > 1) {
        const bounds = L.latLngBounds(stations.map((s: any) => [s.location.coordinates[0], s.location.coordinates[1]]));
        map.fitBounds(bounds.pad(0.08));
      }
    } catch (_) {}

  // Keine Delegation mehr nötig – Button ist Teil der React-Komponente.

    return () => {
      markers.forEach(m => { try { m.remove(); } catch (_) {} });
      try { map.remove(); } catch (_) {}
    };
  }, [ready, JSON.stringify(center), zoom, single, router]);

  // react to height prop changes without kompletten Neuaufbau
  useEffect(() => {
    if (!mapRef.current || !containerRef.current) return;
    const c = containerRef.current;
    if (typeof height === 'number') c.style.height = `${height}px`; else if (height === 'full') c.style.height = '100%';
    try { mapRef.current.invalidateSize(); } catch (_) {}
  }, [height]);

  return <div ref={containerRef} />;
}

"use client";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import stationData from "@/data/station.json";
import { useRouter } from "next/navigation";

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
    const stations = ((stationData as any).stations || []).filter((s: any) => s.location?.coordinates?.length >= 2);
    const markers: L.Marker[] = [];

    function addStation(lat: number, lon: number, name: string, info?: string) {
      const marker = L.marker([lat, lon], { icon: stationIcon }).addTo(map);
      markers.push(marker);
      marker.on("click", () => { try { router.push(`/stations/${slugify(name)}`); } catch (_) {} });
      marker.bindPopup(`\n        <div class='leaflet-station-popup'>\n          <div class='font-bold mb-1'>${name}</div>\n          <div class='text-xs text-gray-500 dark:text-gray-400'>${lat.toFixed(4)}, ${lon.toFixed(4)}</div>\n          ${info ? `<p class='mt-2 text-sm'>${info}</p>` : ""}\n          <button data-slug='${slugify(name)}' class='mt-3 w-full bg-[var(--primary)] text-white text-xs py-1 px-2'>Details</button>\n        </div>`);
    }

    if (single) {
      addStation(center[0], center[1], "Station");
    } else {
      for (const s of stations) {
        const [lat, lon] = [Number(s.location.coordinates[0]), Number(s.location.coordinates[1])];
        addStation(lat, lon, s.name || "Station", s.info);
      }
    }

    // fit bounds if multiple
    try {
      if (!single && stations.length > 1) {
        const bounds = L.latLngBounds(stations.map((s: any) => [s.location.coordinates[0], s.location.coordinates[1]]));
        map.fitBounds(bounds.pad(0.08));
      }
    } catch (_) {}

    // delegate click from popup button
    map.on("popupopen", (e: any) => {
      const node = e.popup.getElement();
      if (!node) return;
      const btn = node.querySelector("button[data-slug]") as HTMLButtonElement | null;
      if (btn) {
        btn.addEventListener("click", () => {
          const slug = btn.getAttribute("data-slug");
          if (slug) router.push(`/stations/${slug}`);
        }, { once: true });
      }
    });

    return () => {
      markers.forEach(m => { try { m.remove(); } catch (_) {} });
      try { map.remove(); } catch (_) {}
    };
  }, [ready, JSON.stringify(center), zoom, single, router]);

  return <div ref={containerRef} />;
}

"use client";
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRouter } from 'next/navigation';
import stationData from '@/data/station.json';
import { useTheme } from 'next-themes';

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/Ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/Ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/Ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

type Props = { center?: [number, number]; zoom?: number; height?: number | 'full' };

export default function MapboxMap({ center = [54.3233, 10.1228], zoom = 7, height = 'full' }: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const hoverPopupRef = useRef<mapboxgl.Popup | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!ready || !mapContainerRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
    if (!token) return;
    mapboxgl.accessToken = token;

    const dayStyle = process.env.NEXT_PUBLIC_MAPBOX_STYLE_DAY || 'mapbox://styles/mapbox/light-v10';
    const nightStyle = process.env.NEXT_PUBLIC_MAPBOX_STYLE_NIGHT || process.env.NEXT_PUBLIC_MAPBOX_STYLE || 'mapbox://styles/mapbox/dark-v10';

    let isDark = (resolvedTheme === 'dark' || theme === 'dark');
    if (typeof resolvedTheme === 'undefined' || resolvedTheme === null) {
      try {
        const html = document.documentElement;
        const body = document.body;
        const hasDark = html.classList.contains('dark') || body.classList.contains('dark') || Array.from(body.classList).some(c => c.startsWith('theme-') && c.includes('dark'));
        isDark = hasDark;
      } catch (e) {
        // ignore
      }
    }

    const initialStyle = isDark ? nightStyle : dayStyle;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: [center[1], center[0]],
      zoom,
    });
    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

    map.on('load', () => {
      try { map.resize(); } catch (e) {}
    });

    map.on('error', (e: any) => {
      const raw = e && (e.error || e).message ? (e.error || e).message : '';
      if (/unauthorized|token|authorization/i.test(String(raw))) {
        try { map.setStyle('mapbox://styles/mapbox/streets-v12'); } catch (er) {}
      }
    });

    const clearMarkers = () => {
      try {
        for (const m of markersRef.current) {
          try { m.remove(); } catch (e) {}
        }
      } catch (e) {}
      markersRef.current = [];
    };

    const addMarkers = (targetMap: mapboxgl.Map) => {
      try {
        clearMarkers();
        const stations = ((stationData as any).stations || []).filter((s: any) => s.location && Array.isArray(s.location.coordinates) && s.location.coordinates.length >= 2);
        for (const s of stations) {
          try {
            const lng = s.location.coordinates[1];
            const lat = s.location.coordinates[0];
            const el = document.createElement('div');
            el.className = 'station-marker';
            el.style.width = '40px';
            el.style.height = '52px';
            el.style.cursor = 'pointer';
            el.style.display = 'flex';
            el.style.alignItems = 'center';
            el.style.justifyContent = 'center';
            el.setAttribute('title', s.name || 'Station');
            el.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='32' height='32'><path style="fill:#78D278" d='M12 2C8 2 5 5 5 9c0 6 7 13 7 13s7-7 7-13c0-4-3-7-7-7z'/><circle style="fill:#ffffff" cx='12' cy='9' r='3.5'/></svg>`;

            const marker = new mapboxgl.Marker({ element: el }).setLngLat([lng, lat]).addTo(targetMap);
            markersRef.current.push(marker);

            el.addEventListener('mouseenter', () => {
              try {
                const popupHtml = `<div class="bg-white dark:bg-zinc-900 rounded-lg shadow p-3 max-w-xs"><div class="font-bold">${s.name || ''}</div><div class="text-xs text-gray-500">${lat.toFixed(4)}, ${lng.toFixed(4)}</div><p class="mt-2 text-sm text-gray-700 dark:text-gray-300">${s.info || ''}</p></div>`;
                if (!hoverPopupRef.current) hoverPopupRef.current = new mapboxgl.Popup({ offset: 8, closeButton: false, closeOnClick: false });
                hoverPopupRef.current.setLngLat([lng, lat]).setHTML(popupHtml).addTo(targetMap);
              } catch (e) {}
            });
            el.addEventListener('mouseleave', () => {
              try { if (hoverPopupRef.current) { hoverPopupRef.current.remove(); hoverPopupRef.current = null; } } catch (e) {}
            });
            el.addEventListener('click', () => {
              try {
                const popupHtml = `<div class="bg-white dark:bg-zinc-900 rounded-lg shadow p-3"><div class="font-bold">${s.name || ''}</div><div class="text-xs text-gray-500">${lat.toFixed(4)}, ${lng.toFixed(4)}</div><p class="mt-2 text-sm text-gray-700 dark:text-gray-300">${s.info || ''}</p></div>`;
                new mapboxgl.Popup({ offset: 20, closeButton: false }).setLngLat([lng, lat]).setHTML(popupHtml).addTo(targetMap);
                try { router.push(`/stations/${slugify(s.name || '')}`); } catch (e) {}
              } catch (e) {}
            });
          } catch (e) {
            console.debug('[Mapbox] create marker failed', e);
          }
        }
      } catch (e) {
        console.debug('[Mapbox] addMarkers failed', e);
      }
    };

    map.once('styledata', () => addMarkers(map));

    // fit to stations
    try {
      const stations = ((stationData as any).stations || []).filter((s: any) => s.location && Array.isArray(s.location.coordinates) && s.location.coordinates.length >= 2);
      const coords: [number, number][] = stations.map((s: any) => [s.location.coordinates[1], s.location.coordinates[0]]);
      if (coords.length === 1) {
        map.setCenter(coords[0]);
        map.setZoom(zoom);
      } else if (coords.length > 1) {
        const bounds = coords.reduce((b, c) => b.extend(c as [number, number]), new mapboxgl.LngLatBounds(coords[0], coords[0]));
        map.fitBounds(bounds, { padding: 40 });
      }
    } catch (e) {
      // ignore
    }

    return () => {
      try { markersRef.current.forEach(m => { try { m.remove(); } catch (e) {} }); } catch (e) {}
      try { map.remove(); } catch (e) {}
      mapRef.current = null;
    };
  }, [ready, center, zoom]);

  useEffect(() => {
    const m = mapRef.current;
    if (!m) return;
    const dayStyle = process.env.NEXT_PUBLIC_MAPBOX_STYLE_DAY || 'mapbox://styles/mapbox/light-v10';
    const nightStyle = process.env.NEXT_PUBLIC_MAPBOX_STYLE_NIGHT || process.env.NEXT_PUBLIC_MAPBOX_STYLE || 'mapbox://styles/mapbox/dark-v10';
    const isDark = (resolvedTheme === 'dark' || theme === 'dark');
    const targetStyle = isDark ? nightStyle : dayStyle;
    try {
      try { markersRef.current.forEach(mk => { try { mk.remove(); } catch (e) {} }); markersRef.current = []; } catch (e) {}
      m.setStyle(targetStyle);
      m.once('styledata', () => {
        try {
          // re-add markers after style change
          const stations = ((stationData as any).stations || []).filter((s: any) => s.location && Array.isArray(s.location.coordinates) && s.location.coordinates.length >= 2);
          for (const s of stations) {
            try {
              const lng = s.location.coordinates[1];
              const lat = s.location.coordinates[0];
              const el = document.createElement('div');
              el.className = 'station-marker';
              el.style.width = '40px';
              el.style.height = '52px';
              el.style.cursor = 'pointer';
              el.style.display = 'flex';
              el.style.alignItems = 'center';
              el.style.justifyContent = 'center';
              el.setAttribute('title', s.name || 'Station');
              el.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='32' height='32'><path style="fill:#78D278" d='M12 2C8 2 5 5 5 9c0 6 7 13 7 13s7-7 7-13c0-4-3-7-7-7z'/><circle style="fill:#ffffff" cx='12' cy='9' r='3.5'/></svg>`;
              const marker = new mapboxgl.Marker({ element: el }).setLngLat([lng, lat]).addTo(m);
              markersRef.current.push(marker);
            } catch (e) {}
          }
        } catch (e) {}
      });
    } catch (e) {
      console.debug('[Mapbox] setStyle failed', e);
    }
  }, [theme, resolvedTheme]);

  const containerStyle: React.CSSProperties = { width: '100%', height: '100%' };
  if (typeof height === 'number') containerStyle.height = `${height}px`;
  return <div style={containerStyle} ref={mapContainerRef} />;
}

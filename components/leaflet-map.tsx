"use client";
import React from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRouter } from "next/navigation";
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

export default function LeafletMap({ center = [54.3233, 10.1228], zoom = 7, height = 450 }: { center?: [number, number]; zoom?: number; height?: number }) {
  const mapContainerRef = React.useRef<HTMLDivElement | null>(null);
  const mapRef = React.useRef<mapboxgl.Map | null>(null);
  const router = useRouter();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  React.useEffect(() => {
    if (!ready || !mapContainerRef.current) return;

    // Ensure container has explicit layout styles before map initialization
    const contEl = mapContainerRef.current as HTMLElement;
    try {
      contEl.style.position = contEl.style.position || 'relative';
      // ensure height is a CSS value with px if number
      if (typeof height === 'number') {
        contEl.style.height = `${height}px`;
        contEl.style.minHeight = `${height}px`;
      } else if (typeof height === 'string') {
        contEl.style.height = height;
        contEl.style.minHeight = height;
      }
      contEl.style.width = contEl.style.width || '100%';
    } catch (err) {
      console.debug('[Mapbox] container style set failed', err);
    }

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
    if (!token) {
      // If no token is set, do nothing (user should provide NEXT_PUBLIC_MAPBOX_TOKEN)
      return;
    }

    try {
      mapboxgl.accessToken = token;
  const mapStyle = process.env.NEXT_PUBLIC_MAPBOX_STYLE || "mapbox://styles/r4tfiv3/cmfdp87zu008k01s3bng41hk8";
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center: [center[1], center[0]], // mapbox expects [lng, lat]
        zoom,
      });
      mapRef.current = map;
      map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

      // Debugging: log when the style loads and capture errors
  map.on('load', () => {
        try {
          // style may not have a name field; log available info
          console.debug('[Mapbox] style loaded', map.getStyle && map.getStyle());
          try {
            const canvas = map.getCanvas();
            if (canvas) {
              // ensure canvas is visible and above background
              canvas.style.backgroundColor = canvas.style.backgroundColor || 'transparent';
              canvas.style.zIndex = canvas.style.zIndex || '0';
              // Mapbox sets position absolute; keep that but ensure correct stacking
              canvas.style.position = canvas.style.position || 'absolute';
              console.debug('[Mapbox] canvas element set visible styles', { width: canvas.width, height: canvas.height });
            } else {
              console.debug('[Mapbox] no canvas element available');
            }
            // ensure container has a fallback background so map tiles contrast
            if (map.getContainer()) {
              const cont = map.getContainer() as HTMLElement;
              cont.style.backgroundColor = cont.style.backgroundColor || 'rgba(10,12,14,0.05)';
            }
          } catch (err) {
            console.debug('[Mapbox] canvas/style tweak failed', err);
          }
        } catch (err) {
          console.debug('[Mapbox] style loaded (no style info)');
        }
      });

      // Try to apply the Dusk basemap preset via setConfigProperty (if supported)
      try {
        const anyMap = map as any;
        if (typeof anyMap.setConfigProperty === 'function') {
          try {
            anyMap.setConfigProperty('basemap', 'lightPreset', 'dusk');
            anyMap.setConfigProperty('basemap', 'showPlaceLabels', true);
            anyMap.setConfigProperty('basemap', 'showPointOfInterestLabels', true);
            anyMap.setConfigProperty('basemap', 'showRoadLabels', true);
            anyMap.setConfigProperty('basemap', 'showTransitLabels', true);
            console.debug('[Mapbox] requested basemap dusk preset via setConfigProperty');
          } catch (e) {
            console.debug('[Mapbox] setConfigProperty call failed', e);
          }
        } else {
          console.debug('[Mapbox] setConfigProperty not available on this map instance');
        }
      } catch (err) {
        console.debug('[Mapbox] setConfigProperty detection failed', err);
      }

      // Add an OSM raster layer as a fallback so tiles are visible — do it after style has loaded
      try {
        if (!map.getSource('osm-tiles')) {
          map.addSource('osm-tiles', {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
          });
          const beforeId = (map.getStyle && map.getStyle().layers && map.getStyle().layers.length) ? map.getStyle().layers[0].id : undefined;
          try {
            map.addLayer({ id: 'osm-tiles', type: 'raster', source: 'osm-tiles' }, beforeId);
            console.debug('[Mapbox] OSM raster fallback added on load');
          } catch (addErr) {
            // sometimes adding a layer during load can fail; attempt again on next tick
            setTimeout(() => {
              try {
                if (!map.getLayer('osm-tiles')) map.addLayer({ id: 'osm-tiles', type: 'raster', source: 'osm-tiles' }, beforeId);
                console.debug('[Mapbox] OSM raster fallback added on timeout');
              } catch (e) {
                console.debug('[Mapbox] adding OSM fallback failed again', e);
              }
            }, 200);
          }
        }
      } catch (err) {
        console.debug('[Mapbox] adding OSM fallback failed', err);
      }

      // Ensure map canvas is properly resized after load (fixes invisible tiles when container was resized)
      try {
        setTimeout(() => {
          try {
            map.resize();
            console.debug('[Mapbox] map.resize() called after load');
          } catch (e) {
            console.debug('[Mapbox] map.resize failed', e);
          }
        }, 100);
      } catch (e) {}

      map.on('error', (e) => {
        try {
          console.error('[Mapbox] map error', e);
          const rawMsg = e && (e.error || e).message ? (e.error || e).message : '';
          const status = (e && e.error && (e.error as any).status) || (rawMsg && /404/.test(String(rawMsg)) ? 404 : undefined);

          // If style failed due to token/authorization, or style not found (404), fallback to streets style
          if (/unauthorized|token|authorization/i.test(String(rawMsg)) || status === 401) {
            try {
              console.warn('[Mapbox] style load failed (auth), falling back to streets-v12');
              map.setStyle('mapbox://styles/mapbox/streets-v12');
            } catch (ex) {
              console.error('[Mapbox] fallback style set failed', ex);
            }
            return;
          }

          if (/not\s*found|404/i.test(String(rawMsg)) || status === 404) {
            try {
              console.warn('[Mapbox] style not found (404), falling back to streets-v12 and adding OSM fallback');
              map.setStyle('mapbox://styles/mapbox/streets-v12');
            } catch (ex) {
              console.error('[Mapbox] fallback style set failed', ex);
            }

            // also attempt to add an OSM raster layer after a short delay in case style failed completely
            setTimeout(() => {
              try {
                if (!map.getSource('osm-tiles')) {
                  map.addSource('osm-tiles', {
                    type: 'raster',
                    tiles: [
                      'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                      'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                      'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    ],
                    tileSize: 256,
                  });
                  try {
                    const beforeId = (map.getStyle && map.getStyle().layers && map.getStyle().layers.length) ? map.getStyle().layers[0].id : undefined;
                    if (!map.getLayer('osm-tiles')) map.addLayer({ id: 'osm-tiles', type: 'raster', source: 'osm-tiles' }, beforeId);
                    console.debug('[Mapbox] OSM raster fallback added on error handler');
                  } catch (addErr) {
                    console.debug('[Mapbox] adding OSM fallback on error failed', addErr);
                  }
                }
              } catch (ex2) {
                console.debug('[Mapbox] OSM fallback setup failed in error handler', ex2);
              }
            }, 300);
          }
        } catch (ex) {
          console.error('[Mapbox] error handler failed', ex);
        }
      });

      const stations = ((stationData as any).stations || []).filter((s: any) => s.location && Array.isArray(s.location.coordinates) && s.location.coordinates.length >= 2);
      const coords: [number, number][] = stations.map((s: any) => [s.location.coordinates[1], s.location.coordinates[0]]);

      if (coords.length === 1) {
        map.setCenter(coords[0]);
        map.setZoom(zoom);
      } else if (coords.length > 1) {
        const bounds = coords.reduce((b, c) => b.extend(c as [number, number]), new mapboxgl.LngLatBounds(coords[0], coords[0]));
        map.fitBounds(bounds, { padding: 40 });
      }

      // Create a GeoJSON source for stations and add as a symbol layer (better than many individual Markers)
      try {
        const features = stations.map((s: any) => {
          const [lng, lat] = [s.location.coordinates[1], s.location.coordinates[0]];
          return {
            type: 'Feature',
            properties: { name: s.name, info: s.info },
            geometry: { type: 'Point', coordinates: [lng, lat] }
          };
        });

        const geojson = { type: 'FeatureCollection', features } as GeoJSON.FeatureCollection;

        if (!map.getSource('stations')) {
          map.addSource('stations', { type: 'geojson', data: geojson as any });
        } else {
          (map.getSource('stations') as any).setData(geojson as any);
        }

        // create an image from SVG data URL and add to the map
        const svg = `<?xml version="1.0" encoding="utf-8"?><svg xmlns='http://www.w3.org/2000/svg' width='40' height='52' viewBox='0 0 24 24'><path d='M12 2C8 2 5 5 5 9c0 6 7 13 7 13s7-7 7-13c0-4-3-7-7-7z' fill='%23ff6666'/><circle cx='12' cy='9' r='3.5' fill='%23ffffff'/></svg>`;
        const img = new Image();
        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
        img.onload = () => {
          try {
            if (!map.hasImage('station-icon')) map.addImage('station-icon', img, { sdf: false });
            if (!map.getLayer('stations-layer')) {
              map.addLayer({
                id: 'stations-layer',
                type: 'symbol',
                source: 'stations',
                layout: {
                  'icon-image': 'station-icon',
                  'icon-size': 1,
                  'icon-allow-overlap': true,
                  'icon-ignore-placement': true,
                  'icon-anchor': 'bottom'
                }
              });
            }
          } catch (e) {
            console.debug('[Mapbox] adding station icon/layer failed', e);
          }
        };

        // click handler: open popup and navigate
        map.on('click', 'stations-layer', (e: any) => {
          try {
            const feat = e.features && e.features[0];
            if (!feat) return;
            const coords = (feat.geometry && feat.geometry.coordinates) || e.lngLat;
            const props = feat.properties || {};
            const popupHtml = `<div class="bg-white dark:bg-zinc-900 rounded-lg shadow p-3"><div class="font-bold">${props.name || ''}</div><div class="text-xs text-gray-500">${coords[1]}, ${coords[0]}</div><p class="mt-2 text-sm text-gray-700 dark:text-gray-300">${props.info || ''}</p></div>`;
            new mapboxgl.Popup({ offset: 20, closeButton: false }).setLngLat(coords).setHTML(popupHtml).addTo(map);
            // navigate to detail page
            try { router.push(`/stations/${slugify(props.name || '')}`); } catch (navErr) { /* ignore */ }
          } catch (err) {
            console.debug('[Mapbox] stations layer click failed', err);
          }
        });

        // change cursor on hover
        map.on('mouseenter', 'stations-layer', () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', 'stations-layer', () => { map.getCanvas().style.cursor = ''; });
      } catch (err) {
        console.debug('[Mapbox] adding stations layer failed', err);
      }

      return () => {
        try {
          map.remove();
        } catch (e) {}
        mapRef.current = null;
      };
    } catch (e) {
      console.error('[Mapbox] initialization error', e);
    }
  }, [ready, center, zoom, router]);

  return <div style={{ width: '100%', height }} ref={mapContainerRef} />;
}

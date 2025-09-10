
"use client";


import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import dynamic from "next/dynamic";
import stationData from '@/data/station.json';
type RawStation = { name: string; location?: { coordinates?: number[] } };
import StationCard from "@/components/station-card";
import { useEffect, useState } from 'react';

function toRad(v: number) { return v * Math.PI / 180; }
function haversine([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]) {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

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

const MapboxMap = dynamic(() => import("@/components/mapbox-map"), { ssr: false });

export default function OverviewPage() {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [nearest, setNearest] = useState<any | null>(null);

  useEffect(() => {
    // try to get geolocation (user must allow)
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const p: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserPos(p);
        },
        () => {
          setUserPos(null);
        },
        { enableHighAccuracy: false, maximumAge: 1000 * 60 * 5, timeout: 5000 }
      );
      // no cleanup necessary for getCurrentPosition
      return;
    }
    setUserPos(null);
  }, []);

  useEffect(() => {
    const stations = (stationData as unknown as { stations?: RawStation[] }).stations || [];
    if (userPos) {
      let best = null;
      let bestDist = Infinity;
      for (const s of stations) {
        const coords = s.location?.coordinates;
        if (!coords || coords.length < 2) continue;
        const dist = haversine(userPos, [coords[0], coords[1]]);
        // debug log
        try { console.debug('distance to', s.name, coords, dist); } catch (e) {}
        if (dist < bestDist) { bestDist = dist; best = { station: s, dist }; }
      }
      try { console.debug('userPos', userPos, 'best', best?.station?.name, 'bestDist', bestDist); } catch (e) {}
      setNearest(best);
    } else {
      // fallback: pick first station
      if (stations.length > 0) setNearest({ station: stations[0], dist: null });
    }
  }, [userPos]);
  return (
    <SidebarProvider
      style={
  // @ts-expect-error
        {"--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)"}
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold mb-6 text-[var(--primary)]">Overview</h1>
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow mb-6 overflow-hidden" style={{ height: 500 }}>
                  <div className="w-full h-full">
                    <MapboxMap />
                  </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Nearest Station</h2>
                  <div>
                    {nearest ? (
                      (() => {
                        const s = nearest.station;
                        const coords = s.location?.coordinates || [];
                        return (
                          <StationCard
                            name={s.name}
                            lat={coords[0] ?? 0}
                            lon={coords[1] ?? 0}
                            online={true}
                            metrics={[
                              { label: 'Average wind', value: '—' },
                              { label: 'Temperature', value: '—' },
                              { label: 'Water level', value: '—' },
                              { label: 'Salinity', value: '—' },
                            ]}
                            lastUpdateISO={new Date().toISOString()}
                            onMoreDetails={() => { window.location.href = `/stations/${slugify(s.name || '')}` }}
                          />
                        );
                      })()
                    ) : (
                      <div>No station available.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

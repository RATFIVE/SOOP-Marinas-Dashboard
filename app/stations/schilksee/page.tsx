"use client";
import stations from '@/lib/station';
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState, useRef, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getSidebarStyle } from '@/lib/ui';
import useThingObservations from '@/lib/useFrost';
import StationMapCard from '@/components/station-map-card';

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

export default function SchilkseePage() {
  const [selectedMetric, setSelectedMetric] = useState("wind");
  const [selectedRange, setSelectedRange] = useState("24h");
  const stationsList = stations || [];
  const station = stationsList.find((s) => slugify(s.name || '') === 'schilksee') || stationsList[0];
  const twlId = station['twlbox-id'] || '';
  const metId = station['metbox-id'] || '';
  const { loading: twlLoading, observations: twlObs } = useThingObservations(twlId || null);
  const { loading: metLoading, observations: metObs } = useThingObservations(metId || null);

  type Obs = { result?: number | string; phenomenonTime?: string } | null;
  const getLatestValue = (obsMap: Record<string, Obs> | null | undefined, preferKeywords: string[]) => {
    if (!obsMap) return null;
    for (const k of Object.keys(obsMap)) {
      const low = k.toLowerCase();
      if (preferKeywords.some(pk => low.includes(pk))) {
        const o = obsMap[k];
        if (o && o.result != null) return { value: o.result, time: o.phenomenonTime || o['phenomenonTime'] };
      }
    }
    for (const k of Object.keys(obsMap)) {
      const o = obsMap[k]; if (o && o.result != null) return { value: o.result, time: o.phenomenonTime || o['phenomenonTime'] };
    }
    return null;
  };

  const adaptObsMap = (m: Record<string, unknown> | null | undefined): Record<string, Obs> | null => {
    if (!m) return null;
    const out: Record<string, Obs> = {};
    for (const k of Object.keys(m)) {
      const raw = m[k];
      if (!raw || typeof raw !== 'object') { out[k] = null; continue; }
      const o = raw as Record<string, unknown>;
      const res = o['result'];
      const pt = o['phenomenonTime'] as string | undefined;
      out[k] = { result: typeof res === 'number' || typeof res === 'string' ? res : undefined, phenomenonTime: pt };
    }
    return out;
  };

  const windVal = metId ? getLatestValue(adaptObsMap(metObs), ['wind', 'windspeed']) : null;
  const tempVal = twlId ? getLatestValue(adaptObsMap(twlObs), ['temperature', 'temp']) : null;
  const levelVal = twlId ? getLatestValue(adaptObsMap(twlObs), ['level', 'height']) : null;
  // salinity entfernt
  // Deterministische Dummy-Daten statt Math.random für SSR Hydration Stabilität
  const chartData: Array<Record<string, string | number>> = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    wind: Number((8 + ((i * 41) % 600) / 100).toFixed(2)),
    temp: Number((14 + ((i * 59) % 400) / 100).toFixed(2)),
    level: Number((0.2 + ((i * 31) % 40) / 100).toFixed(3)),
  }));
  const infoRef = useRef<HTMLDivElement | null>(null);
  const [infoHeight, setInfoHeight] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      const h = infoRef.current?.getBoundingClientRect().height ?? 0;
      if (h && h > 0) setInfoHeight(Math.round(h));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return (
    <SidebarProvider style={getSidebarStyle()}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col items-center p-8 gap-6">
          <h2 className="text-xl font-bold mb-2 w-full text-[var(--primary)]">Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start">
            <div ref={infoRef} className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-2 text-[var(--primary)]">{station.name}</h3>
              <p className="mb-2 text-gray-700 dark:text-gray-300">{station.info}</p>
              <div className="mb-1 text-sm"><span className="font-semibold">Mail:</span> {station.email}</div>
              <div className="mb-1 text-sm"><span className="font-semibold">Phone:</span> {station.phone}</div>
              <div className="mb-1 text-sm"><span className="font-semibold">Website:</span> <a className="text-[var(--primary)]" href={station.website} target="_blank" rel="noreferrer">{station.website}</a></div>
            </div>
            <div className="hidden md:block h-full">
              {station && station.location && Array.isArray(station.location.coordinates) ? (
                <StationMapCard lat={station.location.coordinates[0]} lon={station.location.coordinates[1]} zoom={16} height={infoHeight || 240} square={false} />
              ) : (
                <StationMapCard lat={54.5} lon={10.2} zoom={14} height={infoHeight || 240} square={false} />
              )}
            </div>
          </div>
          <h2 className="text-xl font-bold mt-8 mb-2 w-full">Measurements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Wind speed Kachel entfernt laut Anforderung */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-2 text-[var(--primary)]">Water temperature</h3>
              <p className="text-2xl font-bold text-[var(--primary)]">{tempVal ? `${Number(tempVal.value).toFixed(1)} °C` : (twlLoading ? 'Loading…' : 'n/a')}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-2">Water level</h3>
              <p className="text-2xl font-bold">{levelVal ? `${Number(levelVal.value).toFixed(2)} m` : (twlLoading ? 'Loading…' : 'n/a')}</p>
            </div>
            
          </div>
          {/* Area Chart Kachel */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 w-full mt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="flex gap-2">
                  <label className="font-semibold">Time range:</label>
                <select
                  className="border rounded px-2 py-1 dark:bg-zinc-800"
                  value={selectedRange}
                  onChange={e => setSelectedRange(e.target.value)}
                >
                    <option value="24h">Last 24h</option>
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                </select>
              </div>
              <div className="flex gap-2">
                  <label className="font-semibold">Metric:</label>
                <select
                  className="border rounded px-2 py-1 dark:bg-zinc-800"
                  value={selectedMetric}
                  onChange={e => setSelectedMetric(e.target.value)}
                >
                    <option value="wind">Wind speed</option>
                    <option value="temp">Water temperature</option>
                    <option value="level">Water level</option>
                  
                </select>
              </div>
            </div>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey={selectedMetric} stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

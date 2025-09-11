"use client";
import stations from '@/lib/station';
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState, useRef, useEffect } from "react";
import useThingObservations, { useThingSeries } from '@/lib/useFrost';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from '@/components/ui/skeleton';
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

export default function FlensburgPage() {
  const station = stations.find((s) => slugify(s.name) === 'flensburg') || stations[0];
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
        if (o && o.result != null) return { value: o.result, time: o.phenomenonTime };
      }
    }
    for (const k of Object.keys(obsMap)) {
      const o = obsMap[k]; if (o && o.result != null) return { value: o.result, time: o.phenomenonTime };
    }
    return null;
  };

  const windVal = metId ? getLatestValue(metObs as unknown as Record<string, Obs>, ['wind', 'wind speed', 'windspeed']) : null;
  const tempVal = twlId ? getLatestValue(twlObs as unknown as Record<string, Obs>, ['temperature', 'water temperature', 'watertemperature', 'waterTemp', 'temp']) : null;
  const levelVal = twlId ? getLatestValue(twlObs as unknown as Record<string, Obs>, ['level', 'water level', 'waterlevel', 'height']) : null;
  // salinity entfernt
  const [selectedMetric, setSelectedMetric] = useState("wind");
  const [selectedRange, setSelectedRange] = useState("24h");
  const infoRef = useRef<HTMLDivElement | null>(null);
  // map selectedRange to hours and fetch series from FROST
  const rangeToHours: Record<string, number> = { '24h': 24, '7d': 24 * 7, '30d': 24 * 30 };
  const hours = rangeToHours[selectedRange] || 24;

  // fetch historical series for twl and met things (hooks called unconditionally)
  const { loading: twlSeriesLoading, error: twlSeriesError, series: twlSeries } = useThingSeries(twlId || null, ['temp', 'temperature', 'level'], hours);
  const { loading: metSeriesLoading, error: metSeriesError, series: metSeries } = useThingSeries(metId || null, ['wind', 'wind speed', 'windspeed'], hours);

  // build chartData depending on selectedMetric
  let chartData: Array<Record<string, string | number>> = [];
  if (selectedMetric === 'wind') {
    chartData = (metSeries && metSeries.length > 0) ? metSeries.map(s => ({ time: new Date(s.time).toLocaleString([], { hour: '2-digit', minute: '2-digit' }), wind: s.value })) : [];
  } else if (selectedMetric === 'temp') {
    chartData = (twlSeries && twlSeries.length > 0) ? twlSeries.map(s => ({ time: new Date(s.time).toLocaleString([], { hour: '2-digit', minute: '2-digit' }), temp: s.value })) : [];
  } else if (selectedMetric === 'level') {
    chartData = (twlSeries && twlSeries.length > 0) ? twlSeries.map(s => ({ time: new Date(s.time).toLocaleString([], { hour: '2-digit', minute: '2-digit' }), level: s.value })) : [];
  }
  const [infoHeight, setInfoHeight] = useState<number | null>(null);
  useEffect(() => {
    const update = () => {
      const h = infoRef.current?.getBoundingClientRect().height ?? 0;
      if (h && h > 0) setInfoHeight(Math.round(h));
    };
    update();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }
    return () => {};
  }, []);

  const sidebarStyle: React.CSSProperties & Record<string, string> = {
    "--sidebar-width": "calc(var(--spacing) * 72)",
    "--header-height": "calc(var(--spacing) * 12)",
  } as unknown as React.CSSProperties & Record<string, string>;

  return (
    <SidebarProvider style={sidebarStyle}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col items-center p-8 gap-6">
          <h2 className="text-xl font-bold mb-2 w-full">Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start">
            <div ref={infoRef} className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-2">{station.name}</h3>
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
            {metId && (
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-2">Wind speed</h3>
                <p className="text-2xl font-bold text-[var(--primary)]">{windVal ? `${Number(windVal.value).toFixed(1)} m/s` : (metLoading ? 'Loading…' : 'n/a')}</p>
              </div>
            )}
            {twlId && (
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-2">Water temperature</h3>
                <p className="text-2xl font-bold text-[var(--primary)]">{tempVal ? `${Number(tempVal.value).toFixed(1)} °C` : (twlLoading ? 'Loading…' : 'n/a')}</p>
              </div>
            )}
            {twlId && (
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-2">Water level</h3>
                <p className="text-2xl font-bold text-[var(--primary)]">{levelVal ? `${Number(levelVal.value).toFixed(2)} m` : (twlLoading ? 'Loading…' : 'n/a')}</p>
              </div>
            )}
            
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
                  { (twlSeriesLoading || metSeriesLoading) ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Skeleton className="w-full h-48" />
                    </div>
                  ) : (
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => {
                        if (selectedMetric === 'temp') return `${Number(v).toFixed(1)} °C`;
                        if (selectedMetric === 'level') return `${Number(v).toFixed(2)} m`;
                        if (selectedMetric === 'wind') return `${Number(v).toFixed(1)} m/s`;
                        if (selectedMetric === 'salinity') return `${Number(v).toFixed(1)} PSU`;
                        return v;
                      }} />
                      <Tooltip formatter={(value: number | string) => {
                        if (selectedMetric === 'temp') return [`${Number(value).toFixed(1)} °C`, 'Temperature'];
                        if (selectedMetric === 'level') return [`${Number(value).toFixed(2)} m`, 'Level'];
                        if (selectedMetric === 'wind') return [`${Number(value).toFixed(1)} m/s`, 'Wind'];
                        if (selectedMetric === 'salinity') return [`${Number(value).toFixed(1)} PSU`, 'Salinity'];
                        return [value, ''];
                      }} labelFormatter={(l) => l} />
                      <Area type="monotone" dataKey={selectedMetric} stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.3} />
                    </AreaChart>
                  )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

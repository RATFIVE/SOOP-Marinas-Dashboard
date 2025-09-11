"use client";
import stations from '@/lib/station';
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState, useRef, useEffect } from "react";
import { formatDateTime } from '@/lib/utils';
import { getSidebarStyle } from '@/lib/ui';
import useThingObservations, { useThingSeries } from '@/lib/useFrost';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
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

// Stationsseite The Newport Marina, Lübeck
export default function TheNewportMarinaLuebeckPage() {
  const stationRaw = stations.find((s) => {
    const sl = slugify(s.name);
  return sl === 'the-newport-marina-luebeck' || sl === 'the-newport-marina-lubeck';
  }) || stations[0];
  const twlId = stationRaw['twlbox-id'] || '';
  const metId = stationRaw['metbox-id'] || '';
  const station = stationRaw;

  const { loading: twlLoading, error: twlError, observations: twlObs } = useThingObservations(twlId || null);
  const { loading: metLoading, error: metError, observations: metObs } = useThingObservations(metId || null);

  type Obs = { result?: number | string; phenomenonTime?: string } | null;
  const getLatestValue = (obsMap: Record<string, Obs> | null | undefined, preferKeywords: string[]) => {
    if (!obsMap) return null;
    for (const k of Object.keys(obsMap)) {
      const low = k.toLowerCase();
      if (preferKeywords.some(pk => low.includes(pk))) {
        const o = obsMap[k];
        if (o && o.result != null) return { value: o.result, time: o.phenomenonTime || (o as any)['phenomenonTime'] };
      }
    }
    for (const k of Object.keys(obsMap)) {
      const o = obsMap[k]; if (o && o.result != null) return { value: o.result, time: o.phenomenonTime || (o as any)['phenomenonTime'] };
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

  const windVal = metId ? getLatestValue(adaptObsMap(metObs), ['wind', 'wind speed', 'windspeed']) : null;
  const windDirVal = metId ? getLatestValue(adaptObsMap(metObs), ['direction', 'wind direction', 'winddir', 'dir']) : null;
  const tempVal = twlId ? getLatestValue(adaptObsMap(twlObs), ['temperature', 'water temperature', 'watertemperature', 'waterTemp', 'temp']) : null;
  const levelVal = twlId ? getLatestValue(adaptObsMap(twlObs), ['level', 'water level', 'waterlevel', 'height']) : null;
  const [selectedMetric, setSelectedMetric] = useState("wind");
  const [selectedRange, setSelectedRange] = useState("24h");
  const infoRef = useRef<HTMLDivElement | null>(null);
  // Mapping Time Range -> Stunden für historischen Abruf
  const rangeToHours: Record<string, number> = { '24h': 24, '7d': 24 * 7, '30d': 24 * 30 };
  const hours = rangeToHours[selectedRange] || 24;

  // Historische Reihen (Temperature/Level über TWL Box, Wind über MET Box)
  const { loading: twlSeriesLoading, error: twlSeriesError, series: twlSeries } = useThingSeries(twlId || null, ['temp','temperature','level'], hours);
  const { loading: metSeriesLoading, error: metSeriesError, series: metSeries } = useThingSeries(metId || null, ['wind','wind speed','windspeed'], hours);

  let chartData: Array<Record<string, string | number>> = [];
  if (selectedMetric === 'wind') {
    chartData = (metSeries && metSeries.length > 0) ? metSeries.map(s => ({ time: formatDateTime(s.time), wind: s.value })) : [];
  } else if (selectedMetric === 'temp') {
    chartData = (twlSeries && twlSeries.length > 0) ? twlSeries.map(s => ({ time: formatDateTime(s.time), temp: s.value })) : [];
  } else if (selectedMetric === 'level') {
    chartData = (twlSeries && twlSeries.length > 0) ? twlSeries.map(s => ({ time: formatDateTime(s.time), level: s.value })) : [];
  }
  const [infoHeight, setInfoHeight] = useState<number | null>(null);
  useEffect(() => {
    const update = () => { const h = infoRef.current?.getBoundingClientRect().height ?? 0; if (h && h > 0) setInfoHeight(Math.round(h)); };
    update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
  }, []);

  const toCardinal = (deg: number) => {
    const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    return dirs[Math.round(((deg % 360) / 22.5)) % 16];
  };

  return (
    <SidebarProvider style={getSidebarStyle()}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col items-center p-8 gap-6">
          <h2 className="text-xl font-bold mb-2 w-full">Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div ref={infoRef} className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-2">{station.name}</h3>
              <p className="mb-2 text-gray-700 dark:text-gray-300">{station.info}</p>
              <div className="mb-1 text-sm"><span className="font-semibold">Mail:</span> {station.email}</div>
              <div className="mb-1 text-sm"><span className="font-semibold">Phone:</span> {station.phone}</div>
              <div className="mb-1 text-sm"><span className="font-semibold">Website:</span> <a className="text-[var(--primary)]" href={station.website} target="_blank" rel="noreferrer">{station.website}</a></div>
            </div>
            <div className="hidden md:block">
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
              <>
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-2">Wind speed</h3>
                <p className="text-2xl font-bold text-[var(--primary)]">{windVal ? `${Number(windVal.value).toFixed(1)} m/s` : (metLoading ? 'Loading…' : 'n/a')}</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-2">Wind direction</h3>
                {windDirVal ? (
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-[var(--primary)]">
                      {Number(windDirVal.value).toFixed(0)}°
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                        {toCardinal(Number(windDirVal.value))}
                      </div>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center relative">
                      <div className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center">
                        <div
                          className="w-0 h-0 border-l-4 border-r-4 border-b-[14px] border-l-transparent border-r-transparent border-b-[var(--primary)]"
                          style={{ transform: `rotate(${Number(windDirVal.value)}deg)` }}
                          aria-label="Wind direction arrow"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-[var(--primary)]">{metLoading ? 'Loading…' : 'n/a'}</p>
                )}
              </div>
              </>
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
                {(twlSeriesLoading || metSeriesLoading) ? (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">Loading series…</div>
                ) : (
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => {
                      if (selectedMetric === 'temp') return `${Number(v).toFixed(1)} °C`;
                      if (selectedMetric === 'level') return `${Number(v).toFixed(2)} m`;
                      if (selectedMetric === 'wind') return `${Number(v).toFixed(1)} m/s`;
                      return v as any;
                    }} />
                    <Tooltip formatter={(value: number | string) => {
                      if (selectedMetric === 'temp') return [`${Number(value).toFixed(1)} °C`, 'Temperature'];
                      if (selectedMetric === 'level') return [`${Number(value).toFixed(2)} m`, 'Level'];
                      if (selectedMetric === 'wind') return [`${Number(value).toFixed(1)} m/s`, 'Wind'];
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

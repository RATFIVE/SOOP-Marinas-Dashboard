"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState, useMemo } from "react";
import { formatDateTime } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import RotatedDateTick from '@/components/chart-axis-tick';
import StationMapCard from '@/components/station-map-card';
import stations from '@/lib/station';
import useThingObservations, { useThingSeries } from '@/lib/useFrost';
import { Skeleton } from '@/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

function slugify(name: string) {
  // normalized slugify that handles German umlauts
  return name
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[üÜ]/g, 'ue')
    .replace(/[öÖ]/g, 'oe')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function KielHarbourPage() {
  const [selectedMetric, setSelectedMetric] = useState("wind");
  const [selectedRange, setSelectedRange] = useState("24h");
  const station = stations.find((s) => slugify(s.name) === 'kiel-harbour') || stations[0];
  const twlId = station['twlbox-id'] || '';
  const metId = station['metbox-id'] || '';
  const { loading: twlLoading, observations: twlObs } = useThingObservations(twlId || null);
  const { loading: metLoading, observations: metObs } = useThingObservations(metId || null);

  // helper: safely extract latest observation value from the observation map
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

  

  // adapt unknown-typed Observations into a narrow Obs shape
  const adaptObsMap = (m: Record<string, unknown> | null | undefined): Record<string, { result?: number | string; phenomenonTime?: string } | null> | null => {
    if (!m) return null;
    const out: Record<string, { result?: number | string; phenomenonTime?: string } | null> = {};
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

  // determine hours for selectedRange
  const rangeToHours: Record<string, number> = { '24h': 24, '7d': 24 * 7, '30d': 24 * 30 };
  const hours = rangeToHours[selectedRange] || 24;

  // fetch series for twl and met things (hooks must be called unconditionally)
  const { loading: twlSeriesLoading, error: twlSeriesError, series: twlSeries } = useThingSeries(twlId || null, ['temp', 'temperature', 'level'], hours);
  const { loading: metSeriesLoading, error: metSeriesError, series: metSeries } = useThingSeries(metId || null, ['wind', 'wind speed', 'windspeed'], hours);

  // map series to chartData expected by Recharts depending on selectedMetric (dynamic range already implemented)
  let chartData: Array<Record<string, string | number>> = [];
  if (selectedMetric === 'wind') {
    chartData = (metSeries && metSeries.length > 0) ? metSeries.map(s => ({ time: formatDateTime(s.time), wind: s.value })) : [];
  } else if (selectedMetric === 'temp') {
    chartData = (twlSeries && twlSeries.length > 0) ? twlSeries.map(s => ({ time: formatDateTime(s.time), temp: s.value })) : [];
  } else if (selectedMetric === 'level') {
    chartData = (twlSeries && twlSeries.length > 0) ? twlSeries.map(s => ({ time: formatDateTime(s.time), level: s.value })) : [];
  }
  const yDomain = useMemo(() => {
    if (!chartData.length) return undefined;
    const key = selectedMetric;
    const values = chartData.map(d => typeof d[key] === 'number' ? d[key] as number : Number(d[key])).filter(v => !isNaN(v));
    if (!values.length) return undefined;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = ((max - min) || 1) * 0.1;
    return [Number((min - pad).toFixed(2)), Number((max + pad).toFixed(2))] as [number, number];
  }, [chartData, selectedMetric]);

  // if we don't have series yet, set chartData empty so chart shows loading
  if (!chartData) chartData = [];

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-2">Kiel Harbour</h3>
              <p className="mb-2 text-gray-700 dark:text-gray-300">Kiel Harbour is a safe harbour, well protected for westerly wind and southerly going currents</p>
              <div className="mb-1 text-sm"><span className="font-semibold">Mail:</span> harbour@kiel.de</div>
              <div className="mb-1 text-sm"><span className="font-semibold">Phone:</span> +00 000 000 000</div>
              <div className="mb-1 text-sm"><span className="font-semibold">Website:</span> <a href="https://www.kielharbour.de" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">www.kielharbour.de</a></div>
            </div>
            <div className="hidden md:block">
              <StationMapCard lat={54.3233} lon={10.1228} zoom={16} />
            </div>
          </div>
          <h2 className="text-xl font-bold mt-8 mb-2 w-full">Measurements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Wind speed Kachel entfernt laut Anforderung */}
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
              <div className="flex items-center gap-3">
                <label className="font-semibold">Time range:</label>
                <ToggleGroup type="single" value={selectedRange} onValueChange={(value) => value && setSelectedRange(value)}>
                  <ToggleGroupItem value="24h">24h</ToggleGroupItem>
                  <ToggleGroupItem value="7d">7d</ToggleGroupItem>
                  <ToggleGroupItem value="30d">30d</ToggleGroupItem>
                </ToggleGroup>
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
              { (twlSeriesLoading || metSeriesLoading) ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Skeleton className="w-full h-48" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical horizontal={false} stroke="currentColor" strokeOpacity={0.15} strokeDasharray="2 2" />
                    <XAxis dataKey="time" tickLine={false} height={70} interval="preserveStartEnd" tick={<RotatedDateTick angle={-30} offsetY={24} />} />
                    <YAxis domain={yDomain as any} tick={{ fontSize: 12 }} tickFormatter={(v) => {
                      if (selectedMetric === 'temp') return `${Number(v).toFixed(1)} °C`;
                      if (selectedMetric === 'level') return `${Number(v).toFixed(2)} m`;
                      if (selectedMetric === 'wind') return `${Number(v).toFixed(1)} m/s`;
                      
                      return v;
                    }} />
                    <Tooltip formatter={(value: number | string) => {
                      if (selectedMetric === 'temp') return [`${Number(value).toFixed(1)} °C`, 'Temperature'];
                      if (selectedMetric === 'level') return [`${Number(value).toFixed(2)} m`, 'Level'];
                      if (selectedMetric === 'wind') return [`${Number(value).toFixed(1)} m/s`, 'Wind'];
                      
                      return [value, ''];
                    }} labelFormatter={(l) => l} />
                    <Area type="monotone" dataKey={selectedMetric} stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

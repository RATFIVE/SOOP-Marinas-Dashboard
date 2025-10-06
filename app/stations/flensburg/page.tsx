"use client";
import stations from '@/lib/station';
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState, useRef, useEffect, useMemo } from "react";
import { formatDateTime } from '@/lib/utils';
import useThingObservations, { useThingSeries } from '@/lib/useFrost';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import RotatedDateTick from '@/components/chart-axis-tick';
import { Skeleton } from '@/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import StationMapCard from '@/components/station-map-card';
import { StationChart } from '@/components/ui/station-chart';

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
  const [selectedMetric, setSelectedMetric] = useState("temp");
  const [selectedRange, setSelectedRange] = useState("24h");
  const [customDateRange, setCustomDateRange] = useState<{ from: Date; to: Date } | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);
  
  const availableMetrics = [
    { value: 'temp', label: 'Water temperature' },
    { value: 'level', label: 'Water level' }
  ];
  
  // Mapping Time Range -> Stunden für historischen Abruf
  const rangeToHours: Record<string, number> = { '24h': 24, '7d': 24 * 7, '30d': 24 * 30, 'custom': 24 * 30 };
  
  // Berechne Stunden basierend auf Auswahl
  let hours = rangeToHours[selectedRange] || 24;
  
  // Wenn Custom Range ausgewählt ist, berechne Stunden basierend auf dem Datum
  if (selectedRange === 'custom' && customDateRange) {
    const diffTime = Math.abs(customDateRange.to.getTime() - customDateRange.from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    hours = diffDays * 24;
  }

  const handleTimeRangeChange = (range: string, customRange?: { from: Date; to: Date }) => {
    setSelectedRange(range);
    if (customRange) {
      setCustomDateRange(customRange);
    }
  };

  // fetch historical series for twl and met things (hooks called unconditionally)
  const { loading: twlSeriesLoading, error: twlSeriesError, series: twlSeries } = useThingSeries(twlId || null, ['temp', 'temperature', 'level'], hours);
  const { loading: metSeriesLoading, error: metSeriesError, series: metSeries } = useThingSeries(metId || null, ['wind', 'wind speed', 'windspeed'], hours);

  // build chartData depending on selectedMetric
  let chartData: Array<Record<string, string | number>> = [];
  if (selectedMetric === 'wind') {
    chartData = (metSeries && metSeries.length > 0) ? metSeries.map(s => ({ time: formatDateTime(s.time), wind: s.value })) : [];
  } else if (selectedMetric === 'temp') {
    chartData = (twlSeries && twlSeries.length > 0) ? twlSeries.map(s => ({ time: formatDateTime(s.time), temp: s.value })) : [];
  } else if (selectedMetric === 'level') {
    chartData = (twlSeries && twlSeries.length > 0) ? twlSeries.map(s => ({ time: formatDateTime(s.time), level: s.value })) : [];
  }
  
  // Filter data based on custom date range if selected
  if (selectedRange === 'custom' && customDateRange) {
    chartData = chartData.filter(item => {
      if (typeof item.time === 'string') {
        const itemDate = new Date(item.time);
        return itemDate >= customDateRange.from && itemDate <= customDateRange.to;
      }
      return true;
    });
  }
  const [infoHeight, setInfoHeight] = useState<number | null>(null);
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
          <StationChart
            chartData={chartData as any}
            selectedMetric={selectedMetric}
            onMetricChange={setSelectedMetric}
            onTimeRangeChange={handleTimeRangeChange}
            loading={twlSeriesLoading || metSeriesLoading}
            availableMetrics={availableMetrics}
            initialTimeRange={selectedRange}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

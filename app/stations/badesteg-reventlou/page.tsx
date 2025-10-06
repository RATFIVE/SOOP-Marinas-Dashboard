"use client";
import stations from '@/lib/station';
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState, useRef, useEffect, useMemo } from "react";
import { formatDateTime } from '@/lib/utils';
import useThingObservations, { useThingSeries } from '@/lib/useFrost';
import { StationChart } from '@/components/ui/station-chart';
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

export default function BadestegReventlouPage() {
  const [selectedMetric, setSelectedMetric] = useState("temp");
  const [selectedRange, setSelectedRange] = useState("24h");
  const station = stations.find((s) => slugify(s.name) === 'badesteg-reventlou') || stations[0];
  const twlId = station['twlbox-id'] || '';
  const { loading: twlLoading, observations: twlObs } = useThingObservations(twlId || null);

  const rangeToHours: Record<string, number> = { '24h': 24, '7d': 24 * 7, '30d': 24 * 30 };
  const [customDateRange, setCustomDateRange] = useState<{ from: Date; to: Date } | null>(null);
  
  const getHoursFromRange = (range: string) => {
    if (range === 'custom' && customDateRange) {
      const timeDiff = customDateRange.to.getTime() - customDateRange.from.getTime();
      return Math.ceil(timeDiff / (1000 * 60 * 60));
    }
    return rangeToHours[range] || 24;
  };
  
  const hours = getHoursFromRange(selectedRange);
  
  const handleTimeRangeChange = (range: string, customRange?: { from: Date; to: Date }) => {
    setSelectedRange(range);
    if (range === 'custom' && customRange) {
      setCustomDateRange(customRange);
    } else {
      setCustomDateRange(null);
    }
  };
  
  const availableMetrics = [
    { value: 'temp', label: 'Water temperature' }
  ];

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
      out[k] = { result: typeof res === 'number' || typeof res === 'string' ? res : undefined, phenomenonTime: (o['phenomenonTime'] as string | undefined) };
    }
    return out;
  };

  const tempVal = twlId ? getLatestValue(adaptObsMap(twlObs), ['temperature', 'water temperature', 'watertemperature', 'waterTemp', 'temp']) : null;
  const infoRef = useRef<HTMLDivElement | null>(null);
  const { loading: seriesLoading, error: seriesError, series } = useThingSeries(twlId || null, ['temp', 'temperature'], hours);
  
  let chartData: Array<Record<string, string | number>> = [];
  if (selectedMetric === 'temp') {
    chartData = (series && series.length > 0) ? series.map(s => ({ time: formatDateTime(s.time), temp: s.value })) : [];
  }
  
  const [infoHeight, setInfoHeight] = useState<number | null>(null);
  useEffect(() => { const update = () => { const h = infoRef.current?.getBoundingClientRect().height ?? 0; if (h && h > 0) setInfoHeight(Math.round(h)); }; update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update); }, []);
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
          <h2 className="text-xl font-bold mb-2 w-full text-[var(--primary)]">Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
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
            {twlId ? (
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-2 text-[var(--primary)]">Water temperature</h3>
                <p className="text-2xl font-bold text-[var(--primary)]">{tempVal ? `${Number(tempVal.value).toFixed(1)} °C` : (twlLoading ? 'Loading…' : 'n/a')}</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-2 text-[var(--primary)]">Water temperature</h3>
                <p className="text-2xl font-bold">n/a</p>
              </div>
            )}
          </div>
          
          <StationChart
            chartData={chartData}
            selectedMetric={selectedMetric}
            onMetricChange={setSelectedMetric}
            onTimeRangeChange={handleTimeRangeChange}
            loading={seriesLoading}
            availableMetrics={availableMetrics}
            initialTimeRange={selectedRange}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

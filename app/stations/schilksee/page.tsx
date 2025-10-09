"use client";
import stations from '@/lib/station';
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState, useRef, useEffect, useMemo } from "react";
import { formatDateTime } from '@/lib/utils';
import { getSidebarStyle } from '@/lib/ui';
import useThingObservations, { useThingSeries } from '@/lib/useFrost';
import { StationChart } from '@/components/ui/station-chart';
import StationMapCard from '@/components/station-map-card';
import MeasurementCard from '@/components/ui/measurement-card';

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
    { value: 'wind', label: 'Wind speed' },
    { value: 'temp', label: 'Water temperature' },
    { value: 'level', label: 'Water level' }
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {/* Water Temperature */}
            <MeasurementCard
              type="temperature"
              title="Water Temperature"
              value={tempVal ? Number(tempVal.value) : null}
              unit="°C"
              timestamp={tempVal?.time}
              isOnline={!twlLoading && !!tempVal}
            />
            
            {/* Water Level */}
            <MeasurementCard
              type="level"
              title="Water Level"
              value={levelVal ? Number(levelVal.value) : null}
              unit="m"
              timestamp={levelVal?.time}
              isOnline={!twlLoading && !!levelVal}
            />
            
            {/* Wind Speed */}
            {metId && windVal && (
              <MeasurementCard
                type="wind-speed"
                title="Wind Speed"
                value={Number(windVal.value)}
                unit="m/s"
                timestamp={windVal.time}
                isOnline={!metLoading && !!windVal}
              />
            )}
          </div>
          
          <StationChart
            chartData={chartData}
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

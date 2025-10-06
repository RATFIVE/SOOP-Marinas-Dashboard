"use client";

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { CalendarRange } from '@/components/ui/calendar-range';
import RotatedDateTick from '@/components/chart-axis-tick';

interface StationChartProps {
  chartData: Array<Record<string, string | number>>;
  selectedMetric: string;
  onMetricChange: (metric: string) => void;
  onTimeRangeChange: (range: string, customRange?: { from: Date; to: Date }) => void;
  loading?: boolean;
  availableMetrics: { value: string; label: string }[];
  initialTimeRange?: string;
}

export function StationChart({
  chartData,
  selectedMetric,
  onMetricChange,
  onTimeRangeChange,
  loading = false,
  availableMetrics,
  initialTimeRange = "24h"
}: StationChartProps) {
  const [selectedRange, setSelectedRange] = useState(initialTimeRange);
  const [customDateRange, setCustomDateRange] = useState<{ from: Date; to: Date } | null>(null);

  const handleRangeChange = (value: string) => {
    setSelectedRange(value);
    onTimeRangeChange(value, customDateRange || undefined);
  };

  const handleCustomDateChange = (range: { from: Date; to: Date }) => {
    setCustomDateRange(range);
    onTimeRangeChange('custom', range);
  };

  const formatTooltipValue = (value: number | string) => {
    if (selectedMetric === 'temp') return `${Number(value).toFixed(1)} °C`;
    if (selectedMetric === 'level') return `${Number(value).toFixed(2)} m`;
    if (selectedMetric === 'wind') return `${Number(value).toFixed(1)} m/s`;
    return value;
  };

  const formatYAxisTick = (v: number): string => {
    if (selectedMetric === 'temp') return `${Number(v).toFixed(1)} °C`;
    if (selectedMetric === 'level') return `${Number(v).toFixed(2)} m`;
    if (selectedMetric === 'wind') return `${Number(v).toFixed(1)} m/s`;
    return String(v);
  };

  const getMetricLabel = () => {
    const metric = availableMetrics.find(m => m.value === selectedMetric);
    return metric ? metric.label : '';
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 w-full mt-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <label className="font-semibold">Time range:</label>
            <ToggleGroup type="single" value={selectedRange} onValueChange={(value) => value && handleRangeChange(value)}>
              <ToggleGroupItem value="24h">24h</ToggleGroupItem>
              <ToggleGroupItem value="7d">7d</ToggleGroupItem>
              <ToggleGroupItem value="30d">30d</ToggleGroupItem>
              <ToggleGroupItem value="custom">Custom</ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          {selectedRange === 'custom' && (
            <div className="ml-0 md:ml-4">
              <CalendarRange
                onDateChange={handleCustomDateChange}
                className="w-full"
              />
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <label className="font-semibold">Metric:</label>
          <select
            className="border rounded px-2 py-1 dark:bg-zinc-800"
            value={selectedMetric}
            onChange={e => onMetricChange(e.target.value)}
          >
            {availableMetrics.map((metric) => (
              <option key={metric.value} value={metric.value}>
                {metric.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
              Loading series…
            </div>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid vertical horizontal={false} stroke="currentColor" strokeOpacity={0.15} strokeDasharray="2 2" />
              <XAxis 
                dataKey="time" 
                tickLine={false} 
                height={70} 
                interval="preserveStartEnd" 
                tick={<RotatedDateTick angle={-30} offsetY={24} />} 
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickFormatter={formatYAxisTick}
              />
              <Tooltip 
                formatter={(value: number | string) => [formatTooltipValue(value), getMetricLabel()]}
                labelFormatter={(l) => l} 
              />
              <Area 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="var(--accent)" 
                fill="var(--accent)" 
                fillOpacity={0.3} 
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

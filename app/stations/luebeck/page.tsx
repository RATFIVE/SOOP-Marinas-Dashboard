"use client";
import stationData from "@/app/stations/station.json";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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

export default function LuebeckPage() {
  const chartData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    wind: 8 + Math.random() * 6,
    temp: 14 + Math.random() * 4,
    level: 0.2 + Math.random() * 0.4,
    salinity: 13 + Math.random() * 2,
  }));
  const [selectedMetric, setSelectedMetric] = useState("wind");
  const [selectedRange, setSelectedRange] = useState("24h");
  const station = (stationData as any).stations.find((s: any) => slugify(s.name) === 'lübeck' || slugify(s.name) === 'luebeck') || (stationData as any).stations[0];

  return (
    <SidebarProvider style={{
      // @ts-ignore
      "--sidebar-width": "calc(var(--spacing) * 72)",
      // @ts-ignore
      "--header-height": "calc(var(--spacing) * 12)"
    }}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col items-center p-8 gap-6">
          <h2 className="text-xl font-bold mb-2 w-full">Info</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 w-full">
            <h3 className="text-lg font-bold mb-2">{station.name}</h3>
            <p className="mb-2 text-gray-700 dark:text-gray-300">{station.info}</p>
            <div className="mb-1 text-sm"><span className="font-semibold">Mail:</span> {station.email}</div>
            <div className="mb-1 text-sm"><span className="font-semibold">Phone:</span> {station.phone}</div>
            <div className="mb-1 text-sm"><span className="font-semibold">Website:</span> <a className="text-blue-600" href={station.website} target="_blank" rel="noreferrer">{station.website}</a></div>
          </div>
          <h2 className="text-xl font-bold mt-8 mb-2 w-full">Measurements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">Windgeschwindigkeit</h3>
              <p className="text-2xl font-bold">{(8 + Math.random()*6).toFixed(1)} m/s</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">Wassertemperatur</h3>
              <p className="text-2xl font-bold">{(14 + Math.random()*4).toFixed(1)} °C</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">Wasserstand</h3>
              <p className="text-2xl font-bold">{(0.2 + Math.random()*0.4).toFixed(2)} m</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">Salinität</h3>
              <p className="text-2xl font-bold">{(13 + Math.random()*2).toFixed(1)} PSU</p>
            </div>
          </div>
          {/* Area Chart Kachel */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 w-full mt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="flex gap-2">
                <label className="font-semibold">Zeitraum:</label>
                <select
                  className="border rounded px-2 py-1 dark:bg-zinc-800"
                  value={selectedRange}
                  onChange={e => setSelectedRange(e.target.value)}
                >
                  <option value="24h">Letzte 24h</option>
                  <option value="7d">Letzte 7 Tage</option>
                  <option value="30d">Letzte 30 Tage</option>
                </select>
              </div>
              <div className="flex gap-2">
                <label className="font-semibold">Messgröße:</label>
                <select
                  className="border rounded px-2 py-1 dark:bg-zinc-800"
                  value={selectedMetric}
                  onChange={e => setSelectedMetric(e.target.value)}
                >
                  <option value="wind">Windgeschwindigkeit</option>
                  <option value="temp">Wassertemperatur</option>
                  <option value="level">Wasserstand</option>
                  <option value="salinity">Salinity</option>
                </select>
              </div>
            </div>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey={selectedMetric} stroke="#2563eb" fill="#60a5fa" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

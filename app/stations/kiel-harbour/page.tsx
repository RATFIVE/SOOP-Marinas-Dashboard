"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function KielHarbourPage() {
  // Beispiel-Daten für das Chart
  const chartData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    wind: 10 + Math.random() * 5,
    temp: 15 + Math.random() * 3,
    level: 0.3 + Math.random() * 0.2,
    salinity: 13 + Math.random() * 2,
  }));
  const [selectedMetric, setSelectedMetric] = useState("wind");
  const [selectedRange, setSelectedRange] = useState("24h");

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
            <h3 className="text-lg font-bold mb-2">Kiel Harbour</h3>
            <p className="mb-2 text-gray-700 dark:text-gray-300">Kiel Harbour is a safe harbour, well protected for westerly wind and southerly going currents</p>
            <div className="mb-1 text-sm"><span className="font-semibold">Mail:</span> harbour@kiel.de</div>
            <div className="mb-1 text-sm"><span className="font-semibold">Phone:</span> +00 000 000 000</div>
            <div className="mb-1 text-sm"><span className="font-semibold">Website:</span> <a href="https://www.kielharbour.de" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">www.kielharbour.de</a></div>
          </div>
          <h2 className="text-xl font-bold mt-8 mb-2 w-full">Measurements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">Windgeschwindigkeit</h3>
              <p className="text-2xl font-bold">12,3 m/s</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">Wassertemperatur</h3>
              <p className="text-2xl font-bold">17,8 °C</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">Wasserstand</h3>
              <p className="text-2xl font-bold">+0,42 m</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">Salinität</h3>
              <p className="text-2xl font-bold">14,2 PSU</p>
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

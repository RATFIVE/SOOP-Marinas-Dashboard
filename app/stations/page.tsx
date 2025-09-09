"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const stations = [
  { name: "Kiel Harbour", position: "54.3233, 10.1228", wind: "12.3 m/s", temp: "17.8 °C", water: "0.42 m", salinity: "14.2 PSU" },
  { name: "Laboe", position: "54.4011, 10.2222", wind: "10.1 m/s", temp: "16.2 °C", water: "0.38 m", salinity: "13.8 PSU" },
  { name: "Schilksee", position: "54.4197, 10.1694", wind: "11.5 m/s", temp: "17.0 °C", water: "0.40 m", salinity: "14.0 PSU" },
  { name: "Heikendorf", position: "54.3667, 10.1833", wind: "9.8 m/s", temp: "16.5 °C", water: "0.36 m", salinity: "13.5 PSU" },
  { name: "Wendtorf", position: "54.4167, 10.3333", wind: "10.7 m/s", temp: "16.8 °C", water: "0.39 m", salinity: "13.9 PSU" },
  { name: "Strande", position: "54.4333, 10.1667", wind: "12.0 m/s", temp: "17.3 °C", water: "0.41 m", salinity: "14.1 PSU" },
];

export default function StationsPage() {
  return (
    <SidebarProvider
      style={{
        // @ts-ignore
        "--sidebar-width": "calc(var(--spacing) * 72)",
        // @ts-ignore
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold mb-6">Stations</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stations.map((station, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 flex flex-col h-full">
                      <h2 className="text-lg font-semibold mb-4">{station.name}</h2>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{station.position}</div>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Average Wind</div>
                            <div className="font-semibold">{station.wind}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Temperature</div>
                            <div className="font-semibold">{station.temp}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Water Level</div>
                            <div className="font-semibold">{station.water}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Salinity</div>
                            <div className="font-semibold">{station.salinity}</div>
                          </div>
                        </div>
                        <div className="my-6 border-t border-gray-200 dark:border-gray-700" />
                        <div className="flex justify-end">
                          <a href={`/stations/${station.name.toLowerCase().replace(/ /g, "-")}`} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition-colors">More Details</a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

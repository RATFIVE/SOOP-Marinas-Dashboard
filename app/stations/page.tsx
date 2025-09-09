"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import stationData from "@/app/stations/station.json";

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

interface Station {
  name: string;
  slug: string;
  position: string;
  wind: string;
  temp: string;
  water: string;
  salinity: string;
}

const stations: Station[] = ((stationData as any).stations || []).map((s: any) => ({
  name: s.name,
  slug: slugify(s.name),
  position: Array.isArray(s.location?.coordinates) ? `${s.location.coordinates[0]}, ${s.location.coordinates[1]}` : "",
  wind: "—",
  temp: "—",
  water: "—",
  salinity: "—",
}));

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
                          <a href={`/stations/${station.slug}`} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition-colors">More Details</a>
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

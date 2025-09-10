"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import stationData from "@/data/station.json";
type RawStation = {
  name: string;
  location?: { coordinates?: number[] };
  email?: string;
  phone?: string;
  website?: string;
  info?: string;
};
import StationCard from "@/components/station-card";

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

const rawStations = ((stationData as unknown as { stations?: RawStation[] }).stations || []);
const stations: Station[] = rawStations.map((s) => ({
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
                <h1 className="text-2xl font-bold mb-6 text-[var(--primary)]">Stations</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stations.map((station, i) => {
                    const coords = station.position.split(",").map(s => parseFloat(s.trim()));
                    return (
                      <StationCard
                        key={i}
                        name={station.name}
                        lat={Number.isFinite(coords[0]) ? coords[0] : 0}
                        lon={Number.isFinite(coords[1]) ? coords[1] : 0}
                        online={true}
                        metrics={[
                          { label: "Average wind", value: station.wind },
                          { label: "Temperature", value: station.temp },
                          { label: "Water level", value: station.water },
                          { label: "Salinity", value: station.salinity },
                        ]}
                        lastUpdateISO={new Date().toISOString()}
                        onMoreDetails={() => { window.location.href = `/stations/${station.slug}` }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

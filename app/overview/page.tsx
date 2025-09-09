
"use client";


import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("@/components/leaflet-map"), { ssr: false });

export default function OverviewPage() {
  return (
    <SidebarProvider
      style={
        // @ts-ignore
        {"--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)"}
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold mb-6">Overview</h1>
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 mb-6">
                  <LeafletMap />
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Nearest Station</h2>
                  <div>
                    <div className="font-bold text-base mb-1">Kiel Harbour</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">54.3233, 10.1228</div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Average Wind</div>
                        <div className="font-semibold">12.3 m/s</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Temperature</div>
                        <div className="font-semibold">17.8 °C</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Water Level</div>
                        <div className="font-semibold">0.42 m</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Salinity</div>
                        <div className="font-semibold">14.2 PSU</div>
                      </div>
                    </div>
                    <div className="my-6 border-t border-gray-200 dark:border-gray-700" />
                    <div className="flex justify-end">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition-colors">More Details</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

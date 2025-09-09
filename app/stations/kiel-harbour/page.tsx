"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function KielHarbourPage() {
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
            <div className="mb-1 text-sm"><span className="font-semibold">Website:</span> <a href="https://www.kielharbour.de" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">www.kielharbour.de</a></div>
          </div>
          <h2 className="text-xl font-bold mt-8 mb-2 w-full">Measurements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Kacheln passen sich jetzt der Fensterbreite an */}
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
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

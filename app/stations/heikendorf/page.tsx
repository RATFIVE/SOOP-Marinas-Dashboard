"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function HeikendorfPage() {
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
        <div className="flex flex-1 flex-col items-center justify-center p-8">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 w-full max-w-xl">
            <h1 className="text-2xl font-bold mb-4">Heikendorf</h1>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">54.3667, 10.1833</div>
            <div className="grid grid-cols-2 gap-4 mt-2 mb-6">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Average Wind</div>
                <div className="font-semibold">9.8 m/s</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Temperature</div>
                <div className="font-semibold">16.5 °C</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Water Level</div>
                <div className="font-semibold">0.36 m</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Salinity</div>
                <div className="font-semibold">13.5 PSU</div>
              </div>
            </div>
            <div className="my-6 border-t border-gray-200 dark:border-gray-700" />
            <div className="flex justify-end">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition-colors">Back</button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function FlensburgPage() {
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
            <h3 className="text-lg font-bold mb-2">Flensburg</h3>
            <p className="mb-2 text-gray-700 dark:text-gray-300">Hier können Infos zur Station Flensburg stehen.</p>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

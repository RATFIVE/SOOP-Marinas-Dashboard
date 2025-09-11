"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { CSSProperties } from 'react';

const sidebarStyle: CSSProperties & Record<string, string> = {
  "--sidebar-width": "calc(var(--spacing) * 72)",
  "--header-height": "calc(var(--spacing) * 12)",
} as unknown as CSSProperties & Record<string, string>;
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("@/components/leaflet-map"), { ssr: false });

export default function MapPage() {
  return (
  <SidebarProvider style={sidebarStyle}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-0 m-0 w-full" style={{ height: 'calc(100vh - var(--header-height))' }}>
          <div className="flex-1 w-full h-full">
            <LeafletMap height="full" />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

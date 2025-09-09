
"use client";

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "./ui/mode-toggle"
import { ThemeProvider } from "next-themes"
import { ThemeSelector } from "./theme-selector"
import { usePathname } from "next/navigation"

export function SiteHeader() {
  const pathname = usePathname();
  // Breadcrumb-Logik für Stations-Unterseiten
  let breadcrumb: React.ReactNode = null;
  if (pathname.startsWith("/stations/") && pathname.split("/").length === 3) {
    const stationName = pathname.split("/")[2].replace(/\b\w/g, c => c.toUpperCase()).replace(/-/g, " ");
    breadcrumb = (
      <nav className="flex items-center gap-1 text-base font-medium">
        <a href="/stations" className="text-blue-600 hover:underline">Stations</a>
        <span className="mx-1">/</span>
        <span>{stationName}</span>
      </nav>
    );
  } else {
    breadcrumb = <h1 className="text-base font-medium">{pathname === "/" ? "Home" : pathname.replace(/^\//, "").replace(/\b\w/g, c => c.toUpperCase())}</h1>;
  }
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <img src="/SOOP-Logo_Standard.svg" alt="SOOP Logo" className="h-8 w-auto mr-3" />
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        {breadcrumb}
        <div className="ml-auto flex items-center gap-2">
          <ThemeSelector />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}



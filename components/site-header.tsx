
"use client";

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "./ui/mode-toggle"
import { ThemeProvider } from "next-themes"
import { ThemeSelector } from "./theme-selector"
import { usePathname } from "next/navigation"
import Link from "next/link"

export function SiteHeader() {
  const pathname = usePathname();
  // Breadcrumb-Logik für Stations-Unterseiten
  let breadcrumb: React.ReactNode = null;
  if (pathname && pathname.startsWith("/stations/") && pathname.split("/").length === 3) {
    const stationName = pathname.split("/")[2].replace(/\b\w/g, c => c.toUpperCase()).replace(/-/g, " ");
    breadcrumb = (
      <nav className="flex items-center gap-1 text-base font-medium">
  <a href="/stations" className="text-[var(--primary)] hover:underline">Stations</a>
        <span className="mx-1">/</span>
        <span>{stationName}</span>
      </nav>
    );
  } else {
    const title = pathname ? (pathname === "/" ? "Home" : pathname.replace(/^\//, "").replace(/\b\w/g, c => c.toUpperCase())) : "";
    breadcrumb = <h1 className="text-base font-medium">{title}</h1>;
  }
  return (
    <header className="bg-white z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <Link href="/overview" aria-label="Overview">
          <img src="/SOOP-Logo_Standard.svg" alt="SOOP Logo" className="h-8 w-auto mr-3" />
        </Link>
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        {breadcrumb}
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}



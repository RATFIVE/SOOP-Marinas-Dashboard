import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function LegalNoticePage() {
  return (
    <SidebarProvider
      style={
        // @ts-ignore
        { "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" }
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Imprint</h1>

          <h2 className="text-lg font-semibold mt-4">Responsible</h2>
          <p className="mt-2">Dr. Toste Tanhua<br />
          GEOMAR Helmholtz Centre for Ocean Research Kiel<br />
          Wischhofstr. 1-3<br />
          24148 Kiel, Germany<br />
          E‑mail: info@soop-platform.earth</p>

          <h2 className="text-lg font-semibold mt-4">Editorial team</h2>
          <p className="mt-2">Myriam Dutzi<br />
          Innovation Management & Communication<br />
          GEOMAR Helmholtz Centre for Ocean Research Kiel<br />
          Wischhofstr. 1-3<br />
          24148 Kiel, Germany<br />
          E‑mail: info@soop-platform.earth</p>

          <h2 className="text-lg font-semibold mt-4">Disclaimer</h2>
          <p className="mt-2">Despite careful content control, we assume no liability for the content of external links. The operators of the linked pages are solely responsible for their content.</p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

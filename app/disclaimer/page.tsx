import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DisclaimerPage() {
  return (
    <SidebarProvider
      style={
  // @ts-expect-error
        { "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" }
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Disclaimer for the SOOP Marina website</h1>

          <h2 className="text-lg font-semibold mt-4">General information on the use of data</h2>
          <p className="mt-2">The information presented on the SOOP Marina website is based on publicly available measurement and model data. The data may be available in different time resolutions; all timestamps refer to the respective local time.</p>

          <p className="mt-2">Please note that the measurements listed do not necessarily comply with the standards of the German Weather Service or other official measuring stations. Local conditions can influence the measurement results and lead to deviations.</p>

          <p className="mt-2">We make every effort to present only correct and up-to-date data. Nevertheless, it cannot be ruled out that measuring devices may fail, transmit incorrect values, or that data may be incomplete. The data provided is only checked using simple quality controls.</p>

          <p className="mt-2">The use or disclosure of the data provided on this page for purposes such as expert opinions, claims, insurance issues, or similar legally relevant applications is expressly prohibited.</p>

          <h2 className="text-lg font-semibold mt-4">Disclaimer</h2>
          <p className="mt-2">Neither SOOP nor the persons involved in the collection, processing, and presentation of the data accept any liability for direct or indirect damages that may arise from the use or interpretation of the data presented. The use of the data is entirely at your own risk.</p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

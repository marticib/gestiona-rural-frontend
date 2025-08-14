import { Outlet } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { sidebarConfig } from "@/config/navigation"

export function RootLayout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": sidebarConfig.width,
          "--header-height": sidebarConfig.headerHeight,
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {/* Aquí es renderitzaran les diferents pàgines */}
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

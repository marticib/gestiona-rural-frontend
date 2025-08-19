"use client"

import * as React from "react"
import { Link } from "react-router-dom"
import { IconInnerShadowTop } from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user.jsx"
import { useNavigation } from "@/hooks/use-navigation.js"
import { useRole } from "@/hooks/use-role.js"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { sidebarConfig } from "@/config/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { navMain, navDocuments, navSecondary } = useNavigation()
  const { isClient } = useRole()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to={isClient() ? "/welcome" : "/dashboard"}>
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">{sidebarConfig.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {navDocuments.length > 0 && <NavDocuments items={navDocuments} />}
        {navSecondary.length > 0 && <NavSecondary items={navSecondary} className="mt-auto" />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

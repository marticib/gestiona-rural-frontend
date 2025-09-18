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
    <Sidebar 
      collapsible="offcanvas" 
      className="bg-gradient-to-b from-white/95 via-white/90 to-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl"
      {...props}
    >
      <SidebarHeader className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-xl border-b border-white/20 px-4 py-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-3 hover:bg-white/60 transition-all duration-300 rounded-xl group"
            >
              <Link to={isClient() ? "/welcome" : "/dashboard"}>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <IconInnerShadowTop className="!size-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {sidebarConfig.title}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-gradient-to-b from-white/90 to-white/95 backdrop-blur-xl px-2 py-4">
        <NavMain items={navMain} />
        {navDocuments.length > 0 && <NavDocuments items={navDocuments} />}
        {navSecondary.length > 0 && <NavSecondary items={navSecondary} className="mt-auto" />}
      </SidebarContent>
      <SidebarFooter className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 backdrop-blur-xl border-t border-white/20 px-2 py-4">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

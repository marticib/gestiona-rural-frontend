"use client"

import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react"
import { Link, useLocation } from "react-router-dom"
import { type NavItem } from "@/config/navigation"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: NavItem[]
}) {
  const location = useLocation()
  
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-3">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-lg transition-all duration-300 rounded-xl border-0 group"
            >
              <div className="group-hover:scale-110 transition-transform duration-300">
                <IconCirclePlusFilled />
              </div>
              <span className="font-medium">Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0 bg-white/80 hover:bg-white/90 border border-white/30 hover:shadow-lg transition-all duration-300 rounded-xl"
              variant="outline"
            >
              <IconMail className="text-gray-600" />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu className="space-y-1">
          {items.map((item) => {
            const isActive = location.pathname === item.url || 
                           (item.url !== "/" && location.pathname.startsWith(item.url))
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  className={`cursor-pointer transition-all duration-300 rounded-xl group ${
                    isActive 
                      ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 border border-blue-200/50 shadow-sm" 
                      : "hover:bg-white/60 hover:shadow-sm text-gray-700"
                  }`} 
                  tooltip={item.title} 
                  asChild
                >
                  <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                    {item.icon && (
                      <div className={`transition-all duration-300 ${
                        isActive 
                          ? "text-blue-600 scale-110" 
                          : "text-gray-500 group-hover:text-gray-700 group-hover:scale-105"
                      }`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                    )}
                    <span className={`font-medium transition-colors duration-300 ${
                      isActive ? "text-blue-700" : "group-hover:text-gray-900"
                    }`}>
                      {item.title}
                    </span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

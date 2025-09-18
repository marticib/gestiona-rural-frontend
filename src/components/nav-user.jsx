"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  ArrowLeft,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from '@/contexts/auth-context.jsx'

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user, logout } = useAuth()

  // Si no hi ha usuari autenticat o les propietats necessàries, no mostrem res
  if (!user || !user.name || !user.email) {
    return null
  }

  const handleLogout = () => {
    logout()
  }

  const handleBackToHub = () => {
    // Detectar si estem en local o producció
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    const hubUrl = isLocal ? 'http://localhost:3000/app' : 'https://gestiona.cat/app'
    window.open(hubUrl, '_blank')
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="bg-white/60 hover:bg-white/80 border border-white/30 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <Avatar className="h-8 w-8 rounded-xl shadow-md ring-2 ring-white/50">
                <AvatarFallback className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-gray-900">{user.name || 'Usuari'}</span>
                <span className="truncate text-xs text-gray-500">{user.email || ''}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-3 text-left">
                <Avatar className="h-8 w-8 rounded-xl shadow-md ring-2 ring-white/50">
                  <AvatarFallback className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold text-gray-900">{user.name}</span>
                  <span className="truncate text-xs text-gray-500">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200/50" />
            <DropdownMenuGroup>
              <DropdownMenuItem 
                onClick={handleBackToHub}
                className="rounded-lg mx-1 my-1 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors duration-200"
              >
                <ArrowLeft className="text-blue-600" />
                Tornar al Hub
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-gray-200/50" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="rounded-lg mx-1 my-1 hover:bg-green-50 text-gray-700 hover:text-green-700 transition-colors duration-200">
                <BadgeCheck className="text-green-600" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg mx-1 my-1 hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-colors duration-200">
                <CreditCard className="text-purple-600" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg mx-1 my-1 hover:bg-orange-50 text-gray-700 hover:text-orange-700 transition-colors duration-200">
                <Bell className="text-orange-600" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-gray-200/50" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="rounded-lg mx-1 my-1 hover:bg-red-50 text-gray-700 hover:text-red-700 transition-colors duration-200"
            >
              <LogOut className="text-red-600" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

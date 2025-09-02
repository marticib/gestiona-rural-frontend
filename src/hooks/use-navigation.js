import { useRole } from '@/hooks/use-role'
import {
  IconDashboard,
  IconUsers,
  IconBuilding,
  IconCalendar,
  IconHome,
  IconUsersGroup,
} from "@tabler/icons-react"

export function useNavigation() {
  const { canManagePropietaris, canAccessAdmin, isClient } = useRole()

  // Navegació per clients
  const clientNavigation = [
    {
      title: "Benvinguda",
      url: "/app/welcome",
      icon: IconHome,
      isActive: true,
    },
  ]

  // Navegació per admins (superadmin + propietari)
  const adminNavigation = [
    {
      title: "Dashboard",
      url: "/app/dashboard",
      icon: IconDashboard,
      isActive: true,
    },
    ...(canManagePropietaris() ? [{
      title: "Propietaris",
      url: "/app/propietaris",
      icon: IconUsers,
      items: [
        {
          title: "Tots els Propietaris",
          url: "/app/propietaris",
        },
        {
          title: "Nou Propietari",
          url: "/app/propietaris/nou",
        },
      ],
    }] : []),
    {
      title: "Clients",
      url: "/app/clients",
      icon: IconUsers,
      items: [
        {
          title: "Tots els Clients",
          url: "/app/clients",
        },
        {
          title: "Nou Client",
          url: "/app/clients/nou",
        },
        {
          title: "Clients Actius",
          url: "/app/clients/actius",
        },
      ],
    },
    {
      title: "Allotjaments",
      url: "/app/allotjaments",
      icon: IconBuilding,
      items: [
        {
          title: "Tots els Allotjaments",
          url: "/app/allotjaments",
        },
        {
          title: "Nou Allotjament",
          url: "/app/allotjaments/nou",
        },
        {
          title: "Allotjaments Actius",
          url: "/app/allotjaments/actius",
        },
      ],
    },
    {
      title: "Reserves",
      url: "/app/reserves",
      icon: IconCalendar,
      items: [
        {
          title: "Totes les Reserves",
          url: "/app/reserves",
        },
        {
          title: "Nova Reserva",
          url: "/app/reserves/nova",
        },
        {
          title: "Reserves d'Avui",
          url: "/app/reserves/avui",
        },
        {
          title: "Històric",
          url: "/app/reserves/historic",
        },
      ],
    },
    {
      title: "Viatgers",
      url: "/app/viatgers",
      icon: IconUsersGroup,
      items: [
        {
          title: "Tots els Viatgers",
          url: "/app/viatgers",
        },
      ],
    },
  ]

  if (isClient()) {
    return {
      navMain: clientNavigation,
      navDocuments: [],
      navSecondary: []
    }
  }

  if (canAccessAdmin()) {
    return {
      navMain: adminNavigation,
      navDocuments: [],
      navSecondary: []
    }
  }

  // Fallback
  return {
    navMain: [],
    navDocuments: [],
    navSecondary: []
  }
}

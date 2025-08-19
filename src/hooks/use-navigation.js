import { useRole } from '@/hooks/use-role'
import {
  IconDashboard,
  IconUsers,
  IconBuilding,
  IconCalendar,
  IconHome,
} from "@tabler/icons-react"

export function useNavigation() {
  const { canManagePropietaris, canAccessAdmin, isClient } = useRole()

  // Navegació per clients
  const clientNavigation = [
    {
      title: "Benvinguda",
      url: "/welcome",
      icon: IconHome,
      isActive: true,
    },
  ]

  // Navegació per admins (superadmin + propietari)
  const adminNavigation = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
      isActive: true,
    },
    ...(canManagePropietaris() ? [{
      title: "Propietaris",
      url: "/propietaris",
      icon: IconUsers,
      items: [
        {
          title: "Tots els Propietaris",
          url: "/propietaris",
        },
        {
          title: "Nou Propietari",
          url: "/propietaris/nou",
        },
      ],
    }] : []),
    {
      title: "Clients",
      url: "/clients",
      icon: IconUsers,
      items: [
        {
          title: "Tots els Clients",
          url: "/clients",
        },
        {
          title: "Nou Client",
          url: "/clients/nou",
        },
        {
          title: "Clients Actius",
          url: "/clients/actius",
        },
      ],
    },
    {
      title: "Allotjaments",
      url: "/allotjaments",
      icon: IconBuilding,
      items: [
        {
          title: "Tots els Allotjaments",
          url: "/allotjaments",
        },
        {
          title: "Nou Allotjament",
          url: "/allotjaments/nou",
        },
        {
          title: "Allotjaments Actius",
          url: "/allotjaments/actius",
        },
      ],
    },
    {
      title: "Reserves",
      url: "/reserves",
      icon: IconCalendar,
      items: [
        {
          title: "Totes les Reserves",
          url: "/reserves",
        },
        {
          title: "Nova Reserva",
          url: "/reserves/nova",
        },
        {
          title: "Reserves d'Avui",
          url: "/reserves/avui",
        },
        {
          title: "Històric",
          url: "/reserves/historic",
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

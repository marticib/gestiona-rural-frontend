import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconBuilding,
  IconCalendar,
  IconUsersGroup,
  type Icon,
} from "@tabler/icons-react"

export interface NavItem {
  title: string
  url: string
  icon?: Icon
  isActive?: boolean
  items?: NavSubItem[]
}

export interface NavSubItem {
  title: string
  url: string
}

export interface DocumentItem {
  name: string
  url: string
  icon: Icon
}

export interface UserData {
  name: string
  email: string
  avatar: string
}

// Configuració de l'usuari
export const userData: UserData = {
  name: "Marti",
  email: "marti@gestiona.com",
  avatar: "/avatars/marti.jpg",
}

// Navegació principal
export const navMain: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
    isActive: true,
  },
  {
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
  },
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
        title: "Reserves Avui",
        url: "/reserves/avui",
      },
      {
        title: "Reserves Pendents",
        url: "/reserves/pendents",
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
  {
    title: "Analítiques",
    url: "/analytics",
    icon: IconChartBar,
    items: [
      {
        title: "Rendiment",
        url: "/analytics/performance",
      },
      {
        title: "Trànsit",
        url: "/analytics/traffic",
      },
      {
        title: "Ingressos",
        url: "/analytics/revenue",
      },
    ],
  },
  {
    title: "Configuració",
    url: "/settings",
    icon: IconSettings,
  },
]

// Navegació de documents
export const navDocuments: DocumentItem[] = [
  {
    name: "Informes de Reserves",
    url: "/reports/reserves",
    icon: IconFileDescription,
  },
  {
    name: "Informes d'Ocupació",
    url: "/reports/ocupacio",
    icon: IconReport,
  },
  {
    name: "Contractes",
    url: "/documents/contractes",
    icon: IconFileWord,
  },
  {
    name: "Documentació Legal",
    url: "/documents/legal",
    icon: IconFileDescription,
  },
]

// Navegació secundària
export const navSecondary: NavItem[] = [
  {
    title: "Suport",
    url: "/support",
    icon: IconHelp,
  },
  {
    title: "API Documentation",
    url: "/api-docs",
    icon: IconDatabase,
  },
  {
    title: "Cerca",
    url: "/search",
    icon: IconSearch,
  },
]

// Configuració del sidebar
export const sidebarConfig = {
  title: "Gestiona Rural",
  width: "16rem",
  headerHeight: "3.5rem",
  collapsible: true,
  defaultCollapsed: false,
}

// Configuració global de la navegació
export const navigationConfig = {
  mainNavigation: navMain,
  documents: navDocuments,
  secondaryNavigation: navSecondary,
  user: userData,
  sidebar: sidebarConfig,
}

export default navigationConfig

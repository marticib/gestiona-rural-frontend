import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
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
    title: "Projectes",
    url: "/projects",
    icon: IconFolder,
    items: [
      {
        title: "Tots els Projectes",
        url: "/projects",
      },
      {
        title: "Projectes Actius",
        url: "/projects/active",
      },
      {
        title: "Projectes Arxivats",
        url: "/projects/archived",
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
        title: "Clients Actius",
        url: "/clients/active",
      },
      {
        title: "Nous Clients",
        url: "/clients/new",
      },
    ],
  },
  {
    title: "Facturació",
    url: "/billing",
    icon: IconFileDescription,
    items: [
      {
        title: "Factures",
        url: "/billing/invoices",
      },
      {
        title: "Pressupostos",
        url: "/billing/quotes",
      },
      {
        title: "Pagaments",
        url: "/billing/payments",
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
        title: "Finances",
        url: "/analytics/finances",
      },
      {
        title: "Clients",
        url: "/analytics/clients",
      },
    ],
  },
  {
    title: "Tasques",
    url: "/tasks",
    icon: IconListDetails,
    items: [
      {
        title: "Les Meves Tasques",
        url: "/tasks/my",
      },
      {
        title: "Totes les Tasques",
        url: "/tasks/all",
      },
      {
        title: "Calendari",
        url: "/tasks/calendar",
      },
    ],
  },
]

// Navegació per documents i eines
export const navDocuments: DocumentItem[] = [
  {
    name: "Base de Dades",
    url: "/database",
    icon: IconDatabase,
  },
  {
    name: "Informes",
    url: "/reports",
    icon: IconReport,
  },
  {
    name: "Plantilles",
    url: "/templates",
    icon: IconFileWord,
  },
  {
    name: "Captura de Dades",
    url: "/capture",
    icon: IconCamera,
  },
  {
    name: "IA Assistant",
    url: "/ai-assistant",
    icon: IconFileAi,
  },
]

// Navegació secundària (configuració i ajuda)
export const navSecondary: NavItem[] = [
  {
    title: "Configuració",
    url: "/settings",
    icon: IconSettings,
  },
  {
    title: "Ajuda",
    url: "/help",
    icon: IconHelp,
  },
  {
    title: "Cerca",
    url: "/search",
    icon: IconSearch,
  },
]

// Configuració de workflows específics (si necessari)
export const navWorkflows: NavItem[] = [
  {
    title: "Captura",
    icon: IconCamera,
    isActive: true,
    url: "/workflows/capture",
    items: [
      {
        title: "Propostes Actives",
        url: "/workflows/capture/active",
      },
      {
        title: "Arxivades",
        url: "/workflows/capture/archived",
      },
    ],
  },
  {
    title: "Proposta",
    icon: IconFileDescription,
    url: "/workflows/proposal",
    items: [
      {
        title: "Propostes Actives",
        url: "/workflows/proposal/active",
      },
      {
        title: "Arxivades",
        url: "/workflows/proposal/archived",
      },
    ],
  },
  {
    title: "Prompts",
    icon: IconFileAi,
    url: "/workflows/prompts",
    items: [
      {
        title: "Prompts Actius",
        url: "/workflows/prompts/active",
      },
      {
        title: "Arxivats",
        url: "/workflows/prompts/archived",
      },
    ],
  },
]

// Configuració general del sidebar
export const sidebarConfig = {
  title: "Gestiona",
  subtitle: "Gestió empresarial",
  width: "calc(var(--spacing) * 72)",
  headerHeight: "calc(var(--spacing) * 12)",
}

// Funció per obtenir l'element actiu basat en l'URL actual
export function getActiveNavItem(pathname: string): NavItem | null {
  // Cerca en navegació principal
  for (const item of navMain) {
    if (item.url === pathname) return item
    if (item.items) {
      for (const subItem of item.items) {
        if (subItem.url === pathname) return item
      }
    }
  }
  
  // Cerca en navegació secundària
  for (const item of navSecondary) {
    if (item.url === pathname) return item
  }
  
  return null
}

// Funció per obtenir el breadcrumb basat en l'URL
export function getBreadcrumb(pathname: string): string[] {
  const breadcrumb: string[] = []
  
  for (const item of navMain) {
    if (pathname.startsWith(item.url)) {
      breadcrumb.push(item.title)
      
      if (item.items) {
        for (const subItem of item.items) {
          if (subItem.url === pathname) {
            breadcrumb.push(subItem.title)
            break
          }
        }
      }
      break
    }
  }
  
  return breadcrumb
}

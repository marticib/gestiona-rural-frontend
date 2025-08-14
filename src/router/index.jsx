import { createBrowserRouter, Navigate } from "react-router-dom"
import { RootLayout } from "@/components/root-layout"
import { DashboardPage } from "@/pages/dashboard"
import { ProjectsPage } from "@/pages/projects"
import { ClientsPage } from "@/pages/clients"
import { AnalyticsPage } from "@/pages/analytics"
import { SettingsPage } from "@/pages/settings"
import { LoginPage } from "@/pages/login"
import { ToastExamplePage } from "@/pages/toast-example.jsx"
import { AuthGuard } from "@/components/auth-guard.jsx"
import { PublicRoute } from "@/components/public-route.jsx"

// Component per a pàgines que encara no estan implementades
function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-4 md:py-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">Aquesta pàgina està en desenvolupament</p>
      </div>
    </div>
  )
}

export const router = createBrowserRouter([
  // Ruta pública del login
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  // Rutes protegides
  {
    path: "/",
    element: (
      <AuthGuard>
        <RootLayout />
      </AuthGuard>
    ),
    children: [
      // Redirect de la root al dashboard
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      // Rutes principals
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
        children: [
          {
            path: "active",
            element: <ComingSoon title="Projectes Actius" />,
          },
          {
            path: "archived",
            element: <ComingSoon title="Projectes Arxivats" />,
          },
        ],
      },
      {
        path: "clients",
        element: <ClientsPage />,
        children: [
          {
            path: "active",
            element: <ComingSoon title="Clients Actius" />,
          },
          {
            path: "new",
            element: <ComingSoon title="Nous Clients" />,
          },
        ],
      },
      {
        path: "billing",
        element: <ComingSoon title="Facturació" />,
        children: [
          {
            path: "invoices",
            element: <ComingSoon title="Factures" />,
          },
          {
            path: "quotes",
            element: <ComingSoon title="Pressupostos" />,
          },
          {
            path: "payments",
            element: <ComingSoon title="Pagaments" />,
          },
        ],
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
        children: [
          {
            path: "performance",
            element: <ComingSoon title="Rendiment" />,
          },
          {
            path: "finances",
            element: <ComingSoon title="Finances" />,
          },
          {
            path: "clients",
            element: <ComingSoon title="Analítiques de Clients" />,
          },
        ],
      },
      {
        path: "tasks",
        element: <ToastExamplePage />,
        children: [
          {
            path: "my",
            element: <ComingSoon title="Les Meves Tasques" />,
          },
          {
            path: "all",
            element: <ComingSoon title="Totes les Tasques" />,
          },
          {
            path: "calendar",
            element: <ComingSoon title="Calendari de Tasques" />,
          },
        ],
      },
      // Rutes de documents i eines
      {
        path: "database",
        element: <ComingSoon title="Base de Dades" />,
      },
      {
        path: "reports",
        element: <ComingSoon title="Informes" />,
      },
      {
        path: "templates",
        element: <ComingSoon title="Plantilles" />,
      },
      {
        path: "capture",
        element: <ComingSoon title="Captura de Dades" />,
      },
      {
        path: "ai-assistant",
        element: <ComingSoon title="IA Assistant" />,
      },
      // Rutes secundàries
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "toast-example",
        element: <ToastExamplePage />,
      },
      {
        path: "help",
        element: <ComingSoon title="Ajuda" />,
      },
      {
        path: "search",
        element: <ComingSoon title="Cerca" />,
      },
      // Ruta de fallback per a 404
      {
        path: "*",
        element: (
          <div className="flex flex-col items-center justify-center min-h-[400px] py-4 md:py-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">404</h1>
              <p className="text-muted-foreground">Pàgina no trobada</p>
            </div>
          </div>
        ),
      },
    ],
  },
])

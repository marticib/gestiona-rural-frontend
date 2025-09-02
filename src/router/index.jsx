import { createBrowserRouter, Navigate } from "react-router-dom"
import { RootLayout } from "@/components/root-layout"
import { DashboardPage } from "@/pages/dashboard"
import { ProjectsPage } from "@/pages/projects"
import { AnalyticsPage } from "@/pages/analytics"
import { SettingsPage } from "@/pages/settings"
import { ToastExamplePage } from "@/pages/toast-example.jsx"
import { WelcomePage } from "@/pages/welcome"
import { AuthGuard } from "@/components/auth-guard.jsx"
import { PublicRoute } from "@/components/public-route.jsx"
import { RoleGuard } from "@/components/role-guard.jsx"
import { RoleBasedRedirect } from "@/components/role-based-redirect.jsx"
import PropietarisPage from "@/pages/propietaris"
import AllotjamentsPage from "@/pages/allotjaments"
import ClientsPage from "@/pages/clients/index.jsx"
import ReservesPage from "@/pages/reserves/index.jsx"
import HomePage from "@/pages/home/index.jsx"
import RegisterPage from "@/pages/register/index.jsx"
import { LoginPage } from "@/pages/login"
import ViatgersPage from "@/pages/ViatgersPage"
import FormulariViatgerPage from "@/pages/FormulariViatgerPage"

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
  // Pàgina d'inici pública
  {
    path: "/",
    element: (
      <PublicRoute>
        <HomePage />
      </PublicRoute>
    ),
  },
  // Ruta pública del login
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  // Ruta pública del registre
  {
    path: "/register",
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  // Rutes protegides sota /app
  {
    path: "/app",
    element: (
      <AuthGuard>
        <RootLayout />
      </AuthGuard>
    ),
    children: [
      // Redirect de la root basat en el rol
      {
        index: true,
        element: <RoleBasedRedirect />,
      },
      // Pàgina de benvinguda per clients
      {
        path: "welcome",
        element: (
          <RoleGuard allowedRoles={['client']}>
            <WelcomePage />
          </RoleGuard>
        ),
      },
      // Rutes per admin (superadmin i propietari)
      {
        path: "dashboard",
        element: (
          <RoleGuard allowedRoles={['superadmin', 'propietari']}>
            <DashboardPage />
          </RoleGuard>
        ),
      },
      {
        path: "projects",
        element: (
          <RoleGuard allowedRoles={['superadmin', 'propietari']}>
            <ProjectsPage />
          </RoleGuard>
        ),
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
        element: (
          <RoleGuard allowedRoles={['superadmin', 'propietari']}>
            <ClientsPage />
          </RoleGuard>
        ),
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
        path: "propietaris",
        element: (
          <RoleGuard allowedRoles={['superadmin']}>
            <PropietarisPage />
          </RoleGuard>
        ),
        children: [
          {
            path: "actius",
            element: <ComingSoon title="Propietaris Actius" />,
          },
          {
            path: "nou",
            element: <ComingSoon title="Nou Propietari" />,
          },
          {
            path: ":id",
            element: <ComingSoon title="Detalls del Propietari" />,
          },
          {
            path: ":id/editar",
            element: <ComingSoon title="Editar Propietari" />,
          },
        ],
      },
      {
        path: "allotjaments",
        element: (
          <RoleGuard allowedRoles={['superadmin', 'propietari']}>
            <AllotjamentsPage />
          </RoleGuard>
        ),
        children: [
          {
            path: "actius",
            element: <ComingSoon title="Allotjaments Actius" />,
          },
          {
            path: "nou",
            element: <ComingSoon title="Nou Allotjament" />,
          },
          {
            path: ":id",
            element: <ComingSoon title="Detalls de l'Allotjament" />,
          },
          {
            path: ":id/editar",
            element: <ComingSoon title="Editar Allotjament" />,
          },
        ],
      },
      {
        path: "reserves",
        element: (
          <RoleGuard allowedRoles={['superadmin', 'propietari']}>
            <ReservesPage />
          </RoleGuard>
        ),
        children: [
          {
            path: "nova",
            element: <ComingSoon title="Nova Reserva" />,
          },
          {
            path: "avui",
            element: <ComingSoon title="Reserves d'Avui" />,
          },
          {
            path: "pendents",
            element: <ComingSoon title="Reserves Pendents" />,
          },
          {
            path: ":id",
            element: <ComingSoon title="Detalls de la Reserva" />,
          },
          {
            path: ":id/editar",
            element: <ComingSoon title="Editar Reserva" />,
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
      {
        path: "viatgers",
        element: (
          <RoleGuard allowedRoles={['superadmin', 'propietari']}>
            <ViatgersPage />
          </RoleGuard>
        ),
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
  // Formulari públic de viatgers (sense autenticació)
  {
    path: "/formulari-viatger/:token",
    element: <FormulariViatgerPage />,
  },
  // Formulari públic de reserva (nou sistema)
  {
    path: "/formulari/:token",
    element: <FormulariViatgerPage />,
  },
])

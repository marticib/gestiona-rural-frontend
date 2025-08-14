import { useAuth } from '@/contexts/auth-context.jsx'
import { Navigate } from 'react-router-dom'

export function PublicRoute({ children }) {
  const { user, isLoading } = useAuth()

  // Mentre carrega, mostra spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregant...</p>
        </div>
      </div>
    )
  }

  // Si ja hi ha usuari, redirigeix al dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  // Si no hi ha usuari, mostra el contingut (login)
  return children
}

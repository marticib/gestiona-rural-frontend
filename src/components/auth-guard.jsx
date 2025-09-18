import { useAuth } from '@/contexts/auth-context.jsx'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function AuthGuard({ children }) {
  const { user, isLoading, logout } = useAuth()
  const navigate = useNavigate()

  // Si no hi ha usuari i no està carregant, redirigir a la landing page
  useEffect(() => {
    if (!isLoading && !user) {
      console.log('No authenticated user, redirecting to landing page...')
      navigate('/', { replace: true })
    }
  }, [isLoading, user, navigate])

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

  // Si no hi ha usuari, mostrar loading mentre es redirigeix
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Redirigint a la pàgina principal...</p>
        </div>
      </div>
    )
  }

  // Si hi ha usuari, mostra el contingut
  return children
}

import { useAuth } from '@/contexts/auth-context.jsx'

export function PublicLanding({ children }) {
  const { isLoading } = useAuth()

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

  // Sempre mostra el contingut, independentment de si hi ha usuari o no
  return children
}
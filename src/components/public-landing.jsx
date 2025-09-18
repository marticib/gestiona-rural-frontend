import { useAuth } from '@/contexts/auth-context.jsx'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function PublicLanding({ children }) {
  const { isLoading, user } = useAuth()
  const navigate = useNavigate()
  const [ssoProcessed, setSsoProcessed] = useState(false)

  // Detectar si venim del Hub amb SSO
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const hasSSOToken = urlParams.has('sso_token')
    
    // Si hi ha token SSO, marquem que s'està processant SSO
    if (hasSSOToken) {
      setSsoProcessed(true)
    }
  }, [])

  // Si venim del Hub amb SSO i ja tenim usuari, redirigir al dashboard
  // PERÒ NO si estem a la pàgina de login (login local)
  useEffect(() => {
    const isLoginPage = window.location.pathname === '/login'
    if (!isLoading && user && ssoProcessed && !isLoginPage) {
      navigate('/app', { replace: true })
    }
  }, [isLoading, user, ssoProcessed, navigate])

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

  // Mostra la landing page (fins i tot si hi ha usuari però no venim del Hub)
  return children
}
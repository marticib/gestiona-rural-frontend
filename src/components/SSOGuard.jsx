import { useEffect, useState } from 'react'
import ssoService from '../services/ssoService'

export function SSOGuard({ children }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    initSSO()
  }, [])

  const initSSO = async () => {
    // Comprovar si hi ha paràmetres SSO a la URL
    const ssoCheck = ssoService.checkSSO()
    
    if (ssoCheck.hasSSO) {
      // Hi ha token SSO, verificar-lo
      const result = await ssoService.verifySSO(ssoCheck.token)
      
      if (result.success) {
        setAuthenticated(true)
      } else {
        // Token no vàlid, redirigir al hub
        ssoService.redirectToHub()
        return
      }
    } else {
      // No hi ha SSO, comprovar si ja està autenticat
      if (ssoService.isAuthenticated()) {
        setAuthenticated(true)
      } else {
        // No autenticat, redirigir al hub
        ssoService.redirectToHub()
        return
      }
    }
    
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="text-xl font-semibold text-gray-900">Connectant amb Gestiona Hub...</h2>
          <p className="text-gray-600">Verificant credencials d'accés</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-red-600">Accés denegat</h2>
          <p className="text-gray-600">Redirigint a Gestiona Hub...</p>
        </div>
      </div>
    )
  }

  return children
}

import { authService } from '@/services/auth'

// Guardar referència original de fetch
const originalFetch = window.fetch

// Només activar l'interceptor si no estem a la landing page
if (window.location.pathname !== '/') {
  // Interceptor global per a totes les crides fetch
  window.fetch = async (url, options = {}) => {
    // Si és una crida a la API i no és login/register, afegir autenticació
    if (typeof url === 'string' && url.includes('/api/') && !url.includes('/auth/login') && !url.includes('/auth/register')) {
      const token = authService.getToken()
      
      if (!token) {
        // No hi ha token, permetre que les crides fallin sense redirigir automàticament
        // L'AuthGuard ja s'encarregarà de redirigir si cal
        console.warn('No authentication token found, API call will proceed without auth')
      } else {
        // Afegir headers d'autenticació només si hi ha token
        options.headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers
        }
      }
    }

    try {
      const response = await originalFetch(url, options)
      
      // Si la resposta és 401, gestionar sessió expirada
      if (response.status === 401 && !window.location.pathname.includes('/login') && window.location.pathname !== '/') {
        authService.logout()
        alert('La teva sessió ha expirat. Hauràs de tornar a iniciar sessió.')
        window.location.href = '/'
      }
      
      return response
    } catch (error) {
      console.error('Error in fetch interceptor:', error)
      throw error
    }
  }
}

export { originalFetch }

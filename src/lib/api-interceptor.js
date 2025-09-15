import { authService } from '@/services/auth'

// Només activar l'interceptor si no estem a la landing page
if (window.location.pathname !== '/') {
  // Interceptor global per a totes les crides fetch
  const originalFetch = window.fetch

  window.fetch = async (url, options = {}) => {
    // Si és una crida a la API i no és login/register, afegir autenticació
    if (typeof url === 'string' && url.includes('/api/') && !url.includes('/auth/login') && !url.includes('/auth/register')) {
      const token = authService.getToken()
      
      if (!token) {
        // No hi ha token, però només redirigir si no estem a la landing page
        if (window.location.pathname !== '/' && !window.location.pathname.includes('/landing')) {
          console.warn('No authentication token found, redirecting to login')
          window.location.href = '/login'
          throw new Error('No authentication token available')
        }
        
        // Si estem a la landing page, permetre que la crida falli sense redirigir
        console.warn('No authentication token found on landing page, API call will fail')
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
      
      // Si la resposta és 401 i no és al login, gestionar sessió expirada
      if (response.status === 401 && !window.location.pathname.includes('/login')) {
        authService.logout()
        alert('La teva sessió ha expirat. Hauràs de tornar a iniciar sessió.')
        window.location.href = '/login'
      }
      
      return response
    } catch (error) {
      console.error('Error in fetch interceptor:', error)
      throw error
    }
  }
}

export { originalFetch }

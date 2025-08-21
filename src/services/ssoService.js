import axios from 'axios'

const HUB_API_URL = import.meta.env.VITE_HUB_API_URL || 'http://localhost:8000/api'
const HUB_URL = import.meta.env.VITE_HUB_URL || 'http://localhost:3000'
const LOCAL_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api'

const ssoService = {
  // Verificar token SSO amb Gestiona Hub
  async verifySSO(token) {
    try {
      const response = await axios.post(`${HUB_API_URL}/sso/verify`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.data.success) {
        // Guardar dades d'usuari i token per la sessió local
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        return {
          success: true,
          user: response.data.user,
          token: token
        }
      }

      return { success: false, message: response.data.message }
    } catch (error) {
      console.error('Error verificant SSO:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de connexió amb Gestiona Hub' 
      }
    }
  },

  // Comprovar si hi ha paràmetres SSO a la URL
  checkSSO() {
    const urlParams = new URLSearchParams(window.location.search)
    const ssoToken = urlParams.get('sso_token')
    const returnUrl = urlParams.get('return_url')

    if (ssoToken) {
      // Netejar URL
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)

      return {
        hasSSO: true,
        token: ssoToken,
        returnUrl: returnUrl
      }
    }

    return { hasSSO: false }
  },

  // Redirigir a Gestiona Hub per login
  redirectToHub() {
    const returnUrl = encodeURIComponent(window.location.origin)
    const hubLoginUrl = `${HUB_URL}/login?return_url=${returnUrl}&app=gestiona-rural`
    window.location.href = hubLoginUrl
  },

  // Logout i redirigir al hub
  logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    
    // Redirigir al hub
    const hubUrl = `${HUB_URL}/app/applications`
    window.location.href = hubUrl
  },

  // Verificar si l'usuari està autenticat
  isAuthenticated() {
    const token = localStorage.getItem('auth_token')
    const user = localStorage.getItem('user')
    return !!(token && user)
  },

  // Obtenir usuari actual
  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  // Obtenir token actual
  getToken() {
    return localStorage.getItem('auth_token')
  }
}

export default ssoService

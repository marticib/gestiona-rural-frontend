class AuthService {
  getToken() {
    return localStorage.getItem('auth_token')
  }

  getUser() {
    const savedUser = localStorage.getItem('user')
    try {
      return savedUser ? JSON.parse(savedUser) : null
    } catch (error) {
      console.error('Error parsing user from localStorage:', error)
      return null
    }
  }

  isAuthenticated() {
    return !!this.getToken()
  }

  logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  async validateToken() {
    const token = this.getToken()
    
    if (!token) {
      return false
    }

    try {
      const response = await fetch('http://192.168.12.36:8000/api/auth/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })

      if (response.ok) {
        return true
      } else {
        // Token invàlid, netejar localStorage
        this.logout()
        return false
      }
    } catch (error) {
      console.error('Error validating token:', error)
      this.logout()
      return false
    }
  }

  async makeAuthenticatedRequest(url, options = {}) {
    const token = this.getToken()
    
    if (!token) {
      // Redirigir immediatament al login si no hi ha token
      window.location.href = '/login'
      throw new Error('No authentication token available')
    }

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    }

    try {
      const response = await fetch(url, config)
      
      // Si la resposta és 401, el token ha expirat
      if (response.status === 401) {
        this.logout()
        
        // Mostrar missatge i redirigir
        if (window.location.pathname !== '/login') {
          alert('La teva sessió ha expirat. Hauràs de tornar a iniciar sessió.')
          window.location.href = '/login'
        }
        
        throw new Error('Token expired')
      }

      return response
    } catch (error) {
      console.error('Error in authenticated request:', error)
      throw error
    }
  }
}

export const authService = new AuthService()

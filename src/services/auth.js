import { hubApi } from './apiService'
import ssoService from './ssoService'

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

  setAuthData(token, user) {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    // Redirect to Hub for logout
    window.location.href = `${import.meta.env.VITE_HUB_APP_URL}/logout`
  }

  async validateToken() {
    const token = this.getToken()
    
    if (!token) {
      return false
    }

    try {
      // Validate token with Hub API
      const response = await hubApi.get('/auth/user')
      return response.status === 200
    } catch (error) {
      console.error('Error validating token:', error)
      this.logout()
      return false
    }
  }

  // Legacy method for backward compatibility
  async makeAuthenticatedRequest(url, options = {}) {
    console.warn('makeAuthenticatedRequest is deprecated. Use hubApi or localApi instead.')
    
    const token = this.getToken()
    
    if (!token) {
      // Redirect to Hub for authentication
      window.location.href = `${import.meta.env.VITE_HUB_APP_URL}/login`
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
      
      // If response is 401, token has expired
      if (response.status === 401) {
        this.logout()
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

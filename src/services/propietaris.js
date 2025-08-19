import { authService } from './auth'

const API_BASE_URL = 'http://192.168.12.36:8000/api'

class PropietarisApiService {
  async getAll(params = {}) {
    try {
      const url = new URL(`${API_BASE_URL}/propietaris`)
      
      // Afegir paràmetres de consulta
      Object.keys(params).forEach(key => {
        if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
          url.searchParams.append(key, params[key])
        }
      })

      const response = await authService.makeAuthenticatedRequest(url.toString(), {
        method: 'GET',
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en obtenir els propietaris')
      }

      return data
    } catch (error) {
      console.error('Error in getAll:', error)
      throw error
    }
  }

  async getById(id) {
    try {
      const response = await authService.makeAuthenticatedRequest(`${API_BASE_URL}/propietaris/${id}`, {
        method: 'GET',
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en obtenir el propietari')
      }

      return data
    } catch (error) {
      console.error('Error in getById:', error)
      throw error
    }
  }

  async create(propietariData) {
    try {
      const response = await fetch(`${API_BASE_URL}/propietaris`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(propietariData),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en crear el propietari')
      }

      return data
    } catch (error) {
      console.error('Error in create:', error)
      throw error
    }
  }

  async update(id, propietariData) {
    try {
      const response = await fetch(`${API_BASE_URL}/propietaris/${id}`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(propietariData),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en actualitzar el propietari')
      }

      return data
    } catch (error) {
      console.error('Error in update:', error)
      throw error
    }
  }

  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/propietaris/${id}`, {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en eliminar el propietari')
      }

      return data
    } catch (error) {
      console.error('Error in delete:', error)
      throw error
    }
  }

  async getActius() {
    try {
      const response = await fetch(`${API_BASE_URL}/propietaris/actius/list`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en obtenir els propietaris actius')
      }

      return data
    } catch (error) {
      console.error('Error in getActius:', error)
      throw error
    }
  }
}

export const PropietarisService = new PropietarisApiService()

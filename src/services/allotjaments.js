import { authService } from './auth'

const API_BASE_URL = 'http://192.168.12.36:8000/api'

class AllotjamentsApiService {
  async getAuthHeaders() {
    const token = authService.getToken()
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  async getAll(params = {}) {
    try {
      const url = new URL(`${API_BASE_URL}/allotjaments`)
      
      // Afegir paràmetres de consulta
      Object.keys(params).forEach(key => {
        if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
          url.searchParams.append(key, params[key])
        }
      })

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en obtenir els allotjaments')
      }

      return data
    } catch (error) {
      console.error('Error in getAll:', error)
      throw error
    }
  }

  async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/allotjaments/${id}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en obtenir l\'allotjament')
      }

      return data
    } catch (error) {
      console.error('Error in getById:', error)
      throw error
    }
  }

  async create(allotjamentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/allotjaments`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(allotjamentData),
      })

      const data = await response.json()
      
      if (!response.ok) {
        // Si són errors de validació (422), retornem la resposta amb els errors
        if (response.status === 422) {
          return {
            success: false,
            message: data.message || 'Errors de validació',
            errors: data.errors || {}
          }
        }
        
        // Per altres errors, retornem la resposta d'error
        return {
          success: false,
          message: data.message || 'Error en crear l\'allotjament'
        }
      }

      return data
    } catch (error) {
      console.error('Error in create:', error)
      return {
        success: false,
        message: 'Error de connexió amb el servidor'
      }
    }
  }

  async update(id, allotjamentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/allotjaments/${id}`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(allotjamentData),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en actualitzar l\'allotjament')
      }

      return data
    } catch (error) {
      console.error('Error in update:', error)
      throw error
    }
  }

  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/allotjaments/${id}`, {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en eliminar l\'allotjament')
      }

      return data
    } catch (error) {
      console.error('Error in delete:', error)
      throw error
    }
  }

  async getActius() {
    try {
      const response = await fetch(`${API_BASE_URL}/allotjaments/actius/list`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en obtenir els allotjaments actius')
      }

      return data
    } catch (error) {
      console.error('Error in getActius:', error)
      throw error
    }
  }

  async getByPropietari(propietariId) {
    try {
      const response = await fetch(`${API_BASE_URL}/allotjaments/propietari/${propietariId}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en obtenir els allotjaments del propietari')
      }

      return data
    } catch (error) {
      console.error('Error in getByPropietari:', error)
      throw error
    }
  }
}

export const AllotjamentsService = new AllotjamentsApiService()

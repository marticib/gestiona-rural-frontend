import { authService } from './auth'

const API_BASE_URL = 'http://192.168.12.36:8000/api'

class ClientsApiService {
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
      const url = new URL(`${API_BASE_URL}/clients`)
      
      // Afegir paràmetres de consulta
      Object.keys(params).forEach(key => {
        if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
          url.searchParams.append(key, params[key])
        }
      })

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: await this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching clients:', error)
      throw error
    }
  }

  async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'GET',
        headers: await this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching client:', error)
      throw error
    }
  }

  async create(clientData) {
    try {
      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(clientData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating client:', error)
      throw error
    }
  }

  async update(id, clientData) {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(clientData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating client:', error)
      throw error
    }
  }

  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'DELETE',
        headers: await this.getAuthHeaders()
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error deleting client:', error)
      throw error
    }
  }

  async getActius(params = {}) {
    try {
      const url = new URL(`${API_BASE_URL}/clients/actius/list`)
      
      Object.keys(params).forEach(key => {
        if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
          url.searchParams.append(key, params[key])
        }
      })

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: await this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching active clients:', error)
      throw error
    }
  }

  async getHistorialReserves(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}/historial-reserves`, {
        method: 'GET',
        headers: await this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching client history:', error)
      throw error
    }
  }

  async actualitzarEstadistiques(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}/actualitzar-estadistiques`, {
        method: 'POST',
        headers: await this.getAuthHeaders()
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating client statistics:', error)
      throw error
    }
  }
}

export const ClientsService = new ClientsApiService()

import { localApi } from './apiService'

class ClientsApiService {
  async getAll(params = {}) {
    try {
      const response = await localApi.get('/clients', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching clients:', error)
      throw error
    }
  }

  async getById(id) {
    try {
      const response = await localApi.get(`/clients/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching client:', error)
      throw error
    }
  }

  async create(clientData) {
    try {
      const response = await localApi.post('/clients', clientData)
      return response.data
    } catch (error) {
      console.error('Error creating client:', error)
      
      // Si és un error de validació (422), retornar l'error en el format esperat
      if (error.response && error.response.status === 422) {
        return {
          success: false,
          errors: error.response.data.errors || {},
          message: error.response.data.message || 'Error de validació'
        }
      }
      
      // Per altres errors, retornar un error genèric
      if (error.response && error.response.data) {
        return {
          success: false,
          message: error.response.data.message || 'Error en crear el client'
        }
      }
      
      // Error de connexió o altres
      return {
        success: false,
        message: 'Error de connexió'
      }
    }
  }

  async update(id, clientData) {
    try {
      const response = await localApi.put(`/clients/${id}`, clientData)
      return response.data
    } catch (error) {
      console.error('Error updating client:', error)
      
      // Si és un error de validació (422), retornar l'error en el format esperat
      if (error.response && error.response.status === 422) {
        return {
          success: false,
          errors: error.response.data.errors || {},
          message: error.response.data.message || 'Error de validació'
        }
      }
      
      // Per altres errors, retornar un error genèric
      if (error.response && error.response.data) {
        return {
          success: false,
          message: error.response.data.message || 'Error en actualitzar el client'
        }
      }
      
      // Error de connexió o altres
      return {
        success: false,
        message: 'Error de connexió'
      }
    }
  }

  async delete(id) {
    try {
      const response = await localApi.delete(`/clients/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting client:', error)
      throw error
    }
  }

  async getActius(params = {}) {
    try {
      const response = await localApi.get('/clients/actius/list', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching active clients:', error)
      throw error
    }
  }

  async getHistorialReserves(id) {
    try {
      const response = await localApi.get(`/clients/${id}/historial-reserves`)
      return response.data
    } catch (error) {
      console.error('Error fetching client reservation history:', error)
      throw error
    }
  }

  async actualitzarEstadistiques(id) {
    try {
      const response = await localApi.post(`/clients/${id}/actualitzar-estadistiques`)
      return response.data
    } catch (error) {
      console.error('Error updating client statistics:', error)
      throw error
    }
  }
}

export const ClientsService = new ClientsApiService()

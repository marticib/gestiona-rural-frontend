import { localApi } from './apiService'

class AllotjamentsApiService {

  async getAll(params = {}) {
    try {
      const response = await localApi.get('/allotjaments', { params })
      return response.data
    } catch (error) {
      console.error('Error in getAll:', error)
      throw error
    }
  }

  async getById(id) {
    try {
      const response = await localApi.get(`/allotjaments/${id}`)
      return response.data
    } catch (error) {
      console.error('Error in getById:', error)
      throw error
    }
  }

  async create(allotjamentData) {
    try {
      const response = await localApi.post('/allotjaments', allotjamentData)
      return response.data
    } catch (error) {
      console.error('Error in create:', error)
      // Si són errors de validació (422), retornem la resposta amb els errors
      if (error.response?.status === 422) {
        return {
          success: false,
          message: error.response.data.message || 'Errors de validació',
          errors: error.response.data.errors || {}
        }
      }
      
      // Per altres errors, retornem la resposta d'error
      return {
        success: false,
        message: error.response?.data?.message || 'Error en crear l\'allotjament'
      }
    }
  }

  async update(id, allotjamentData) {
    try {
      const response = await localApi.put(`/allotjaments/${id}`, allotjamentData)
      return response.data
    } catch (error) {
      console.error('Error in update:', error)
      throw error
    }
  }

  async delete(id) {
    try {
      const response = await localApi.delete(`/allotjaments/${id}`)
      return response.data
    } catch (error) {
      console.error('Error in delete:', error)
      throw error
    }
  }

  async getActius() {
    try {
      const response = await localApi.get('/allotjaments/actius/list')
      return response.data
    } catch (error) {
      console.error('Error in getActius:', error)
      throw error
    }
  }

  async getByPropietari(propietariId) {
    try {
      const response = await localApi.get(`/allotjaments/propietari/${propietariId}`)
      return response.data
    } catch (error) {
      console.error('Error in getByPropietari:', error)
      throw error
    }
  }
}

export const AllotjamentsService = new AllotjamentsApiService()

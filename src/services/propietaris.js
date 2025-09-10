import { localApi } from './apiService'

class PropietarisApiService {
  async getAll(params = {}) {
    try {
      const response = await localApi.get('/propietaris', { params })
      return response.data
    } catch (error) {
      console.error('Error in getAll:', error)
      throw error
    }
  }

  async getById(id) {
    try {
      const response = await localApi.get(`/propietaris/${id}`)
      return response.data
    } catch (error) {
      console.error('Error in getById:', error)
      throw error
    }
  }

  async create(propietariData) {
    try {
      const response = await localApi.post('/propietaris', propietariData)
      return response.data
    } catch (error) {
      console.error('Error in create:', error)
      throw error
    }
  }

  async update(id, propietariData) {
    try {
      const response = await localApi.put(`/propietaris/${id}`, propietariData)
      return response.data
    } catch (error) {
      console.error('Error in update:', error)
      throw error
    }
  }

  async delete(id) {
    try {
      const response = await localApi.delete(`/propietaris/${id}`)
      return response.data
    } catch (error) {
      console.error('Error in delete:', error)
      throw error
    }
  }

  async getActius() {
    try {
      const response = await localApi.get('/propietaris/actius/list')
      return response.data
    } catch (error) {
      console.error('Error in getActius:', error)
      throw error
    }
  }

  async getByEmail(email) {
    try {
      const response = await localApi.get(`/propietaris/by-email/${encodeURIComponent(email)}`)
      return response.data
    } catch (error) {
      console.error('Error in getByEmail:', error)
      throw error
    }
  }
}

export const PropietarisService = new PropietarisApiService()

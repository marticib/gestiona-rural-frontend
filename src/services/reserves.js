import { localApi } from './apiService'

class ReservesApiService {

  async getAll(params = {}) {
    try {
      // Filtrar paràmetres buits abans d'enviar
      const cleanParams = {}
      Object.keys(params).forEach(key => {
        const value = params[key]
        if (value !== null && value !== undefined && value !== '') {
          cleanParams[key] = value
        }
      })

      const response = await localApi.get('/reserves', { params: cleanParams })
      return response.data
    } catch (error) {
      console.error('Error in getAll:', error)
      throw error
    }
  }

  async getById(id) {
    try {
      const response = await localApi.get(`/reserves/${id}`)
      return response.data
    } catch (error) {
      console.error('Error in getById:', error)
      throw error
    }
  }

  async create(reservaData) {
    try {
      const response = await localApi.post('/reserves', reservaData)
      return response.data
    } catch (error) {
      console.error('Error in create:', error)
      throw error
    }
  }

  async update(id, reservaData) {
    try {
      const response = await localApi.put(`/reserves/${id}`, reservaData)
      return response.data
    } catch (error) {
      console.error('Error in update:', error)
      throw error
    }
  }

  async delete(id) {
    try {
      const response = await localApi.delete(`/reserves/${id}`)
      return response.data
    } catch (error) {
      console.error('Error in delete:', error)
      throw error
    }
  }

  async confirmar(id) {
    try {
      const response = await localApi.post(`/reserves/${id}/confirmar`)
      return response.data
    } catch (error) {
      console.error('Error in confirmar:', error)
      throw error
    }
  }

  async marcarComPagada(id) {
    try {
      const response = await localApi.post(`/reserves/${id}/pagar`)
      return response.data
    } catch (error) {
      console.error('Error in marcarComPagada:', error)
      throw error
    }
  }

  async cancellar(id, motiu = '') {
    try {
      const response = await localApi.post(`/reserves/${id}/cancellar`, { motiu })
      return response.data
    } catch (error) {
      console.error('Error in cancellar:', error)
      throw error
    }
  }

  async checkIn(id) {
    try {
      const response = await localApi.post(`/reserves/${id}/checkin`)
      return response.data
    } catch (error) {
      console.error('Error in checkIn:', error)
      throw error
    }
  }

  async checkOut(id) {
    try {
      const response = await localApi.post(`/reserves/${id}/checkout`)
      return response.data
    } catch (error) {
      console.error('Error in checkOut:', error)
      throw error
    }
  }

  async getByAllotjament(allotjamentId) {
    try {
      const response = await localApi.get(`/reserves/allotjament/${allotjamentId}`)
      return response.data
    } catch (error) {
      console.error('Error in getByAllotjament:', error)
      throw error
    }
  }

  async getAvui() {
    try {
      const response = await localApi.get('/reserves/dashboard/avui')
      return response.data
    } catch (error) {
      console.error('Error in getAvui:', error)
      throw error
    }
  }
}

export const ReservesService = new ReservesApiService()

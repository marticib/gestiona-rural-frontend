import { localApi } from './apiService'

class ViatgersApiService {

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

      const response = await localApi.get('/viatgers', { params: cleanParams })
      return response.data
    } catch (error) {
      console.error('Error in getAll:', error)
      throw error
    }
  }

  async getById(id) {
    try {
      const response = await localApi.get(`/viatgers/${id}`)
      return response.data
    } catch (error) {
      console.error('Error in getById:', error)
      throw error
    }
  }

  async create(viatgersData) {
    try {
      const response = await localApi.post('/viatgers', viatgersData)
      return response.data
    } catch (error) {
      console.error('Error in create:', error)
      throw error
    }
  }

  async generarFormulariReserva(formulariData) {
    try {
      // Només necessitem reserva_id
      const response = await localApi.post('/viatgers/generar-formulari-reserva', {
        reserva_id: formulariData.reserva_id
      })
      return response.data
    } catch (error) {
      console.error('Error in generarFormulariReserva:', error)
      throw error
    }
  }

  async eliminarFormulariReserva(reservaId) {
    try {
      const response = await localApi.delete('/viatgers/eliminar-formulari-reserva', {
        data: { reserva_id: reservaId }
      })
      return response.data
    } catch (error) {
      console.error('Error in eliminarFormulariReserva:', error)
      throw error
    }
  }

  async getFormulariReserva(reservaId) {
    try {
      const response = await localApi.get(`/formularis-reserva/${reservaId}`)
      return response.data
    } catch (error) {
      console.error('Error in getFormulariReserva:', error)
      // Si no existeix, retornem null en lloc de llançar error
      if (error.response?.status === 404) {
        return null
      }
      throw error
    }
  }

  async update(id, viatgerData) {
    try {
      const response = await localApi.put(`/viatgers/${id}`, viatgerData)
      return response.data
    } catch (error) {
      console.error('Error in update:', error)
      throw error
    }
  }

  async delete(id) {
    try {
      const response = await localApi.delete(`/viatgers/${id}`)
      return response.data
    } catch (error) {
      console.error('Error in delete:', error)
      throw error
    }
  }

  async getByReserva(reservaId) {
    try {
      const response = await localApi.get('/viatgers', { 
        params: { reserva_id: reservaId } 
      })
      return response.data
    } catch (error) {
      console.error('Error in getByReserva:', error)
      throw error
    }
  }

  async getEstadistiques(reservaId = null) {
    try {
      const params = reservaId ? { reserva_id: reservaId } : {}
      const response = await localApi.get('/viatgers/estadistiques', { params })
      return response.data
    } catch (error) {
      console.error('Error in getEstadistiques:', error)
      throw error
    }
  }

  async generarTxtMossos(reservaId) {
    try {
      const response = await localApi.post('/viatgers/generar-txt-mossos', {
        reserva_id: reservaId
      })
      return response.data
    } catch (error) {
      console.error('Error in generarTxtMossos:', error)
      throw error
    }
  }

  async downloadTxt(fileName) {
    try {
      const response = await localApi.get(`/viatgers/download-txt/${fileName}`, {
        responseType: 'blob'
      })
      
      // Crear un link temporal per descarregar
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      return { success: true }
    } catch (error) {
      console.error('Error in downloadTxt:', error)
      throw error
    }
  }

  // Formulari públic (sense autenticació)
  async getFormulariPublic(token) {
    try {
      // Primer provem amb el nou endpoint per formularis de reserva
      const response = await localApi.get(`/formulari/${token}`)
      return response.data
    } catch (error) {
      console.error('Error in getFormulariPublic:', error)
      // Si falla, provem amb l'endpoint antic per compatibilitat
      try {
        const response = await localApi.get(`/formulari-viatger/${token}`)
        return response.data
      } catch (oldError) {
        console.error('Error with old endpoint too:', oldError)
        throw error // Llançem l'error original
      }
    }
  }

  async omplirFormulariPublic(token, formData) {
    try {
      // Usar el nou endpoint per formularis de reserva
      const response = await localApi.post(`/formulari/${token}`, formData)
      return response.data
    } catch (error) {
      console.error('Error in omplirFormulariPublic:', error)
      throw error
    }
  }
}

export const ViatgersService = new ViatgersApiService()
export default ViatgersService

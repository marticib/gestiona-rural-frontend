import { authService } from './auth'

const API_BASE_URL = 'http://192.168.12.36:8000/api'

class ReservesApiService {
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
      const url = new URL(`${API_BASE_URL}/reserves`)
      
      // Afegir paràmetres de consulta
      Object.keys(params).forEach(key => {
        if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
          // Mapear els noms dels filtres frontend als noms de la BD
          let paramKey = key
          if (key === 'plataforma') paramKey = 'plataforma_origen'
          url.searchParams.append(paramKey, params[key])
        }
      })

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en obtenir les reserves')
      }

      return data
    } catch (error) {
      console.error('Error in getAll:', error)
      throw error
    }
  }

  async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/reserves/${id}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en obtenir la reserva')
      }

      return data
    } catch (error) {
      console.error('Error in getById:', error)
      throw error
    }
  }

  async create(reservaData) {
    try {
      const response = await fetch(`${API_BASE_URL}/reserves`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(reservaData),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en crear la reserva')
      }

      return data
    } catch (error) {
      console.error('Error in create:', error)
      throw error
    }
  }

  async update(id, reservaData) {
    try {
      const response = await fetch(`${API_BASE_URL}/reserves/${id}`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(reservaData),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en actualitzar la reserva')
      }

      return data
    } catch (error) {
      console.error('Error in update:', error)
      throw error
    }
  }

  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/reserves/${id}`, {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en eliminar la reserva')
      }

      return data
    } catch (error) {
      console.error('Error in delete:', error)
      throw error
    }
  }

  async confirmar(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/reserves/${id}/confirmar`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en confirmar la reserva')
      }

      return data
    } catch (error) {
      console.error('Error in confirmar:', error)
      throw error
    }
  }

  async marcarComPagada(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/reserves/${id}/pagar`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en marcar com a pagada')
      }

      return data
    } catch (error) {
      console.error('Error in marcarComPagada:', error)
      throw error
    }
  }

  async cancellar(id, motiu = '') {
    try {
      const response = await fetch(`${API_BASE_URL}/reserves/${id}/cancellar`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ motiu }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en cancel·lar la reserva')
      }

      return data
    } catch (error) {
      console.error('Error in cancellar:', error)
      throw error
    }
  }

  async checkIn(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/reserves/${id}/checkin`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en fer el check-in')
      }

      return data
    } catch (error) {
      console.error('Error in checkIn:', error)
      throw error
    }
  }

  async checkOut(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/reserves/${id}/checkout`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en fer el check-out')
      }

      return data
    } catch (error) {
      console.error('Error in checkOut:', error)
      throw error
    }
  }

  async getByAllotjament(allotjamentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/reserves/allotjament/${allotjamentId}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en obtenir les reserves de l\'allotjament')
      }

      return data
    } catch (error) {
      console.error('Error in getByAllotjament:', error)
      throw error
    }
  }

  async getAvui() {
    try {
      const response = await fetch(`${API_BASE_URL}/reserves/dashboard/avui`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en obtenir les reserves d\'avui')
      }

      return data
    } catch (error) {
      console.error('Error in getAvui:', error)
      throw error
    }
  }
}

export const ReservesService = new ReservesApiService()

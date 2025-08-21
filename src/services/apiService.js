import axios from 'axios'

const HUB_API_URL = import.meta.env.VITE_HUB_API_URL || 'http://localhost:8000/api'
const LOCAL_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api'

// Configurar interceptors per axios
const createApiClient = (baseURL) => {
  const client = axios.create({ baseURL })
  
  // Interceptor per afegir token automàticament
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // Interceptor per gestionar errors d'autenticació
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expirat o no vàlid, redirigir al hub
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        
        const HUB_URL = import.meta.env.VITE_HUB_URL || 'http://localhost:3000'
        const returnUrl = encodeURIComponent(window.location.origin)
        window.location.href = `${HUB_URL}/login?return_url=${returnUrl}&app=gestiona-rural`
      }
      return Promise.reject(error)
    }
  )

  return client
}

// Clients d'API
const hubApi = createApiClient(HUB_API_URL)
const localApi = createApiClient(LOCAL_API_URL)

const apiService = {
  // ========== GESTIÓ D'USUARIS (Hub) ==========
  async getCurrentUser() {
    try {
      const response = await hubApi.get('/auth/user')
      return { success: true, user: response.data.user }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error obtenint usuari' 
      }
    }
  },

  async updateProfile(data) {
    try {
      const response = await hubApi.put('/profile', data)
      return { success: true, user: response.data.user }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error actualitzant perfil',
        errors: error.response?.data?.errors || {}
      }
    }
  },

  // ========== DADES LOCALS (Gestiona Rural) ==========
  
  // Reserves
  async getReserves() {
    try {
      const response = await localApi.get('/reserves')
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error obtenint reserves' 
      }
    }
  },

  async createReserve(data) {
    try {
      const response = await localApi.post('/reserves', data)
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error creant reserva',
        errors: error.response?.data?.errors || {}
      }
    }
  },

  async updateReserve(id, data) {
    try {
      const response = await localApi.put(`/reserves/${id}`, data)
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error actualitzant reserva',
        errors: error.response?.data?.errors || {}
      }
    }
  },

  async deleteReserve(id) {
    try {
      await localApi.delete(`/reserves/${id}`)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error eliminant reserva' 
      }
    }
  },

  // Allotjaments
  async getAccommodations() {
    try {
      const response = await localApi.get('/accommodations')
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error obtenint allotjaments' 
      }
    }
  },

  async createAccommodation(data) {
    try {
      const response = await localApi.post('/accommodations', data)
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error creant allotjament',
        errors: error.response?.data?.errors || {}
      }
    }
  },

  async updateAccommodation(id, data) {
    try {
      const response = await localApi.put(`/accommodations/${id}`, data)
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error actualitzant allotjament',
        errors: error.response?.data?.errors || {}
      }
    }
  },

  async deleteAccommodation(id) {
    try {
      await localApi.delete(`/accommodations/${id}`)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error eliminant allotjament' 
      }
    }
  },

  // Clients
  async getClients() {
    try {
      const response = await localApi.get('/clients')
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error obtenint clients' 
      }
    }
  },

  async createClient(data) {
    try {
      const response = await localApi.post('/clients', data)
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error creant client',
        errors: error.response?.data?.errors || {}
      }
    }
  },

  async updateClient(id, data) {
    try {
      const response = await localApi.put(`/clients/${id}`, data)
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error actualitzant client',
        errors: error.response?.data?.errors || {}
      }
    }
  },

  async deleteClient(id) {
    try {
      await localApi.delete(`/clients/${id}`)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error eliminant client' 
      }
    }
  },

  // Propietaris
  async getOwners() {
    try {
      const response = await localApi.get('/owners')
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error obtenint propietaris' 
      }
    }
  },

  async createOwner(data) {
    try {
      const response = await localApi.post('/owners', data)
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error creant propietari',
        errors: error.response?.data?.errors || {}
      }
    }
  },

  async updateOwner(id, data) {
    try {
      const response = await localApi.put(`/owners/${id}`, data)
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error actualitzant propietari',
        errors: error.response?.data?.errors || {}
      }
    }
  },

  async deleteOwner(id) {
    try {
      await localApi.delete(`/owners/${id}`)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error eliminant propietari' 
      }
    }
  },

  // Dashboard/Stats
  async getDashboardStats() {
    try {
      const response = await localApi.get('/dashboard/stats')
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error obtenint estadístiques' 
      }
    }
  },

  // Utilitats
  getHubApi() {
    return hubApi
  },

  getLocalApi() {
    return localApi
  }
}

export default apiService
export { hubApi, localApi }

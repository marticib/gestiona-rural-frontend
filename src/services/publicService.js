// Servei per obtenir informació pública (sense autenticació)
const API_BASE_URL = import.meta.env.VITE_LOCAL_API_URL || 'http://localhost:8001/api'

const publicService = {
  // Obtenir plans públics per l'aplicació rural
  async getPublicPlans() {
    try {
      const response = await fetch(`${API_BASE_URL}/public/plans`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Error al obtenir els plans')
      }

      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error('Error obtenint plans públics:', error)
      return []
    }
  }
}

export default publicService
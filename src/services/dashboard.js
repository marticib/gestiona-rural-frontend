import { localApi } from './apiService'

class DashboardApiService {
  async getEstadistiques() {
    try {
      const response = await localApi.get('/dashboard/estadistiques')
      return response.data
    } catch (error) {
      console.error('Error in getEstadistiques:', error)
      throw error
    }
  }

  async getEvolucio(entitat, periode = '6months') {
    try {
      const response = await localApi.get(`/dashboard/evolucio/${entitat}`, {
        params: { periode }
      })
      return response.data
    } catch (error) {
      console.error('Error in getEvolucio:', error)
      throw error
    }
  }
}

const DashboardService = new DashboardApiService()
export default DashboardService

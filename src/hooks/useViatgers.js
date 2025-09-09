import { useState, useEffect, useCallback } from 'react'
import ViatgersService from '../services/viatgers'
import { toast } from 'sonner'

export const useViatgers = (reservaId = null) => {
  const [viatgers, setViatgers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [estadistiques, setEstadistiques] = useState(null)

  // Carregar viatgers
  const carregarViatgers = useCallback(async (params = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      const finalParams = reservaId ? { ...params, reserva_id: reservaId } : params
      const response = await ViatgersService.getAll(finalParams)
      
      setViatgers(response.data || [])
    } catch (error) {
      console.error('Error carregant viatgers:', error)
      setError(error.response?.data?.message || 'Error carregant viatgers')
      toast.error('Error carregant viatgers')
    } finally {
      setLoading(false)
    }
  }, [reservaId])

  // Carregar estadístiques
  const carregarEstadistiques = useCallback(async () => {
    try {
      const response = await ViatgersService.getEstadistiques(reservaId)
      setEstadistiques(response)
    } catch (error) {
      console.error('Error carregant estadístiques:', error)
    }
  }, [reservaId])

  // Crear viatger
  const crearViatger = async (viatgerData) => {
    try {
      setLoading(true)
      const response = await ViatgersService.create(viatgerData)
      
      // Afegir a la llista existent
      setViatgers(prev => [...prev, response.data])
      
      toast.success('Viatger creat correctament')
      return response
    } catch (error) {
      const message = error.response?.data?.message || 'Error creant viatger'
      setError(message)
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Actualitzar viatger
  const actualitzarViatger = async (id, viatgerData) => {
    try {
      setLoading(true)
      const response = await ViatgersService.update(id, viatgerData)
      
      // Actualitzar a la llista
      setViatgers(prev => 
        prev.map(viatger => 
          viatger.id === id ? response.data : viatger
        )
      )
      
      toast.success('Viatger actualitzat correctament')
      return response
    } catch (error) {
      const message = error.response?.data?.message || 'Error actualitzant viatger'
      setError(message)
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Eliminar viatger
  const eliminarViatger = async (id) => {
    try {
      setLoading(true)
      await ViatgersService.delete(id)
      
      // Eliminar de la llista
      setViatgers(prev => prev.filter(viatger => viatger.id !== id))
      
      toast.success('Viatger eliminat correctament')
    } catch (error) {
      const message = error.response?.data?.message || 'Error eliminant viatger'
      setError(message)
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Generar TXT per Mossos
  const generarTxtMossos = async (reservaIdParam = null) => {
    try {
      setLoading(true)
      const response = await ViatgersService.generarTxtMossos(reservaIdParam || reservaId)
      
      toast.success('Fitxer TXT generat correctament')
      return response
    } catch (error) {
      const message = error.response?.data?.message || 'Error generant fitxer TXT'
      setError(message)
      
      // No mostrar toast si l'error és sobre dades insuficients - el frontend ja ho gestiona amb més detall
      if (!message.includes('No hi ha viatgers amb formularis omplerts') && !message.includes('No hi ha viatgers amb dades suficients')) {
        toast.error(message)
      }
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Descarregar TXT
  const descarregarTxt = async (fileName) => {
    try {
      await ViatgersService.downloadTxt(fileName)
      toast.success('Fitxer descarregat correctament')
    } catch (error) {
      const message = error.response?.data?.message || 'Error descarregant fitxer'
      setError(message)
      toast.error(message)
      throw error
    }
  }

  // Efecte per carregar dades inicials
  useEffect(() => {
    carregarViatgers()
    carregarEstadistiques()
  }, [carregarViatgers, carregarEstadistiques])

  return {
    viatgers,
    loading,
    error,
    estadistiques,
    carregarViatgers,
    carregarEstadistiques,
    crearViatger,
    actualitzarViatger,
    eliminarViatger,
    generarTxtMossos,
    descarregarTxt,
    setError
  }
}

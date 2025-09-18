import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Users, 
  Plus, 
  FileText, 
  Download, 
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Link2,
  Copy,
  Trash2,
  ChevronDown,
  ChevronUp,
  Calendar
} from 'lucide-react'
import { useViatgers } from '@/hooks/useViatgers'
import GenerarFormulariModal from '@/components/GenerarFormulariModal'
import MostrarLinkModal from '@/components/MostrarLinkModal'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import ViatgersService from '@/services/viatgers'
import ReservesService from '@/services/reserves'
import { toast } from 'sonner'

const ViatgersPage = () => {
  const {
    viatgers,
    loading,
    carregarViatgers,
    generarTxtMossos,
    descarregarTxt
  } = useViatgers()

  const [reserves, setReserves] = useState([])
  const [loadingReserves, setLoadingReserves] = useState(false)

  const [filtres, setFiltres] = useState({
    cerca: '',
    estat: 'tots',
    reserva_id: 'totes'
  })

  const [mostrarFormulari, setMostrarFormulari] = useState(false)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarLinkModal, setMostrarLinkModal] = useState(false)
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null)
  const [formulariReservaSeleccionat, setFormulariReservaSeleccionat] = useState(null)
  
  // Estats per al modal d'eliminació
  const [mostrarDeleteModal, setMostrarDeleteModal] = useState(false)
  const [reservaAEliminar, setReservaAEliminar] = useState(null)
  const [eliminantFormulari, setEliminantFormulari] = useState(false)
  
  // Estats per al collapse dels viatgers
  const [reservesCollapsed, setReservesCollapsed] = useState({})
  
  // Estats per al collapse dels mesos
  const [mesosCollapsed, setMesosCollapsed] = useState(() => {
    // Obtenir el mes actual en format YYYY-MM
    const avui = new Date()
    const mesActual = `${avui.getFullYear()}-${String(avui.getMonth() + 1).padStart(2, '0')}`
    
    // Inicialitzar amb tots els mesos tancats excepte l'actual
    const initialState = {}
    // Retornem l'estat inicial buit, després s'actualitzarà quan tinguem les dades
    return initialState
  })

  // Carregar reserves per al select
  useEffect(() => {
    const carregarReserves = async () => {
      try {
        setLoadingReserves(true)
        const response = await ReservesService.getAll({ per_page: 100 }) // Carregar moltes reserves
        setReserves(response.data || [])
      } catch (error) {
        console.error('Error carregant reserves:', error)
        toast.error('Error carregant reserves')
      } finally {
        setLoadingReserves(false)
      }
    }

    carregarReserves()
  }, [])

  // Aplicar filtres
  const viatgersFiltrats = viatgers.filter(viatger => {
    const cercaMatch = !filtres.cerca || 
      viatger.nom?.toLowerCase().includes(filtres.cerca.toLowerCase()) ||
      viatger.cognoms?.toLowerCase().includes(filtres.cerca.toLowerCase()) ||
      viatger.dni?.toLowerCase().includes(filtres.cerca.toLowerCase())
    
    const estatMatch = filtres.estat === 'tots' || viatger.estat_formulari === filtres.estat
    const reservaMatch = filtres.reserva_id === 'totes' || viatger.reserva_id.toString() === filtres.reserva_id

    return cercaMatch && estatMatch && reservaMatch
  })

  // Agrupar viatgers per mes (basant-se en la data d'entrada de la reserva)
  const viatgersPerMes = viatgersFiltrats.reduce((acc, viatger) => {
    const dataEntrada = new Date(viatger.data_entrada || viatger.reserva?.data_entrada)
    const mesAny = `${dataEntrada.getFullYear()}-${String(dataEntrada.getMonth() + 1).padStart(2, '0')}`
    const nomMes = dataEntrada.toLocaleDateString('ca-ES', { year: 'numeric', month: 'long' })
    
    if (!acc[mesAny]) {
      acc[mesAny] = {
        mes: mesAny,
        nomMes: nomMes,
        reserves: {}
      }
    }

    const reservaId = viatger.reserva_id
    if (!acc[mesAny].reserves[reservaId]) {
      acc[mesAny].reserves[reservaId] = {
        reserva_id: reservaId,
        viatgers: [],
        reserva: viatger.reserva
      }
    }
    
    acc[mesAny].reserves[reservaId].viatgers.push(viatger)
    return acc
  }, {})

  // Ordenar mesos per data (més recent primer)
  const mesosOrdenats = Object.values(viatgersPerMes).sort((a, b) => b.mes.localeCompare(a.mes))

  // Inicialitzar l'estat dels mesos quan canvien els viatgers
  useEffect(() => {
    if (mesosOrdenats.length > 0) {
      const mesRecent = mesosOrdenats[0]?.mes // El primer mes de la llista ordenada (el més recent)
      
      const initialCollapsedState = {}
      mesosOrdenats.forEach(mesData => {
        // Només l'últim mes (el més recent) estarà obert (false = obert, true = tancat)
        initialCollapsedState[mesData.mes] = mesData.mes !== mesRecent
      })
      
      // Només actualitzar si l'estat ha canviat per evitar loops infinits
      setMesosCollapsed(prev => {
        const keys = Object.keys(initialCollapsedState)
        const hasChanged = keys.length !== Object.keys(prev).length || 
          keys.some(mes => prev[mes] !== initialCollapsedState[mes])
        return hasChanged ? initialCollapsedState : prev
      })
    }
  }, [viatgers, filtres])

  // Inicialitzar l'estat dels collapse de reserves (totes tancades per defecte)
  useEffect(() => {
    const allReservaIds = mesosOrdenats.flatMap(mesData => 
      Object.keys(mesData.reserves).map(reservaId => parseInt(reservaId))
    )
    
    if (allReservaIds.length > 0) {
      const initialReservesCollapsedState = {}
      allReservaIds.forEach(reservaId => {
        // Totes les reserves tancades per defecte (true = tancat)
        initialReservesCollapsedState[reservaId] = true
      })
      
      // Només actualitzar si l'estat ha canviat
      setReservesCollapsed(prev => {
        const keys = Object.keys(initialReservesCollapsedState)
        const hasChanged = keys.length !== Object.keys(prev).length || 
          keys.some(reservaId => prev[reservaId] !== initialReservesCollapsedState[reservaId])
        return hasChanged ? initialReservesCollapsedState : prev
      })
    }
  }, [viatgers, filtres])

  const handleGenerarTxt = async (reservaId) => {
    try {
      console.log('Generant TXT per a la reserva:', reservaId) // Debug
      
      // Primer, obtenir informació dels viatgers d'aquesta reserva per debug
      const viatgersReserva = viatgersFiltrats.filter(v => v.reserva_id === reservaId)
      console.log('Viatgers de la reserva:', viatgersReserva) // Debug
      console.log('Estats dels viatgers:', viatgersReserva.map(v => ({ 
        id: v.id, 
        nom: v.nom, 
        estat: v.estat_formulari 
      }))) // Debug
      
      const response = await generarTxtMossos(reservaId)
      console.log('Resposta del backend:', response) // Debug
      
      // El nom del fitxer pot estar a response.file_name o response.data.file_name
      const fileName = response.file_name || response.data?.file_name
      
      if (fileName) {
        try {
          await descarregarTxt(fileName)
          // No mostrar toast aquí - el hook ja ho gestiona
        } catch (downloadError) {
          console.error('Error descarregant fitxer:', downloadError) // Debug
          toast.error('TXT generat però error en la descàrrega: ' + (downloadError.message || 'Error desconegut'))
        }
      } else {
        console.error('No hi ha nom de fitxer a la resposta:', response) // Debug
        toast.error('No s\'ha pogut generar el fitxer TXT - No hi ha nom de fitxer')
      }
    } catch (error) {
      console.error('Error generant TXT:', error) // Debug
      const errorMessage = error?.response?.data?.message || error.message || 'Error desconegut'
      
      if (errorMessage.includes('No hi ha viatgers amb formularis omplerts') || errorMessage.includes('No hi ha viatgers amb dades suficients')) {
        const viatgersReserva = viatgersFiltrats.filter(v => v.reserva_id === reservaId)
        const viatgersOmplerts = viatgersReserva.filter(v => v.estat_formulari === 'omplert')
        const viatgersPendents = viatgersReserva.filter(v => v.estat_formulari === 'pendent')
        const viatgersAmbDades = viatgersReserva.filter(v => 
          v.nom && v.cognoms && v.dni_passaport && v.data_naixement && v.nacionalitat && v.sexe
        )
        
        toast.error(`No es pot generar el TXT per aquesta reserva. 
          Viatgers totals: ${viatgersReserva.length}, 
          Amb dades completes: ${viatgersAmbDades.length}`)
      } else {
        toast.error('Error generant el fitxer TXT: ' + errorMessage)
      }
    }
  }

  const handleMostrarLinkReserva = async (reservaId) => {
    try {
      const formulariReserva = await ViatgersService.getFormulariReserva(reservaId)
      // Buscar la reserva en la llista de viatgers
      const viatgerReserva = viatgers.find(v => v.reserva_id === reservaId)
      const reserva = viatgerReserva?.reserva
      
      console.log('Formulari rebut:', formulariReserva) // Debug
      console.log('Reserva:', reserva) // Debug
      
      setReservaSeleccionada(reserva)
      setFormulariReservaSeleccionat(formulariReserva)
      setMostrarLinkModal(true)
    } catch (error) {
      console.error('Error detallat:', error) // Debug
      if (error?.response?.status === 404) {
        toast.error('No hi ha formulari generat per aquesta reserva')
      } else {
        toast.error('Error obtenint el formulari de reserva')
      }
    }
  }

  const handleEliminarFormulari = async (reservaId) => {
    setReservaAEliminar(reservaId)
    setMostrarDeleteModal(true)
  }

  const confirmarEliminarFormulari = async () => {
    if (!reservaAEliminar) return

    try {
      setEliminantFormulari(true)
      const response = await ViatgersService.eliminarFormulariReserva(reservaAEliminar)
      
      if (response.success) {
        toast.success('Formulari eliminat correctament')
        await carregarViatgers()
        setMostrarDeleteModal(false)
        setReservaAEliminar(null)
      } else {
        toast.error('Error eliminant el formulari')
      }
    } catch (error) {
      if (error?.response?.status === 404) {
        toast.error('No hi ha formulari per eliminar en aquesta reserva')
      } else {
        toast.error('Error eliminant el formulari')
        console.error('Error:', error)
      }
    } finally {
      setEliminantFormulari(false)
    }
  }

  const toggleCollapseReserva = (reservaId) => {
    setReservesCollapsed(prev => ({
      ...prev,
      [reservaId]: !prev[reservaId]
    }))
  }

  const toggleCollapseMes = (mesId) => {
    setMesosCollapsed(prev => ({
      ...prev,
      [mesId]: !prev[mesId]
    }))
  }

  const getEstatBadge = (estat) => {
    const variants = {
      'pendent': { 
        classes: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-md', 
        icon: Clock, 
        text: 'Pendent' 
      },
      'omplert': { 
        classes: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-md', 
        icon: CheckCircle, 
        text: 'Completat' 
      },
      'enviat': { 
        classes: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-md', 
        icon: CheckCircle, 
        text: 'Enviat' 
      }
    }
    
    const config = variants[estat] || variants['pendent']
    const Icon = config.icon

    return (
      <Badge className={`flex items-center gap-1 ${config.classes}`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 -right-20 w-72 h-72 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute -bottom-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>

      <div className="relative flex flex-col gap-8 py-8 px-6 md:px-8">
        {/* Header amb estil modern */}
        <div className="animate-in fade-in-2 slide-in-from-top-4 duration-1000">
          <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestió de Viatgers</h1>
              <p className="text-lg text-gray-600">
                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Gestiona els registres de viatgers per reportar als Mossos d'Esquadra
                </span>
              </p>
            </div>
            <Button 
              onClick={() => {
                setReservaSeleccionada(null)
                setMostrarModal(true)
              }}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl h-12 px-6"
            >
              <Plus className="mr-2 h-5 w-5" />
              Nou Formulari
            </Button>
          </div>
        </div>

        {/* Filtres amb estil modern */}
        <div className="animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-200">
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center space-x-4">
                <div className="relative flex-1 max-w-sm group">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors duration-300 group-focus-within:text-teal-600" />
                  <Input
                    placeholder="Cercar per nom, cognoms o DNI..."
                    value={filtres.cerca}
                    onChange={(e) => setFiltres(prev => ({ ...prev, cerca: e.target.value }))}
                    className="pl-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl h-12 transition-all duration-300"
                  />
                </div>
                <Select
                  value={filtres.estat}
                  onValueChange={(value) => setFiltres(prev => ({ ...prev, estat: value }))}
                >
                  <SelectTrigger className="w-40 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl h-12 transition-all duration-300">
                    <SelectValue placeholder="Estat" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200 rounded-xl shadow-xl">
                    <SelectItem value="tots" className="rounded-lg hover:bg-teal-50 transition-colors duration-200">Tots els estats</SelectItem>
                    <SelectItem value="pendent" className="rounded-lg hover:bg-teal-50 transition-colors duration-200">Pendent</SelectItem>
                    <SelectItem value="omplert" className="rounded-lg hover:bg-teal-50 transition-colors duration-200">Completat</SelectItem>
                    <SelectItem value="enviat" className="rounded-lg hover:bg-teal-50 transition-colors duration-200">Enviat</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filtres.reserva_id}
                  onValueChange={(value) => setFiltres(prev => ({ ...prev, reserva_id: value }))}
                  disabled={loadingReserves}
                >
                  <SelectTrigger className="w-60 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl h-12 transition-all duration-300">
                    <SelectValue placeholder={loadingReserves ? "Carregant..." : "Reserva"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200 rounded-xl shadow-xl">
                    <SelectItem value="totes" className="rounded-lg hover:bg-teal-50 transition-colors duration-200">Totes les reserves</SelectItem>
                    {reserves.map((reserva) => (
                      <SelectItem key={reserva.id} value={reserva.id.toString()} className="rounded-lg hover:bg-teal-50 transition-colors duration-200">
                        #{reserva.id} - {reserva.client?.nom || 'Sense client'} 
                        ({new Date(reserva.data_entrada).toLocaleDateString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="border-gray-200 hover:bg-teal-50 hover:border-teal-300 rounded-xl h-12 px-4 transition-all duration-300">
                  <Filter className="mr-2 h-4 w-4 text-teal-600" />
                  Filtres
                </Button>
                <Button variant="outline" className="border-gray-200 hover:bg-teal-50 hover:border-teal-300 rounded-xl h-12 px-4 transition-all duration-300">
                  <Download className="mr-2 h-4 w-4 text-teal-600" />
                  Exportar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Estadístiques amb estil modern */}
        <div className="animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-400">
          <div className="grid gap-6 md:grid-cols-4">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">{viatgers.length}</div>
                  <p className="text-gray-600 font-medium">Total Viatgers</p>
                </div>
                <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-3 rounded-2xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    {viatgers.filter(v => v.estat_formulari === 'pendent').length}
                  </div>
                  <p className="text-gray-600 font-medium">Pendents</p>
                </div>
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-2xl">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                    {viatgers.filter(v => v.estat_formulari === 'omplert').length}
                  </div>
                  <p className="text-gray-600 font-medium">Completats</p>
                </div>
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-2xl">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                    {mesosOrdenats.length}
                  </div>
                  <p className="text-gray-600 font-medium">Mesos Actius</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-2xl">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Llista de viatgers amb estil modern */}
      <div className="animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-600">
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Viatgers Registrats</h2>
            <p className="text-gray-600">
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent font-semibold">
                {viatgersFiltrats.length} de {viatgers.length} viatgers
              </span>
            </p>
          </div>
          <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Carregant viatgers...</p>
            </div>
          ) : mesosOrdenats.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No hi ha viatgers</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                No s'han trobat viatgers amb els filtres aplicats. Prova d'ajustar els criteris de cerca.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {mesosOrdenats.map((mesData, index) => (
                <div key={mesData.mes} className="space-y-6" style={{ animationDelay: `${index * 100}ms` }}>
                  {/* Capçalera del mes - Modern */}
                  <div 
                    className="flex items-center gap-4 pb-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50/50 rounded-2xl p-4 -m-4 transition-all duration-300 group"
                    onClick={() => toggleCollapseMes(mesData.mes)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 h-10 w-10 rounded-xl hover:bg-teal-100 group-hover:bg-teal-100 transition-colors duration-300"
                    >
                      {mesosCollapsed[mesData.mes] ? (
                        <ChevronDown className="w-5 h-5 text-teal-600" />
                      ) : (
                        <ChevronUp className="w-5 h-5 text-teal-600" />
                      )}
                    </Button>
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-3 rounded-2xl">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent capitalize">
                        {mesData.nomMes}
                      </h2>
                      <p className="text-gray-600 font-medium">
                        {Object.values(mesData.reserves).reduce((total, reserva) => total + reserva.viatgers.length, 0)} viatgers en {Object.keys(mesData.reserves).length} reserves
                      </p>
                    </div>
                    <Badge className="bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 border-0 font-semibold px-4 py-2">
                      {Object.values(mesData.reserves).reduce((total, reserva) => total + reserva.viatgers.length, 0)} viatgers
                    </Badge>
                  </div>

                  {/* Reserves del mes - Collapsible amb animació */}
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      mesosCollapsed[mesData.mes] 
                        ? 'max-h-0 opacity-0' 
                        : 'max-h-[10000px] opacity-100'
                    }`}
                  >
                    <div className="pl-8 space-y-6">
                      {Object.values(mesData.reserves)
                        .sort((a, b) => {
                          // Ordenar reserves per data d'entrada (més noves primer)
                          const dataA = new Date(a.reserva?.data_entrada || '1970-01-01')
                          const dataB = new Date(b.reserva?.data_entrada || '1970-01-01')
                          return dataB - dataA
                        })
                        .map((grup, reservaIndex) => (
                        <div key={grup.reserva_id} className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" style={{ animationDelay: `${reservaIndex * 50}ms` }}>
                          {/* Capçalera de la reserva */}
                          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                            <div className="flex items-center gap-4 flex-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleCollapseReserva(grup.reserva_id)}
                                className="p-2 h-10 w-10 rounded-xl hover:bg-teal-100 transition-colors duration-300"
                              >
                                {reservesCollapsed[grup.reserva_id] ? (
                                  <ChevronDown className="w-5 h-5 text-teal-600" />
                                ) : (
                                  <ChevronUp className="w-5 h-5 text-teal-600" />
                                )}
                              </Button>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                                  <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                                    Reserva #{grup.reserva_id}
                                  </span>
                                  {grup.reserva?.allotjament && (
                                    <span className="text-sm font-normal text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                      {grup.reserva.allotjament.nom || grup.reserva.allotjament}
                                    </span>
                                  )}
                                  <Badge className="bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 border-0 font-semibold">
                                    {grup.viatgers.length} viatgers
                                  </Badge>
                                </h3>
                                {grup.reserva && (
                                  <div className="text-sm text-gray-600 space-y-1">
                                    <p className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4" />
                                      {new Date(grup.reserva.data_entrada).toLocaleDateString()} - {new Date(grup.reserva.data_sortida).toLocaleDateString()}
                                    </p>
                                    {grup.reserva.client && (
                                      <p className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        {grup.reserva.client.nom}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGenerarTxt(grup.reserva_id)}
                                className="bg-white/80 border-gray-200 hover:bg-teal-50 hover:border-teal-300 text-teal-700 hover:text-teal-800 rounded-xl transition-all duration-300 font-medium"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                TXT Mossos
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setReservaSeleccionada(grup.reserva_id)
                                  setMostrarModal(true)
                                }}
                                className="bg-white/80 border-gray-200 hover:bg-teal-50 hover:border-teal-300 text-teal-700 hover:text-teal-800 rounded-xl transition-all duration-300 font-medium"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Formulari
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMostrarLinkReserva(grup.reserva_id)}
                                className="bg-white/80 border-gray-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700 hover:text-blue-800 rounded-xl transition-all duration-300 font-medium"
                                title="Veure link del formulari de reserva"
                              >
                                <Link2 className="w-4 h-4 mr-2" />
                                Link
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEliminarFormulari(grup.reserva_id)}
                                className="bg-white/80 border-gray-200 hover:bg-red-50 hover:border-red-300 text-red-600 hover:text-red-700 rounded-xl transition-all duration-300 font-medium"
                                title="Eliminar formulari i tots els viatgers"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Eliminar
                              </Button>
                            </div>
                          </div>

                          {/* Llista de viatgers de la reserva - Modern */}
                          <div 
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                              reservesCollapsed[grup.reserva_id] 
                                ? 'max-h-0 opacity-0' 
                                : 'max-h-[2000px] opacity-100'
                            }`}
                          >
                            <div className="space-y-4 pt-4">
                              {grup.viatgers.map((viatger, viatgerIndex) => (
                                <div key={viatger.id} className="bg-white/80 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]" style={{ animationDelay: `${viatgerIndex * 50}ms` }}>
                                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                    <div className="flex items-center gap-4 flex-1">
                                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        {viatger.nom?.charAt(0) || '?'}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                          <h4 className="text-lg font-semibold text-gray-900">
                                            {viatger.nom} {viatger.cognoms}
                                          </h4>
                                          {getEstatBadge(viatger.estat_formulari)}
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                          <div className="flex items-center gap-2 text-gray-600">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                            <span className="font-medium">DNI:</span>
                                            <span>{viatger.dni_passaport || 'No especificat'}</span>
                                          </div>
                                          <div className="flex items-center gap-2 text-gray-600">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                            <span className="font-medium">Email:</span>
                                            <span>{viatger.email || 'No especificat'}</span>
                                          </div>
                                          <div className="flex items-center gap-2 text-gray-600">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                            <span className="font-medium">Telèfon:</span>
                                            <span>{viatger.telefon || 'No especificat'}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Modal generador de formularis */}
      <GenerarFormulariModal
        isOpen={mostrarModal}
        onClose={() => {
          setMostrarModal(false)
          setReservaSeleccionada(null)
          carregarViatgers() // Recarregar la llista
        }}
        reservaId={reservaSeleccionada}
      />

      {/* Modal mostrar link formulari */}
      <MostrarLinkModal
        isOpen={mostrarLinkModal}
        onClose={() => {
          setMostrarLinkModal(false)
          setReservaSeleccionada(null)
          setFormulariReservaSeleccionat(null)
        }}
        reserva={reservaSeleccionada}
        formulariReserva={formulariReservaSeleccionat}
      />

      {/* Modal formulari (placeholder) */}
      {mostrarFormulari && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Nou Viatger</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Formulari de creació de viatger en desenvolupament
              </p>
              <Button 
                onClick={() => setMostrarFormulari(false)}
                className="w-full"
              >
                Tancar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de confirmació d'eliminació */}
      <ConfirmDeleteModal
        open={mostrarDeleteModal}
        onOpenChange={setMostrarDeleteModal}
        onConfirm={confirmarEliminarFormulari}
        title="Eliminar formulari de viatgers"
        description={`Estàs segur que vols eliminar el formulari de la reserva #${reservaAEliminar} i tots els viatgers associats? Aquesta acció no es pot desfer.`}
        confirmText="Eliminar formulari"
        cancelText="Cancel·lar"
        isLoading={eliminantFormulari}
      />
      </div>
    </div>
  )
}

export default ViatgersPage

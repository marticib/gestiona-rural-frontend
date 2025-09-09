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
      'pendent': { variant: 'secondary', icon: Clock, text: 'Pendent' },
      'omplert': { variant: 'default', icon: CheckCircle, text: 'Completat' },
      'enviat': { variant: 'default', icon: CheckCircle, text: 'Enviat' }
    }
    
    const config = variants[estat] || variants['pendent']
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            Gestió de Viatgers
          </h1>
          <p className="text-muted-foreground">
            Gestiona els registres de viatgers per reportar als Mossos d'Esquadra
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => {
              setReservaSeleccionada(null)
              setMostrarModal(true)
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nou Formulari
          </Button>
          
        </div>
      </div>

      {/* Filtres */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cercar per nom, cognoms o DNI..."
              value={filtres.cerca}
              onChange={(e) => setFiltres(prev => ({ ...prev, cerca: e.target.value }))}
              className="pl-9"
            />
          </div>

          <Select
            value={filtres.estat}
            onValueChange={(value) => setFiltres(prev => ({ ...prev, estat: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tots els estats" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tots">Tots els estats</SelectItem>
              <SelectItem value="pendent">Pendent</SelectItem>
              <SelectItem value="omplert">Completat</SelectItem>
              <SelectItem value="enviat">Enviat</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filtres.reserva_id}
            onValueChange={(value) => setFiltres(prev => ({ ...prev, reserva_id: value }))}
            disabled={loadingReserves}
          >
            <SelectTrigger>
              <SelectValue placeholder={loadingReserves ? "Carregant reserves..." : "Totes les reserves"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="totes">Totes les reserves</SelectItem>
              {reserves.map((reserva) => (
                <SelectItem key={reserva.id} value={reserva.id.toString()}>
                  #{reserva.id} - {reserva.client?.nom || 'Sense client'} 
                  ({new Date(reserva.data_entrada).toLocaleDateString()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Llista de viatgers */}
      <Card>
        <CardHeader>
          <CardTitle>Viatgers Registrats</CardTitle>
          <CardDescription>
            {viatgersFiltrats.length} de {viatgers.length} viatgers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : mesosOrdenats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No s'han trobat viatgers amb els filtres aplicats
            </div>
          ) : (
            <div className="space-y-8">
              {mesosOrdenats.map((mesData) => (
                <div key={mesData.mes} className="space-y-4">
                  {/* Capçalera del mes - Clickable */}
                  <div 
                    className="flex items-center gap-2 pb-2 border-b border-border cursor-pointer hover:bg-muted/30 rounded-lg p-2 -m-2 transition-colors"
                    onClick={() => toggleCollapseMes(mesData.mes)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-6 w-6"
                    >
                      {mesosCollapsed[mesData.mes] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronUp className="w-4 h-4" />
                      )}
                    </Button>
                    <Calendar className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-primary capitalize">
                      {mesData.nomMes}
                    </h2>
                    <Badge variant="outline">
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
                    <div className="space-y-4 ml-6 pt-2">
                      {Object.values(mesData.reserves)
                        .sort((a, b) => {
                          // Ordenar reserves per data d'entrada (més noves primer)
                          const dataA = new Date(a.reserva?.data_entrada || '1970-01-01')
                          const dataB = new Date(b.reserva?.data_entrada || '1970-01-01')
                          return dataB - dataA
                        })
                        .map((grup) => (
                        <div key={grup.reserva_id} className="rounded-lg p-4 ">
                          {/* Capçalera de la reserva */}
                          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4 pb-4 border-b">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleCollapseReserva(grup.reserva_id)}
                                className="p-1 h-8 w-8"
                              >
                                {reservesCollapsed[grup.reserva_id] ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronUp className="w-4 h-4" />
                                )}
                              </Button>
                              <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                  Reserva #{grup.reserva_id}
                                  {grup.reserva?.allotjament && (
                                    <span className="text-sm font-normal text-muted-foreground">
                                      • {grup.reserva.allotjament.nom || grup.reserva.allotjament}
                                    </span>
                                  )}
                                  <Badge variant="outline">{grup.viatgers.length} viatgers</Badge>
                                </h3>
                                {grup.reserva && (
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(grup.reserva.data_entrada).toLocaleDateString()} - {new Date(grup.reserva.data_sortida).toLocaleDateString()}
                                    {grup.reserva.client && ` • ${grup.reserva.client.nom}`}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGenerarTxt(grup.reserva_id)}
                                className="flex items-center gap-1"
                              >
                                <Download className="w-3 h-3" />
                                TXT
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setReservaSeleccionada(grup.reserva_id)
                                  setMostrarModal(true)
                                }}
                                className="flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                Formulari
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMostrarLinkReserva(grup.reserva_id)}
                                className="flex items-center gap-1"
                                title="Veure link del formulari de reserva"
                              >
                                <Link2 className="w-3 h-3" />
                                Link
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEliminarFormulari(grup.reserva_id)}
                                className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Eliminar formulari i tots els viatgers"
                              >
                                <Trash2 className="w-3 h-3" />
                                Eliminar
                              </Button>
                            </div>
                          </div>

                          {/* Llista de viatgers de la reserva - Collapsible amb animació */}
                          <div 
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              reservesCollapsed[grup.reserva_id] 
                                ? 'max-h-0 opacity-0' 
                                : 'max-h-[2000px] opacity-100'
                            }`}
                          >
                            <div className="space-y-3 pt-2">
                              {grup.viatgers.map((viatger) => (
                                <div key={viatger.id} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-3 bg-background rounded-md transition-all duration-200 hover:bg-muted/50">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <h4 className="font-medium">
                                        {viatger.nom} {viatger.cognoms}
                                      </h4>
                                      {getEstatBadge(viatger.estat_formulari)}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                                      <div>DNI: {viatger.dni_passaport || 'No especificat'}</div>
                                      <div>Email: {viatger.email || 'No especificat'}</div>
                                      <div>Telèfon: {viatger.telefon || 'No especificat'}</div>
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
        </CardContent>
      </Card>

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
  )
}

export default ViatgersPage

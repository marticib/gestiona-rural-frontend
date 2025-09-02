import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
  ChevronUp
} from 'lucide-react'
import { useViatgers } from '@/hooks/useViatgers'
import GenerarFormulariModal from '@/components/GenerarFormulariModal'
import MostrarLinkModal from '@/components/MostrarLinkModal'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import ViatgersService from '@/services/viatgers'
import { toast } from 'sonner'

const ViatgersPage = () => {
  const {
    viatgers,
    loading,
    estadistiques,
    carregarViatgers,
    generarTxtMossos,
    descarregarTxt
  } = useViatgers()

  const [filtres, setFiltres] = useState({
    cerca: '',
    estat: '',
    reserva_id: ''
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

  // Aplicar filtres
  const viatgersFiltrats = viatgers.filter(viatger => {
    const cercaMatch = !filtres.cerca || 
      viatger.nom?.toLowerCase().includes(filtres.cerca.toLowerCase()) ||
      viatger.cognoms?.toLowerCase().includes(filtres.cerca.toLowerCase()) ||
      viatger.dni?.toLowerCase().includes(filtres.cerca.toLowerCase())
    
    const estatMatch = !filtres.estat || viatger.estat_formulari === filtres.estat
    const reservaMatch = !filtres.reserva_id || viatger.reserva_id.toString() === filtres.reserva_id

    return cercaMatch && estatMatch && reservaMatch
  })

  // Agrupar viatgers per reserva
  const viatgersPerReserva = viatgersFiltrats.reduce((acc, viatger) => {
    const reservaId = viatger.reserva_id
    if (!acc[reservaId]) {
      acc[reservaId] = {
        reserva_id: reservaId,
        viatgers: [],
        reserva: viatger.reserva // Assumint que el viatger té la relació reserva carregada
      }
    }
    acc[reservaId].viatgers.push(viatger)
    return acc
  }, {})

  const handleGenerarTxt = async (reservaId) => {
    try {
      const response = await generarTxtMossos(reservaId)
      if (response.file_name) {
        await descarregarTxt(response.file_name)
      }
    } catch (error) {
      // Error ja gestionat al hook
    }
  }

  const handleMostrarLinkReserva = async (reservaId) => {
    try {
      const formulariReserva = await ViatgersService.getFormulariReserva(reservaId)
      const reserva = viatgersPerReserva[reservaId]?.reserva
      
      setReservaSeleccionada(reserva)
      setFormulariReservaSeleccionat(formulariReserva)
      setMostrarLinkModal(true)
    } catch (error) {
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
          
          <Button 
            variant="outline"
            onClick={() => handleGenerarTxt()}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Generar TXT Global
          </Button>
        </div>
      </div>

      {/* Estadístiques */}
      {estadistiques && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{estadistiques.total}</p>
                </div>
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completats</p>
                  <p className="text-2xl font-bold text-green-600">{estadistiques.omplerts}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendents</p>
                  <p className="text-2xl font-bold text-yellow-600">{estadistiques.pendents}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Enviats</p>
                  <p className="text-2xl font-bold text-blue-600">{estadistiques.enviats}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
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

            <select
              value={filtres.estat}
              onChange={(e) => setFiltres(prev => ({ ...prev, estat: e.target.value }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="">Tots els estats</option>
              <option value="pendent">Pendent</option>
              <option value="omplert">Completat</option>
              <option value="enviat">Enviat</option>
            </select>

            <Input
              type="number"
              placeholder="ID Reserva"
              value={filtres.reserva_id}
              onChange={(e) => setFiltres(prev => ({ ...prev, reserva_id: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

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
          ) : Object.keys(viatgersPerReserva).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No s'han trobat viatgers amb els filtres aplicats
            </div>
          ) : (
            <div className="space-y-6">
              {Object.values(viatgersPerReserva).map((grup) => (
                <div key={grup.reserva_id} className="border rounded-lg p-4">
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
                        <div key={viatger.id} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-3 bg-muted/30 rounded-md transition-all duration-200 hover:bg-muted/50">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium">
                                {viatger.nom} {viatger.cognoms}
                              </h4>
                              {getEstatBadge(viatger.estat_formulari)}
                              {viatger.es_responsable && (
                                <Badge variant="secondary" className="text-xs">Responsable</Badge>
                              )}
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

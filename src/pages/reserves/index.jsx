import { useState, useEffect } from 'react'
import { Plus, Search, Calendar, Filter, CheckCircle, XCircle, Clock, CreditCard, LogIn, LogOut, User, Building2, Mail, Phone, Users, Edit, FileUser } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import { ReservesService } from '../../services/reserves'
import { useToast } from '@/hooks/use-toast'
import { NovaReservaModal } from '../../components/reserves/nova-reserva-modal'
import { EditReservaModal } from '../../components/reserves/edit-reserva-modal'
import { useRole } from '@/hooks/use-role'

export default function Reserves() {
  const { role, isSuperadmin, isPropietari } = useRole()
  
  // Memoitzar els valors de rol per evitar re-renders
  const isAdmin = isSuperadmin()
  const isOwner = isPropietari()
  
  const [reserves, setReserves] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [estatPagamentFilter, setEstatPagamentFilter] = useState('all')
  const [plataformaFilter, setPlataformaFilter] = useState('all')
  const [dataInici, setDataInici] = useState('')
  const [dataFi, setDataFi] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [actionLoading, setActionLoading] = useState({})
  const [showNovaModal, setShowNovaModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [reservaToEdit, setReservaToEdit] = useState(null)
  
  const { success, error } = useToast()

  useEffect(() => {
    loadReserves()
  }, [currentPage, searchTerm, statusFilter, estatPagamentFilter, plataformaFilter, dataInici, dataFi])

  const loadReserves = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        per_page: 20
      }

      // Només afegir paràmetres si tenen valors
      if (searchTerm.trim()) {
        params.search = searchTerm.trim()
      }
      if (statusFilter && statusFilter !== 'all') {
        params.estat = statusFilter
      }
      if (estatPagamentFilter && estatPagamentFilter !== 'all') {
        params.estat_pagament = estatPagamentFilter
      }
      if (plataformaFilter && plataformaFilter !== 'all') {
        params.plataforma = plataformaFilter
      }
      if (dataInici) {
        params.data_inici = dataInici
      }
      if (dataFi) {
        params.data_fi = dataFi
      }

      console.log('Cridant API amb params:', params)
      const response = await ReservesService.getAll(params)
      console.log('Resposta de l\'API:', response)
      console.log('Dades rebudes:', response.data)
      setReserves(response.data || [])
      setPagination(response.pagination || null)
    } catch (err) {
      console.error('Error loading reserves:', err)
      error(err.message || 'Error en carregar les reserves')
    } finally {
      setLoading(false)
    }
  }

  const handleActionClick = async (action, reservaId, motiu = '') => {
    try {
      setActionLoading(prev => ({ ...prev, [`${action}-${reservaId}`]: true }))
      
      let response
      switch (action) {
        case 'confirmar':
          response = await ReservesService.confirmar(reservaId)
          success('Reserva confirmada correctament')
          break
        case 'cancellar':
          response = await ReservesService.cancellar(reservaId, motiu)
          success('Reserva cancel·lada correctament')
          break
        case 'checkIn':
          response = await ReservesService.checkIn(reservaId)
          success('Check-in realitzat correctament')
          break
        case 'checkOut':
          response = await ReservesService.checkOut(reservaId)
          success('Check-out realitzat correctament')
          break
        case 'marcarPagada':
          response = await ReservesService.marcarComPagada(reservaId)
          success('Reserva marcada com a pagada')
          break
        default:
          throw new Error('Acció no reconeguda')
      }
      
      // Recarregar la llista després de l'acció
      await loadReserves()
    } catch (err) {
      console.error(`Error in ${action}:`, err)
      error(err.message || `Error en executar l'acció ${action}`)
    } finally {
      setActionLoading(prev => ({ ...prev, [`${action}-${reservaId}`]: false }))
    }
  }

  const getStatusBadge = (estat) => {
    const statusConfig = {
      'pendent_confirmacio': { variant: 'secondary', text: 'Pendent', icon: Clock },
      'confirmada': { variant: 'default', text: 'Confirmada', icon: CheckCircle },
      'pagada': { variant: 'default', text: 'Pagada', icon: CheckCircle },
      'entrada': { variant: 'default', text: 'Check-in', icon: LogIn },
      'sortida': { variant: 'outline', text: 'Check-out', icon: LogOut },
      'cancel·lada': { variant: 'destructive', text: 'Cancel·lada', icon: XCircle },
      'no_presentat': { variant: 'destructive', text: 'No presentat', icon: XCircle }
    }
    
    const config = statusConfig[estat] || { variant: 'secondary', text: estat, icon: Clock }
    const IconComponent = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {config.text}
      </Badge>
    )
  }

  const getPaymentBadge = (estatPagament) => {
    const paymentConfig = {
      'pendent': { variant: 'secondary', text: 'Pendent' },
      'pagament_parcial': { variant: 'outline', text: 'Parcial' },
      'pagat_complet': { variant: 'default', text: 'Pagada' },
      'reemborsat_parcial': { variant: 'destructive', text: 'Reemb. Parcial' },
      'reemborsat_complet': { variant: 'destructive', text: 'Reemborsada' }
    }
    
    const config = paymentConfig[estatPagament] || { variant: 'secondary', text: estatPagament }
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <CreditCard className="h-3 w-3" />
        {config.text}
      </Badge>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('ca-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    if (!amount) return '0,00 €'
    return new Intl.NumberFormat('ca-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const canConfirm = (reserva) => reserva.estat === 'pendent_confirmacio'
  const canCancel = (reserva) => ['pendent_confirmacio', 'confirmada', 'pagada'].includes(reserva.estat)
  const canCheckIn = (reserva) => ['confirmada', 'pagada'].includes(reserva.estat) && !reserva.data_check_in
  const canCheckOut = (reserva) => reserva.estat === 'entrada' && reserva.data_check_in && !reserva.data_check_out
  const canMarkPaid = (reserva) => !['pagat_complet', 'reemborsat_complet'].includes(reserva.estat_pagament)

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setEstatPagamentFilter('all')
    setPlataformaFilter('all')
    setDataInici('')
    setDataFi('')
    setCurrentPage(1)
  }

  const handleEditReserva = (reserva) => {
    setReservaToEdit(reserva)
    setShowEditModal(true)
  }

  const handleEditSuccess = () => {
    setShowEditModal(false)
    setReservaToEdit(null)
    loadReserves()
  }

  const handleGenerarFormulariViatgers = async (reserva) => {
    let token = reserva.formulari_reserva?.token_formulari
    let url = null
    
    if (!token) {
      // Si no existeix token, crear un nou formulari
      try {
        const response = await ReservesService.generarFormulariViatgers(reserva.id)
        if (response.success && response.data) {
          token = response.data.formulari.token_formulari
          url = response.data.link
        } else {
          error('Error en generar el formulari de viatgers')
          return
        }
      } catch (err) {
        console.error('Error generant formulari:', err)
        error('Error en generar el formulari de viatgers')
        return
      }
    } else {
      // Si ja existeix token, construir l'URL
      url = `${window.location.origin}/formulari/${token}`
    }
    
    // Copiar l'enllaç al portapapers
    navigator.clipboard.writeText(url).then(() => {
      success('Enllaç del formulari copiat al portapapers!')
    }).catch(() => {
      // Si no es pot copiar automàticament, mostrar l'enllaç
      const message = `Enllaç del formulari de viatgers: ${url}`
      success(message)
    })
    
    // També obrir l'enllaç en una nova pestanya
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-purple-200 to-blue-200 rounded-full blur-3xl opacity-15 animate-pulse delay-300"></div>
      </div>
      
      <TooltipProvider>
        <div className="relative flex flex-col gap-8 py-8 px-6 md:px-8">
          {/* Header */}
          <div className="animate-in fade-in-2 slide-in-from-top-4 duration-1000">
            <div className="flex justify-between items-center bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {isPropietari() ? 'Les Meves Reserves' : 'Reserves'}
                </h1>
                <p className="text-lg text-gray-600">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {isPropietari() 
                      ? 'Gestiona les reserves dels teus allotjaments'
                      : 'Gestiona totes les reserves dels allotjaments'
                    }
                  </span>
                </p>
              </div>
              <Button onClick={() => setShowNovaModal(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl h-12 px-6">
                <Plus className="mr-2 h-5 w-5" />
                Nova Reserva
              </Button>
            </div>
          </div>

          {/* Filtres */}
          <div className="animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-200">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Filter className="h-4 w-4 text-white" />
                  </div>
                  Filtres
                </h3>
                <Button variant="outline" size="sm" onClick={clearFilters} className="border-gray-200 rounded-xl hover:bg-blue-50 transition-colors duration-300">
                  Neteja filtres
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors duration-300 group-focus-within:text-blue-600" />
                  <Input
                    placeholder="Cerca per client, codi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 transition-all duration-300"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 transition-all duration-300">
                    <SelectValue placeholder="Estat" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200 rounded-xl shadow-xl">
                    <SelectItem value="all" className="rounded-lg hover:bg-blue-50 transition-colors duration-200">Tots els estats</SelectItem>
                    <SelectItem value="pendent_confirmacio" className="rounded-lg hover:bg-blue-50 transition-colors duration-200">Pendent</SelectItem>
                    <SelectItem value="confirmada" className="rounded-lg hover:bg-blue-50 transition-colors duration-200">Confirmada</SelectItem>
                    <SelectItem value="pagada" className="rounded-lg hover:bg-blue-50 transition-colors duration-200">Pagada</SelectItem>
                    <SelectItem value="entrada" className="rounded-lg hover:bg-blue-50 transition-colors duration-200">Check-in</SelectItem>
                    <SelectItem value="sortida" className="rounded-lg hover:bg-blue-50 transition-colors duration-200">Check-out</SelectItem>
                    <SelectItem value="cancel·lada" className="rounded-lg hover:bg-blue-50 transition-colors duration-200">Cancel·lada</SelectItem>
                    <SelectItem value="no_presentat" className="rounded-lg hover:bg-blue-50 transition-colors duration-200">No presentat</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={estatPagamentFilter} onValueChange={setEstatPagamentFilter}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 transition-all duration-300">
                    <SelectValue placeholder="Estat pagament" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200 rounded-xl shadow-xl">
                    <SelectItem value="all" className="rounded-lg hover:bg-blue-50 transition-colors duration-200">Tots els pagaments</SelectItem>
                    <SelectItem value="pendent" className="rounded-lg hover:bg-blue-50 transition-colors duration-200">Pendent</SelectItem>
                    <SelectItem value="pagament_parcial" className="rounded-lg hover:bg-blue-50 transition-colors duration-200">Parcial</SelectItem>
                    <SelectItem value="pagat_complet" className="rounded-lg hover:bg-blue-50 transition-colors duration-200">Pagada</SelectItem>
                    <SelectItem value="reemborsat_parcial" className="rounded-lg hover:bg-blue-50 transition-colors duration-200">Reemb. Parcial</SelectItem>
                    <SelectItem value="reemborsat_complet" className="rounded-lg hover:bg-blue-50 transition-colors duration-200">Reemborsada</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={plataformaFilter} onValueChange={setPlataformaFilter}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 transition-all duration-300">
                    <SelectValue placeholder="Plataforma" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200 rounded-xl shadow-xl">
                    <SelectItem value="all" className="rounded-lg hover:bg-blue-50 transition-colors duration-200">Totes les plataformes</SelectItem>
                    <SelectItem value="Booking" className="rounded-lg hover:bg-blue-50 transition-colors duration-200">Booking</SelectItem>
                    <SelectItem value="Airbnb" className="rounded-lg hover:bg-blue-50 transition-colors duration-200">Airbnb</SelectItem>
                    <SelectItem value="Expedia" className="rounded-lg hover:bg-blue-50 transition-colors duration-200">Expedia</SelectItem>
                    <SelectItem value="Directa" className="rounded-lg hover:bg-blue-50 transition-colors duration-200">Directa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Data entrada des de:</label>
                  <Input
                    type="date"
                    value={dataInici}
                    onChange={(e) => setDataInici(e.target.value)}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Data entrada fins:</label>
                  <Input
                    type="date"
                    value={dataFi}
                    onChange={(e) => setDataFi(e.target.value)}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Taula */}
          <div className="animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-400">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
              <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Codi</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Allotjament</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Hostes</TableHead>
              <TableHead>Estat</TableHead>
              <TableHead>Pagament</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Accions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  Carregant reserves...
                </TableCell>
              </TableRow>
            ) : reserves.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  No s'han trobat reserves
                </TableCell>
              </TableRow>
            ) : (
              reserves.map((reserva) => (
                <TableRow key={reserva.id}>
                  <TableCell className="font-medium">
                    <div className="font-mono text-sm">
                      {reserva.codi_reserva}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {reserva.client ? (
                        <>
                          <div className="font-semibold">{reserva.client.nom_complet || `${reserva.client.nom} ${reserva.client.cognoms}`}</div>
                          <div className="text-sm text-muted-foreground">{reserva.client.email}</div>
                          <div className="text-xs text-blue-600">Client registrat</div>
                        </>
                      ) : (
                        <>
                          <div className="font-semibold">Client convidat</div>
                          <div className="text-sm text-muted-foreground">{reserva.nom_client} {reserva.cognoms_client}</div>
                          <div className="text-sm text-muted-foreground">{reserva.email_client}</div>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{reserva.allotjament?.nom}</div>
                      <div className="text-sm text-muted-foreground">{reserva.allotjament?.ciutat}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(reserva.data_entrada).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">
                        {new Date(reserva.data_sortida).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{reserva.nombre_hostes}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(reserva.estat)}
                  </TableCell>
                  <TableCell>
                    {getPaymentBadge(reserva.estat_pagament)}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {reserva.total}€
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {/* Botó d'editar - sempre visible */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditReserva(reserva)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar reserva</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Botó del formulari de viatgers - sempre visible */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerarFormulariViatgers(reserva)}
                            className="text-purple-600 hover:text-purple-700"
                          >
                            <FileUser className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Formulari de viatgers</p>
                        </TooltipContent>
                      </Tooltip>

                      {canConfirm(reserva) && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleActionClick('confirmar', reserva.id)}
                              disabled={actionLoading[`confirmar-${reserva.id}`]}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Confirmar reserva</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {canCheckIn(reserva) && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleActionClick('checkIn', reserva.id)}
                              disabled={actionLoading[`checkIn-${reserva.id}`]}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <LogIn className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Fer check-in</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {canCheckOut(reserva) && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleActionClick('checkOut', reserva.id)}
                              disabled={actionLoading[`checkOut-${reserva.id}`]}
                              className="text-purple-600 hover:text-purple-700"
                            >
                              <LogOut className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Fer check-out</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {canMarkPaid(reserva) && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleActionClick('marcarPagada', reserva.id)}
                              disabled={actionLoading[`marcarPagada-${reserva.id}`]}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CreditCard className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Marcar com a pagada</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {canCancel(reserva) && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const motiu = prompt('Motiu de la cancel·lació (opcional):')
                                if (motiu !== null) { // L'usuari no ha cancel·lat el prompt
                                  handleActionClick('cancellar', reserva.id, motiu)
                                }
                              }}
                              disabled={actionLoading[`cancellar-${reserva.id}`]}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cancel·lar reserva</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
              </Table>
              
              {/* Paginació */}
              {pagination && pagination.last_page > 1 && (
                <div className="p-6 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600 font-medium">
                      Mostrant {pagination.from}-{pagination.to} de {pagination.total} reserves
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="border-gray-200 rounded-xl hover:bg-blue-50 transition-colors duration-300"
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === pagination.last_page}
                        className="border-gray-200 rounded-xl hover:bg-blue-50 transition-colors duration-300"
                      >
                        Següent
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal per afegir nova reserva */}
          <NovaReservaModal
            open={showNovaModal}
            onOpenChange={setShowNovaModal}
            onSuccess={() => loadReserves()}
          />

          {/* Modal per editar reserva */}
          <EditReservaModal
            open={showEditModal}
            onOpenChange={setShowEditModal}
            reserva={reservaToEdit}
            onSuccess={handleEditSuccess}
          />
        </div>
      </TooltipProvider>
    </div>
  )
}

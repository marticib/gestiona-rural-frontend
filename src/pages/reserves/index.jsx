import { useState, useEffect } from 'react'
import { Plus, Search, Calendar, Filter, CheckCircle, XCircle, Clock, CreditCard, LogIn, LogOut, User, Building2, Mail, Phone, Users } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
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
import { useRole } from '@/hooks/use-role'

export default function Reserves() {
  const { role, isSuperadmin, isPropietari } = useRole()
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
  
  const { success, error } = useToast()

  useEffect(() => {
    loadReserves()
  }, [currentPage, searchTerm, statusFilter, estatPagamentFilter, plataformaFilter, dataInici, dataFi])

  const loadReserves = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        search: searchTerm,
        estat: statusFilter === 'all' ? '' : statusFilter,
        estat_pagament: estatPagamentFilter === 'all' ? '' : estatPagamentFilter,
        plataforma: plataformaFilter === 'all' ? '' : plataformaFilter,
        data_inici: dataInici,
        data_fi: dataFi,
        per_page: 20
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

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6 px-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {isPropietari() ? 'Les Meves Reserves' : 'Reserves'}
          </h1>
          <p className="text-gray-600">
            {isPropietari() 
              ? 'Gestiona les reserves dels teus allotjaments'
              : 'Gestiona totes les reserves dels allotjaments'
            }
          </p>
        </div>
        <Button onClick={() => setShowNovaModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Reserva
        </Button>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </h3>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Neteja filtres
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cerca per client, codi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Estat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tots els estats</SelectItem>
              <SelectItem value="pendent_confirmacio">Pendent</SelectItem>
              <SelectItem value="confirmada">Confirmada</SelectItem>
              <SelectItem value="pagada">Pagada</SelectItem>
              <SelectItem value="entrada">Check-in</SelectItem>
              <SelectItem value="sortida">Check-out</SelectItem>
              <SelectItem value="cancel·lada">Cancel·lada</SelectItem>
              <SelectItem value="no_presentat">No presentat</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={estatPagamentFilter} onValueChange={setEstatPagamentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Estat pagament" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tots els pagaments</SelectItem>
              <SelectItem value="pendent">Pendent</SelectItem>
              <SelectItem value="pagament_parcial">Parcial</SelectItem>
              <SelectItem value="pagat_complet">Pagada</SelectItem>
              <SelectItem value="reemborsat_parcial">Reemb. Parcial</SelectItem>
              <SelectItem value="reemborsat_complet">Reemborsada</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={plataformaFilter} onValueChange={setPlataformaFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Plataforma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Totes les plataformes</SelectItem>
              <SelectItem value="Booking">Booking</SelectItem>
              <SelectItem value="Airbnb">Airbnb</SelectItem>
              <SelectItem value="Expedia">Expedia</SelectItem>
              <SelectItem value="Directa">Directa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Data entrada des de:</label>
            <Input
              type="date"
              value={dataInici}
              onChange={(e) => setDataInici(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data entrada fins:</label>
            <Input
              type="date"
              value={dataFi}
              onChange={(e) => setDataFi(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Taula */}
      <div className="rounded-md border">
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
                      {canConfirm(reserva) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleActionClick('confirmar', reserva.id)}
                          disabled={actionLoading[`confirmar-${reserva.id}`]}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}
                      
                      {canCheckIn(reserva) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleActionClick('checkIn', reserva.id)}
                          disabled={actionLoading[`checkIn-${reserva.id}`]}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <LogIn className="h-3 w-3" />
                        </Button>
                      )}
                      
                      {canCheckOut(reserva) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleActionClick('checkOut', reserva.id)}
                          disabled={actionLoading[`checkOut-${reserva.id}`]}
                          className="text-purple-600 hover:text-purple-700"
                        >
                          <LogOut className="h-3 w-3" />
                        </Button>
                      )}
                      
                      {canMarkPaid(reserva) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleActionClick('marcarPagada', reserva.id)}
                          disabled={actionLoading[`marcarPagada-${reserva.id}`]}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CreditCard className="h-3 w-3" />
                        </Button>
                      )}
                      
                      {canCancel(reserva) && (
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
          <div className="p-4 border-t flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Mostrant {pagination.from}-{pagination.to} de {pagination.total} reserves
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pagination.last_page}
              >
                Següent
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal per afegir nova reserva */}
      <NovaReservaModal
        open={showNovaModal}
        onOpenChange={setShowNovaModal}
        onSuccess={() => loadReserves()}
      />
    </div>
  )
}

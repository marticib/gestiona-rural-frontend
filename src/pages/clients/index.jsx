import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  IconPlus,
  IconSearch,
  IconEye,
  IconPencil,
  IconTrash,
  IconFilter,
  IconDownload,
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconStar,
  IconBuilding,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useRole } from '@/hooks/use-role'
import { ClientsService } from '@/services/clients'
import { PropietarisService } from '@/services/propietaris'
import { NouClientModal } from '@/components/clients/nou-client-modal'

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [propietaris, setPropietaris] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstat, setFilterEstat] = useState('all')
  const [filterPropietari, setFilterPropietari] = useState('all')
  const [filterNacionalitat, setFilterNacionalitat] = useState('all')
  const [filterGenere, setFilterGenere] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [showNouModal, setShowNouModal] = useState(false)
  const { success, error } = useToast()
  const { isSuperadmin } = useRole()
  
  // Memoitzar el resultat de isSuperadmin per evitar re-renders
  const isAdmin = isSuperadmin()

  const generes = [
    { value: 'home', label: 'Home' },
    { value: 'dona', label: 'Dona' },
    { value: 'altre', label: 'Altre' },
    { value: 'no_especificat', label: 'No especificat' },
  ]

  const carregarClients = async (page = 1) => {
    try {
      setLoading(true)
      const params = {
        page,
        cerca: searchTerm,
        estat: filterEstat === 'all' ? '' : filterEstat,
        nacionalitat: filterNacionalitat === 'all' ? '' : filterNacionalitat,
        genere: filterGenere === 'all' ? '' : filterGenere,
        per_page: 15,
      }
      
      // Només afegir filtre de propietari si és superadmin
      if (isAdmin && filterPropietari !== 'all') {
        params.propietari_id = filterPropietari
      }
      
      const response = await ClientsService.getAll(params)
      
      if (response.success) {
        console.log('Clients data received:', response.data)
        console.log('First client propietari:', response.data[0]?.propietari)
        setClients(response.data)
        setCurrentPage(response.pagination.current_page)
        setTotalPages(response.pagination.last_page)
        setTotalItems(response.pagination.total)
      } else {
        error('Error en carregar els clients')
      }
    } catch (err) {
      error('Error en carregar els clients')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const carregarPropietaris = async () => {
    // Només carregar propietaris si és superadmin
    if (!isAdmin) {
      return
    }
    
    try {
      const response = await PropietarisService.getActius()
      if (response.success) {
        setPropietaris(response.data)
      }
    } catch (err) {
      console.error('Error carregant propietaris:', err)
    }
  }

  const eliminarClient = async (id) => {
    if (!window.confirm('Estàs segur que vols eliminar aquest client?')) {
      return
    }

    try {
      const response = await ClientsService.delete(id)
      
      if (response.success) {
        success('Client eliminat correctament')
        carregarClients(currentPage)
      } else {
        error('Error en eliminar el client')
      }
    } catch (err) {
      error(err.message || 'Error en eliminar el client')
      console.error(err)
    }
  }

  useEffect(() => {
    carregarPropietaris()
  }, [isAdmin])

  useEffect(() => {
    carregarClients()
  }, [searchTerm, filterEstat, filterNacionalitat, filterGenere, isAdmin, filterPropietari])

  const getEstatBadge = (estat) => {
    switch (estat) {
      case 'actiu':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Actiu
          </Badge>
        )
      case 'inactiu':
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            Inactiu
          </Badge>
        )
      case 'bloquejat':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            Bloquejat
          </Badge>
        )
      default:
        return <Badge variant="outline">{estat}</Badge>
    }
  }

  const getGenereBadge = (genere) => {
    const colors = {
      home: 'bg-blue-100 text-blue-800',
      dona: 'bg-pink-100 text-pink-800',
      altre: 'bg-purple-100 text-purple-800',
      no_especificat: 'bg-gray-100 text-gray-800',
    }

    const labels = {
      home: 'Home',
      dona: 'Dona',
      altre: 'Altre',
      no_especificat: 'No especificat',
    }

    return (
      <Badge variant="outline" className={colors[genere] || colors.no_especificat}>
        {labels[genere] || genere}
      </Badge>
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ca-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const getVipIcon = (client) => {
    if (client.total_estades >= 5 || client.total_gastat >= 2000) {
      return <IconStar className="h-4 w-4 text-yellow-500" title="Client VIP" />
    }
    return null
  }

  // Obtenir nacionalitats úniques per al filtre
  const nacionalitatsUniques = [...new Set(clients.map(c => c.nacionalitat).filter(Boolean))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-green-200 to-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-blue-200 to-indigo-200 rounded-full blur-3xl opacity-15 animate-pulse delay-300"></div>
      </div>
      
      <div className="relative flex flex-col gap-8 py-8 px-6 md:px-8">
        {/* Header */}
        <div className="animate-in fade-in-2 slide-in-from-top-4 duration-1000">
          <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {isSuperadmin() ? 'Clients' : 'Els Meus Clients'}
              </h1>
              <p className="text-lg text-gray-600">
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  {isSuperadmin() 
                    ? 'Gestiona tots els clients del sistema' 
                    : 'Gestiona els teus clients'
                  }
                </span>
              </p>
            </div>
            <Button onClick={() => setShowNouModal(true)} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl h-12 px-6">
              <IconPlus className="mr-2 h-5 w-5" />
              Nou Client
            </Button>
          </div>
        </div>

        {/* Filtres i cerca amb estil modern */}
        <div className="animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-200">
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center space-x-4">
                <div className="relative flex-1 max-w-sm group">
                  <IconSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors duration-300 group-focus-within:text-green-600" />
                  <Input
                    placeholder="Cercar clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-xl h-12 transition-all duration-300"
                  />
                </div>
                <Select value={filterEstat} onValueChange={setFilterEstat}>
                  <SelectTrigger className="w-40 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-xl h-12 transition-all duration-300">
                    <SelectValue placeholder="Estat" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200 rounded-xl shadow-xl">
                    <SelectItem value="all" className="rounded-lg hover:bg-green-50 transition-colors duration-200">Tots</SelectItem>
                    <SelectItem value="actiu" className="rounded-lg hover:bg-green-50 transition-colors duration-200">Actius</SelectItem>
                    <SelectItem value="inactiu" className="rounded-lg hover:bg-green-50 transition-colors duration-200">Inactius</SelectItem>
                    <SelectItem value="bloquejat" className="rounded-lg hover:bg-green-50 transition-colors duration-200">Bloquejats</SelectItem>
                  </SelectContent>
                </Select>
                {/* Mostrar filtre de propietari només per superadmins */}
                {isSuperadmin() && (
                  <Select value={filterPropietari} onValueChange={setFilterPropietari}>
                    <SelectTrigger className="w-48 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-xl h-12 transition-all duration-300">
                      <SelectValue placeholder="Propietari" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200 rounded-xl shadow-xl">
                      <SelectItem value="all" className="rounded-lg hover:bg-green-50 transition-colors duration-200">Tots els propietaris</SelectItem>
                      {propietaris.map((propietari) => (
                        <SelectItem key={propietari.id} value={propietari.id.toString()} className="rounded-lg hover:bg-green-50 transition-colors duration-200">
                          {propietari.nom_complet}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Select value={filterGenere} onValueChange={setFilterGenere}>
                  <SelectTrigger className="w-40 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-xl h-12 transition-all duration-300">
                    <SelectValue placeholder="Gènere" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200 rounded-xl shadow-xl">
                    <SelectItem value="all" className="rounded-lg hover:bg-green-50 transition-colors duration-200">Tots</SelectItem>
                    {generes.map((genere) => (
                      <SelectItem key={genere.value} value={genere.value} className="rounded-lg hover:bg-green-50 transition-colors duration-200">
                        {genere.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {nacionalitatsUniques.length > 0 && (
                  <Select value={filterNacionalitat} onValueChange={setFilterNacionalitat}>
                    <SelectTrigger className="w-40 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-xl h-12 transition-all duration-300">
                      <SelectValue placeholder="Nacionalitat" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200 rounded-xl shadow-xl">
                      <SelectItem value="all" className="rounded-lg hover:bg-green-50 transition-colors duration-200">Totes</SelectItem>
                      {nacionalitatsUniques.map((nacionalitat) => (
                        <SelectItem key={nacionalitat} value={nacionalitat} className="rounded-lg hover:bg-green-50 transition-colors duration-200">
                          {nacionalitat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="border-gray-200 hover:bg-green-50 hover:border-green-300 rounded-xl h-12 px-4 transition-all duration-300">
                  <IconFilter className="mr-2 h-4 w-4 text-green-600" />
                  Filtres
                </Button>
                <Button variant="outline" className="border-gray-200 hover:bg-green-50 hover:border-green-300 rounded-xl h-12 px-4 transition-all duration-300">
                  <IconDownload className="mr-2 h-4 w-4 text-green-600" />
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
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">{totalItems}</div>
                  <p className="text-gray-600 font-medium">Total Clients</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-blue-600 p-3 rounded-2xl">
                  <IconUser className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {clients.filter(c => c.estat === 'actiu').length}
                  </div>
                  <p className="text-gray-600 font-medium">Clients Actius</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-2xl">
                  <IconBuilding className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-yellow-600">
                    {clients.filter(c => c.total_estades >= 5 || c.total_gastat >= 2000).length}
                  </div>
                  <p className="text-gray-600 font-medium">Clients VIP</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-3 rounded-2xl">
                  <IconStar className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    {clients.length > 0 ? 
                      formatCurrency(clients.reduce((sum, c) => sum + parseFloat(c.total_gastat || 0), 0) / clients.length)
                      : formatCurrency(0)}
                  </div>
                  <p className="text-gray-600 font-medium">Gastat Mitjà</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-2xl">
                  <IconMail className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Taula amb estil modern */}
        <div className="animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-600">
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 hover:bg-green-50/50">
                  <TableHead className="font-semibold text-gray-700">Client</TableHead>
                  <TableHead className="font-semibold text-gray-700">Contacte</TableHead>
                  <TableHead className="font-semibold text-gray-700">Propietari</TableHead>
                  <TableHead className="font-semibold text-gray-700">Ubicació</TableHead>
                  <TableHead className="font-semibold text-gray-700">Gènere</TableHead>
                  <TableHead className="font-semibold text-gray-700">Estadístiques</TableHead>
                  <TableHead className="font-semibold text-gray-700">Estat</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Accions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                        <span className="text-gray-600">Carregant clients...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-gray-500">No s'han trobat clients</div>
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map((client) => (
                    <TableRow key={client.id} className="border-gray-200 hover:bg-green-50/30 transition-all duration-200">
                      {console.log('Rendering client:', client.nom_complet, 'Propietari:', client.propietari)}
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-r from-green-500 to-blue-600 p-2 rounded-xl">
                            <IconUser className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">{client.nom_complet}</span>
                              {getVipIcon(client)}
                            </div>
                            {client.dni && (
                              <div className="text-sm text-gray-500">
                                DNI: {client.dni}
                              </div>
                            )}
                            {client.professio && (
                              <div className="text-sm text-gray-500">
                                {client.professio}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <IconMail className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-700">{client.email}</span>
                          </div>
                          {client.telefon && (
                            <div className="flex items-center space-x-2">
                              <IconPhone className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-gray-700">{client.telefon}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <IconBuilding className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-gray-700">
                            {client.propietari ? client.propietari.nom + ' ' + client.propietari.cognoms : '-'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <IconMapPin className="h-4 w-4 text-blue-600" />
                          <div className="text-sm">
                            <div className="text-gray-700">{client.ciutat || '-'}</div>
                            <div className="text-gray-500">{client.nacionalitat || '-'}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getGenereBadge(client.genere)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="text-gray-700">{client.total_estades} estades</div>
                          <div className="font-semibold text-green-600">{formatCurrency(client.total_gastat)}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getEstatBadge(client.estat)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-green-100 rounded-xl transition-all duration-200">
                              <span className="sr-only">Obrir menú</span>
                              <IconPencil className="h-4 w-4 text-gray-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-xl border-gray-200 rounded-xl shadow-xl">
                            <DropdownMenuLabel className="text-gray-700 font-semibold">Accions</DropdownMenuLabel>
                            <DropdownMenuItem asChild className="rounded-lg hover:bg-green-50 transition-colors duration-200">
                              <Link to={`/clients/${client.id}`}>
                                <IconEye className="mr-2 h-4 w-4 text-blue-600" />
                                Veure detalls
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-lg hover:bg-green-50 transition-colors duration-200">
                              <Link to={`/clients/${client.id}/editar`}>
                                <IconPencil className="mr-2 h-4 w-4 text-green-600" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-200" />
                            <DropdownMenuItem
                              className="text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                              onClick={() => eliminarClient(client.id)}
                            >
                              <IconTrash className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Paginació amb estil modern */}
        {totalPages > 1 && (
          <div className="animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-800">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  Mostrant {((currentPage - 1) * 15) + 1} a {Math.min(currentPage * 15, totalItems)} de {totalItems} clients
                </p>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => carregarClients(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="border-gray-200 hover:bg-green-50 hover:border-green-300 rounded-xl px-4 py-2 transition-all duration-300 disabled:opacity-50"
                  >
                    Anterior
                  </Button>
                  <span className="text-gray-700 font-medium px-3 py-2 bg-green-50 rounded-xl border border-green-200">
                    Pàgina {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => carregarClients(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="border-gray-200 hover:bg-green-50 hover:border-green-300 rounded-xl px-4 py-2 transition-all duration-300 disabled:opacity-50"
                  >
                    Següent
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal per afegir nou client */}
        <NouClientModal
          open={showNouModal}
          onOpenChange={setShowNouModal}
          onSuccess={() => carregarClients(currentPage)}
        />
      </div>
    </div>
  )
}

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
      if (isSuperadmin() && filterPropietari !== 'all') {
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
    if (!isSuperadmin()) {
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
  }, [isSuperadmin])

  useEffect(() => {
    carregarClients()
  }, [searchTerm, filterEstat, filterNacionalitat, filterGenere, ...(isSuperadmin() ? [filterPropietari] : [])])

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
    <div className="flex flex-col gap-6 py-4 md:py-6 px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isSuperadmin() ? 'Clients' : 'Els Meus Clients'}
          </h1>
          <p className="text-muted-foreground">
            {isSuperadmin() 
              ? 'Gestiona tots els clients del sistema' 
              : 'Gestiona els teus clients'
            }
          </p>
        </div>
        <Button onClick={() => setShowNouModal(true)}>
          <IconPlus className="mr-2 h-4 w-4" />
          Nou Client
        </Button>
      </div>

      {/* Filtres i cerca */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cercar clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterEstat} onValueChange={setFilterEstat}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Estat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tots</SelectItem>
              <SelectItem value="actiu">Actius</SelectItem>
              <SelectItem value="inactiu">Inactius</SelectItem>
              <SelectItem value="bloquejat">Bloquejats</SelectItem>
            </SelectContent>
          </Select>
          {/* Mostrar filtre de propietari només per superadmins */}
          {isSuperadmin() && (
            <Select value={filterPropietari} onValueChange={setFilterPropietari}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Propietari" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tots els propietaris</SelectItem>
                {propietaris.map((propietari) => (
                  <SelectItem key={propietari.id} value={propietari.id.toString()}>
                    {propietari.nom_complet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Select value={filterGenere} onValueChange={setFilterGenere}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Gènere" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tots</SelectItem>
              {generes.map((genere) => (
                <SelectItem key={genere.value} value={genere.value}>
                  {genere.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {nacionalitatsUniques.length > 0 && (
            <Select value={filterNacionalitat} onValueChange={setFilterNacionalitat}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Nacionalitat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Totes</SelectItem>
                {nacionalitatsUniques.map((nacionalitat) => (
                  <SelectItem key={nacionalitat} value={nacionalitat}>
                    {nacionalitat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <IconFilter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
          <Button variant="outline" size="sm">
            <IconDownload className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estadístiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold">{totalItems}</div>
          <p className="text-sm text-muted-foreground">Total Clients</p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold text-green-600">
            {clients.filter(c => c.estat === 'actiu').length}
          </div>
          <p className="text-sm text-muted-foreground">Clients Actius</p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {clients.filter(c => c.total_estades >= 5 || c.total_gastat >= 2000).length}
          </div>
          <p className="text-sm text-muted-foreground">Clients VIP</p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold text-blue-600">
            {clients.length > 0 ? 
              formatCurrency(clients.reduce((sum, c) => sum + parseFloat(c.total_gastat || 0), 0) / clients.length)
              : formatCurrency(0)}
          </div>
          <p className="text-sm text-muted-foreground">Gastat Mitjà</p>
        </div>
      </div>

      {/* Taula */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Contacte</TableHead>
              <TableHead>Propietari</TableHead>
              <TableHead>Ubicació</TableHead>
              <TableHead>Gènere</TableHead>
              <TableHead>Estadístiques</TableHead>
              <TableHead>Estat</TableHead>
              <TableHead className="text-right">Accions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Carregant clients...
                </TableCell>
              </TableRow>
            ) : clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No s'han trobat clients
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id}>
                  {console.log('Rendering client:', client.nom_complet, 'Propietari:', client.propietari)}
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <IconUser className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{client.nom_complet}</span>
                          {getVipIcon(client)}
                        </div>
                        {client.dni && (
                          <div className="text-sm text-muted-foreground">
                            DNI: {client.dni}
                          </div>
                        )}
                        {client.professio && (
                          <div className="text-sm text-muted-foreground">
                            {client.professio}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <IconMail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{client.email}</span>
                      </div>
                      {client.telefon && (
                        <div className="flex items-center space-x-1">
                          <IconPhone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{client.telefon}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <IconBuilding className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {client.propietari ? client.propietari.nom + ' ' + client.propietari.cognoms : '-'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <IconMapPin className="h-3 w-3 text-muted-foreground" />
                      <div className="text-sm">
                        <div>{client.ciutat || '-'}</div>
                        <div className="text-muted-foreground">{client.nacionalitat || '-'}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getGenereBadge(client.genere)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{client.total_estades} estades</div>
                      <div className="font-medium">{formatCurrency(client.total_gastat)}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getEstatBadge(client.estat)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Obrir menú</span>
                          <IconPencil className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Accions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link to={`/clients/${client.id}`}>
                            <IconEye className="mr-2 h-4 w-4" />
                            Veure detalls
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/clients/${client.id}/editar`}>
                            <IconPencil className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
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

      {/* Paginació */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrant {((currentPage - 1) * 15) + 1} a {Math.min(currentPage * 15, totalItems)} de {totalItems} clients
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => carregarClients(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Anterior
            </Button>
            <span className="text-sm">
              Pàgina {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => carregarClients(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Següent
            </Button>
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
  )
}

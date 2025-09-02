import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Copy, 
  ExternalLink, 
  Mail, 
  Phone, 
  User,
  QrCode,
  Share2,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { useViatgers } from '@/hooks/useViatgers'
import ViatgersService from '@/services/viatgers'
import ReservesService from '@/services/reserves'
import { toast } from 'sonner'

const GenerarFormulariModal = ({ isOpen, onClose, reservaId }) => {
  const { crearViatger } = useViatgers()
  const [loading, setLoading] = useState(false)
  const [loadingReserves, setLoadingReserves] = useState(false)
  const [viatgerCreat, setViatgerCreat] = useState(null)
  const [reserves, setReserves] = useState([])
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telefon: '',
    reserva_id: reservaId || ''
  })

  // Carregar reserves quan s'obri el modal
  useEffect(() => {
    if (isOpen && !reservaId) {
      carregarReserves()
    }
  }, [isOpen, reservaId])

  const carregarReserves = async () => {
    try {
      setLoadingReserves(true)
      const reservesData = await ReservesService.getSelectOptions()
      setReserves(reservesData)
    } catch (error) {
      console.error('Error carregant reserves:', error)
      toast.error('Error carregant les reserves')
    } finally {
      setLoadingReserves(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      const viatgerData = {
        reserva_id: formData.reserva_id || reservaId,
        viatgers: [{
          nom: formData.nom,
          cognoms: formData.nom.split(' ').slice(1).join(' ') || 'Sense cognoms',
          dni_passaport: '', // Es completarà al formulari
          tipus_document: 'DNI',
          data_naixement: '', // Es completarà al formulari
          nacionalitat: 'Espanyola',
          sexe: 'M',
          adreca: '', // Es completarà al formulari
          ciutat: '', // Es completarà al formulari
          codi_postal: '', // Es completarà al formulari
          pais: 'Espanya',
          telefon: formData.telefon || '',
          email: formData.email || ''
        }]
      }
      
      const response = await crearViatger(viatgerData)
      // El response.data ara serà un array, agafem el primer
      setViatgerCreat(response.data[0])
      
    } catch (error) {
      // Error ja gestionat al hook
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Enllaç copiat al portapapers')
  }

  const sendByEmail = (viatger) => {
    const subject = encodeURIComponent('Formulari de registre de viatger')
    const body = encodeURIComponent(
      `Hola ${viatger.nom},\n\n` +
      `Si us plau, omple el següent formulari per registrar-te com a viatger:\n\n` +
      `${window.location.origin}/formulari-viatger/${viatger.token}\n\n` +
      `Aquest registre és obligatori per complir amb els requisits dels Mossos d'Esquadra.\n\n` +
      `Gràcies!`
    )
    
    window.open(`mailto:${viatger.email}?subject=${subject}&body=${body}`)
  }

  const sendByWhatsApp = (viatger) => {
    const message = encodeURIComponent(
      `Hola ${viatger.nom}! 👋\n\n` +
      `Si us plau, omple aquest formulari per registrar-te com a viatger:\n\n` +
      `${window.location.origin}/formulari-viatger/${viatger.token}\n\n` +
      `És obligatori per als Mossos d'Esquadra. Gràcies! 🙂`
    )
    
    const phone = viatger.telefon?.replace(/\D/g, '') // Eliminar caràcters no numèrics
    if (phone) {
      window.open(`https://wa.me/${phone}?text=${message}`)
    } else {
      window.open(`https://wa.me/?text=${message}`)
    }
  }

  const formatReservaLabel = (reserva) => {
    const dataEntrada = new Date(reserva.data_entrada).toLocaleDateString()
    const dataSortida = new Date(reserva.data_sortida).toLocaleDateString()
    return `#${reserva.id} - ${dataEntrada} / ${dataSortida} - ${reserva.client?.nom || 'Client'}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Generar Formulari de Viatger
          </CardTitle>
          <CardDescription>
            Crea un enllaç únic perquè el viatger ompli les seves dades
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!viatgerCreat ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!reservaId && (
                <div>
                  <Label htmlFor="reserva_id">Reserva *</Label>
                  {loadingReserves ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Carregant reserves...
                    </div>
                  ) : (
                    <select
                      id="reserva_id"
                      value={formData.reserva_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, reserva_id: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      required
                    >
                      <option value="">Selecciona una reserva</option>
                      {reserves.map((reserva) => (
                        <option key={reserva.id} value={reserva.id}>
                          {formatReservaLabel(reserva)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="nom">Nom del viatger *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                  placeholder="Nom complet"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemple.com"
                />
              </div>

              <div>
                <Label htmlFor="telefon">Telèfon (opcional)</Label>
                <Input
                  id="telefon"
                  type="tel"
                  value={formData.telefon}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefon: e.target.value }))}
                  placeholder="+34 600 000 000"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Creant...' : 'Crear Formulari'}
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel·lar
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Formulari creat correctament per a <strong>{viatgerCreat.nom}</strong>
                </AlertDescription>
              </Alert>

              <div>
                <Label className="text-sm font-medium">Enllaç del formulari</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={`${window.location.origin}/formulari-viatger/${viatgerCreat.token}`}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(`${window.location.origin}/formulari-viatger/${viatgerCreat.token}`)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/formulari-viatger/${viatgerCreat.token}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Opcions de compartir
                    </h4>
                    
                    <div className="space-y-2">
                      {viatgerCreat.email && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => sendByEmail(viatgerCreat)}
                          className="w-full justify-start"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Enviar per Email
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => sendByWhatsApp(viatgerCreat)}
                        className="w-full justify-start"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Enviar per WhatsApp
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <QrCode className="w-4 h-4" />
                      Codi QR
                    </h4>
                    
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                        <QrCode className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Funcionalitat disponible properament
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="border-t pt-4">
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      setViatgerCreat(null)
                      setFormData({ nom: '', email: '', telefon: '', reserva_id: reservaId || '' })
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Crear Altre Formulari
                  </Button>
                  <Button onClick={onClose} className="flex-1">
                    Tancar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default GenerarFormulariModal

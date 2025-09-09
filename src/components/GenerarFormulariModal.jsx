import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  const [loading, setLoading] = useState(false)
  const [loadingReserves, setLoadingReserves] = useState(false)
  const [formulariCreat, setFormulariCreat] = useState(null)
  const [reserves, setReserves] = useState([])
  const [formData, setFormData] = useState({
    reserva_id: reservaId || ''
  })

  // Carregar reserves quan s'obri el modal
  useEffect(() => {
    if (isOpen && !reservaId) {
      carregarReserves()
    }
  }, [isOpen, reservaId])

  // Reset when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormulariCreat(null)
      setFormData({
        reserva_id: reservaId || ''
      })
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
    
    if (!formData.reserva_id) {
      toast.error('Has de seleccionar una reserva')
      return
    }
    
    try {
      setLoading(true)
      
      const response = await ViatgersService.generarFormulariReserva({
        reserva_id: formData.reserva_id
      })

      setFormulariCreat(response.data)
      toast.success('Formulari de reserva generat correctament!')
    } catch (error) {
      console.error('Error creant formulari:', error)
      toast.error('Error creant el formulari de reserva')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Enllaç copiat al portapapers')
  }

    const sendByEmail = () => {
    if (!formulariCreat) return
    
    const subject = encodeURIComponent('Formulari de viatgers per completar')
    const body = encodeURIComponent(
      `Hola,

Si us plau completa les dades dels viatgers de la teva reserva utilitzant aquest enllaç:

${formulariCreat.link}

Gràcies!`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const sendByWhatsApp = () => {
    if (!formulariCreat) return
    
    const message = encodeURIComponent(
      `Hola! Si us plau completa les dades dels viatgers de la teva reserva utilitzant aquest enllaç: ${formulariCreat.link}`
    )
    window.open(`https://wa.me/?text=${message}`)
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
            Generar Formulari de Reserva
          </CardTitle>
          <CardDescription>
            Crea un enllaç únic per que els viatgers de la reserva omplin les seves dades
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!formulariCreat ? (
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
                    <Select
                      value={formData.reserva_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, reserva_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una reserva" />
                      </SelectTrigger>
                      <SelectContent>
                        {reserves.map((reserva) => (
                          <SelectItem key={reserva.id} value={reserva.id.toString()}>
                            {formatReservaLabel(reserva)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}

              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium mb-2">Informació</h4>
                <p className="text-sm text-muted-foreground">
                  Es crearà un formulari basat en el número d'assistents de la reserva. 
                  Els viatgers podran omplir les seves dades individualment utilitzant l'enllaç generat.
                </p>
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
                  Formulari de reserva creat correctament per a {formulariCreat.viatgers?.length || 0} viatgers
                </AlertDescription>
              </Alert>

              <div>
                <Label className="text-sm font-medium">Enllaç del formulari</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={formulariCreat.link}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(formulariCreat.link)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(formulariCreat.link, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Viatgers per omplir:</Label>
                <div className="space-y-1">
                  {formulariCreat.viatgers?.map((viatger, index) => (
                    <div key={viatger.id} className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">{index + 1}</Badge>
                      {viatger.nom || `Viatger ${index + 1}`}
                      <Badge variant={viatger.estat_formulari === 'omplert' ? 'default' : 'secondary'}>
                        {viatger.estat_formulari === 'omplert' ? 'Completat' : 'Pendent'}
                      </Badge>
                    </div>
                  ))}
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => sendByEmail()}
                        className="w-full justify-start"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Enviar per Email
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => sendByWhatsApp()}
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
                        Codi QR en desenvolupament
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="border-t pt-4">
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      setFormulariCreat(null)
                      setFormData({
                        reserva_id: reservaId || ''
                      })
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

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import ViatgersService from '@/services/viatgers'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'

const FormulariViatgerPage = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [formulariReserva, setFormulariReserva] = useState(null)
  const [viatgers, setViatgers] = useState([])
  const [reserva, setReserva] = useState(null)
  const [justSaved, setJustSaved] = useState(false) // Per ocultar el formulari després de guardar
  
  const [formData, setFormData] = useState({
    nom: '',
    cognoms: '',
    dni: '',
    tipus_document: 'DNI',
    data_naixement: '',
    nacionalitat: 'Espanyola',
    sexe: 'M',
    telefon: '',
    email: '',
    adresa_residencia: '',
    ciutat_residencia: '',
    provincia_residencia: '',
    codi_postal_residencia: '',
    pais_residencia: 'España'
  })

  // Carregar dades del formulari de reserva
  useEffect(() => {
    const carregarFormulari = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await ViatgersService.getFormulariPublic(token)
        
        // La resposta de l'API ve en response.data
        const data = response.data || response
        
        setFormulariReserva(data.formulari)
        setViatgers(data.viatgers || [])
        setReserva(data.reserva)
        
        // Carregar dades del primer viatger pendent si existeix (només per mostrar info)
        if (data.viatgers && data.viatgers.length > 0) {
          // El formulari es manté buit perquè l'usuari ompli les seves dades
          console.log(`Formulari preparat per a ${data.viatgers.length} viatgers`)
        }
        
      } catch (error) {
        console.error('Error carregant formulari:', error)
        setError(error.response?.data?.message || 'Error carregant formulari')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      carregarFormulari()
    }
  }, [token])

    const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      setError(null)
      
      // Trobar el primer viatger pendent (sense nom)
      const viatgerPendent = viatgers.find(v => !v.nom || v.nom.trim() === '')
      
      if (!viatgerPendent) {
        toast.error('Tots els viatgers ja han estat registrats')
        return
      }
      
      // Preparar dades per enviar
      const viatgerData = {
        ...formData,
        id: viatgerPendent.id
      }
      
      const response = await ViatgersService.omplirFormulariPublic(token, {
        viatgers: [viatgerData]
      })
      
      // Actualitzar la llista de viatgers
      if (response.data?.viatgers) {
        const viatgersActualitzats = [...viatgers]
        const index = viatgers.findIndex(v => v.id === viatgerPendent.id)
        if (index !== -1 && response.data.viatgers[0]) {
          viatgersActualitzats[index] = response.data.viatgers[0]
          setViatgers(viatgersActualitzats)
        }
      }
      
      // Comprovar si queden més viatgers pendents
      const viatgersPendents = viatgers.filter(v => !v.nom || v.nom.trim() === '').length - 1
      
      if (viatgersPendents > 0) {
        toast.success(`Viatger registrat! Falten ${viatgersPendents} viatger${viatgersPendents === 1 ? '' : 's'} més`)
      } else {
        toast.success('Últim viatger registrat! Registre complet ✅')
      }
      
      // Netejar formulari per al següent viatger
      setFormData({
        nom: '',
        cognoms: '',
        dni: '',
        tipus_document: 'DNI',
        data_naixement: '',
        nacionalitat: 'Espanyola',
        sexe: 'M',
        telefon: '',
        email: '',
        adresa_residencia: '',
        ciutat_residencia: '',
        provincia_residencia: '',
        codi_postal_residencia: '',
        pais_residencia: 'España'
      })
      
      // Ocultar formulari temporalment
      setJustSaved(true)
      
    } catch (error) {
      console.error('Error guardant formulari:', error)
      const message = error.response?.data?.message || 'Error guardant les dades'
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && viatgers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (viatgers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Formulari no disponible</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">No s'han trobat viatgers per aquest formulari</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <User className="w-6 h-6" />
              Formulari de Registre de Viatger
            </CardTitle>
            <CardDescription>
              Registre obligatori per als Mossos d'Esquadra
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Progrés dels viatgers */}
        {viatgers.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Progrés del registre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Viatgers registrats:</span>
                  <span className="font-medium">
                    {viatgers.filter(v => v.nom && v.nom.trim() !== '').length} de {viatgers.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${(viatgers.filter(v => v.nom && v.nom.trim() !== '').length / viatgers.length) * 100}%` 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {viatgers.filter(v => !v.nom || v.nom.trim() === '').length > 0 
                    ? `Falten ${viatgers.filter(v => !v.nom || v.nom.trim() === '').length} viatger${viatgers.filter(v => !v.nom || v.nom.trim() === '').length === 1 ? '' : 's'} per completar`
                    : 'Tots els viatgers han estat registrats! ✅'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Missatge de registre complet */}
        {viatgers.length > 0 && viatgers.filter(v => !v.nom || v.nom.trim() === '').length === 0 && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                <h3 className="text-lg font-semibold text-green-800">
                  Registre Completat!
                </h3>
                <p className="text-green-700">
                  Tots els viatgers d'aquesta reserva han estat registrats correctament. 
                  El formulari ja compleix amb els requisits dels Mossos d'Esquadra.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Missatge de feedback després de guardar */}
        {justSaved && viatgers.filter(v => !v.nom || v.nom.trim() === '').length > 0 && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800">
                    Dades Guardades Correctament!
                  </h3>
                  <p className="text-green-700 mt-2">
                    {viatgers.filter(v => !v.nom || v.nom.trim() === '').length === 1 
                      ? 'Encara falta 1 viatger més per completar el registre.'
                      : `Encara falten ${viatgers.filter(v => !v.nom || v.nom.trim() === '').length} viatgers més per completar el registre.`
                    }
                  </p>
                </div>
                <Button 
                  onClick={() => setJustSaved(false)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Registrar Següent Viatger
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulari principal */}
        {viatgers.filter(v => !v.nom || v.nom.trim() === '').length > 0 && !justSaved && (
          <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Dades Personals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cognoms">Cognoms *</Label>
                  <Input
                    id="cognoms"
                    value={formData.cognoms}
                    onChange={(e) => handleInputChange('cognoms', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dni">DNI/Passaport *</Label>
                  <Input
                    id="dni"
                    value={formData.dni}
                    onChange={(e) => handleInputChange('dni', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="data_naixement">Data de Naixement *</Label>
                  <Input
                    id="data_naixement"
                    type="date"
                    value={formData.data_naixement}
                    onChange={(e) => handleInputChange('data_naixement', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefon">Telèfon</Label>
                  <Input
                    id="telefon"
                    type="tel"
                    value={formData.telefon}
                    onChange={(e) => handleInputChange('telefon', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Adreça de Residència
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="adresa_residencia">Adreça *</Label>
                <Input
                  id="adresa_residencia"
                  value={formData.adresa_residencia}
                  onChange={(e) => handleInputChange('adresa_residencia', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ciutat_residencia">Ciutat *</Label>
                  <Input
                    id="ciutat_residencia"
                    value={formData.ciutat_residencia}
                    onChange={(e) => handleInputChange('ciutat_residencia', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="provincia_residencia">Província *</Label>
                  <Input
                    id="provincia_residencia"
                    value={formData.provincia_residencia}
                    onChange={(e) => handleInputChange('provincia_residencia', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="codi_postal_residencia">Codi Postal *</Label>
                  <Input
                    id="codi_postal_residencia"
                    value={formData.codi_postal_residencia}
                    onChange={(e) => handleInputChange('codi_postal_residencia', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pais_residencia">País *</Label>
                  <Input
                    id="pais_residencia"
                    value={formData.pais_residencia}
                    onChange={(e) => handleInputChange('pais_residencia', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Dates de l'Estada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="data_arribada">Data d'Arribada *</Label>
                  <Input
                    id="data_arribada"
                    type="date"
                    value={formData.data_arribada}
                    onChange={(e) => handleInputChange('data_arribada', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="data_sortida">Data de Sortida</Label>
                  <Input
                    id="data_sortida"
                    type="date"
                    value={formData.data_sortida}
                    onChange={(e) => handleInputChange('data_sortida', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardant...
                  </>
                ) : (
                  'Guardar Dades'
                )}
              </Button>
            </CardContent>
          </Card>
          </form>
        )}
      </div>
    </div>
  )
}

export default FormulariViatgerPage

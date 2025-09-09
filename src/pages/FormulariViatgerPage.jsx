import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  User, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  AlertCircle,
  CheckCircle,
  Loader2,
  FileText,
  Users,
  Plus,
  Minus,
  Edit
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
  const [editingGuestCount, setEditingGuestCount] = useState(false)
  const [newGuestCount, setNewGuestCount] = useState(0)
  const [updatingGuestCount, setUpdatingGuestCount] = useState(false)
  
  const [formData, setFormData] = useState({
    // Dades del document d'identitat
    tipus_document: 'DNI',
    numero_document: '',
    
    // Dades personals
    nom: '',
    cognom1: '',
    cognom2: '',
    data_naixement: '',
    nacionalitat: 'ESP',
    telefon: '',
    email: '',
    
    // Dades de residència habitual
    adresa_residencia: '',
    codi_postal_residencia: '',
    pais_residencia: 'ESP'
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
        setNewGuestCount(data.viatgers?.length || 0)
        
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

    // Validació en temps real per DNI duplicat
    if (field === 'numero_document' && value.trim()) {
      const dniExistent = viatgers.find(v => 
        v.dni_passaport && 
        v.dni_passaport.trim().toLowerCase() === value.trim().toLowerCase() &&
        (!v.nom || v.nom.trim() === '') === false // Només comprovar viatgers ja registrats
      )
      
      if (dniExistent) {
        setError(`Aquest DNI/Passaport ja està registrat per: ${dniExistent.nom || 'un altre viatger'}`)
      } else if (error && error.includes('DNI/Passaport')) {
        setError(null) // Netejar error de DNI si ja no hi ha conflicte
      }
    }
  }

  const handleUpdateGuestCount = async () => {
    if (newGuestCount === viatgers.length || newGuestCount < 1) {
      setEditingGuestCount(false)
      return
    }

    try {
      setUpdatingGuestCount(true)
      setError(null)

      const response = await ViatgersService.updateGuestCountPublic(token, newGuestCount)
      
      if (response.success) {
        toast.success(`Número de viatgers actualitzat a ${newGuestCount}`)
        
        // Recarregar les dades del formulari
        const updatedResponse = await ViatgersService.getFormulariPublic(token)
        const updatedData = updatedResponse.data || updatedResponse
        
        setViatgers(updatedData.viatgers || [])
        setReserva(updatedData.reserva)
        setEditingGuestCount(false)
        
        // Si s'ha reduït el número i hi havia un formulari omplert, netejar-lo
        if (newGuestCount < viatgers.length) {
          setFormData({
            tipus_document: 'DNI',
            numero_document: '',
            nom: '',
            cognom1: '',
            cognom2: '',
            data_naixement: '',
            nacionalitat: 'ESP',
            telefon: '',
            email: '',
            adresa_residencia: '',
            codi_postal_residencia: '',
            pais_residencia: 'ESP'
          })
        }
      } else {
        toast.error('Error actualitzant el número de viatgers')
      }
    } catch (error) {
      console.error('Error actualitzant guest count:', error)
      const message = error.response?.data?.message || 'Error actualitzant el número de viatgers'
      setError(message)
      toast.error(message)
    } finally {
      setUpdatingGuestCount(false)
    }
  }

  const incrementGuestCount = () => {
    setNewGuestCount(prev => Math.min(prev + 1, 999))
  }

  const decrementGuestCount = () => {
    setNewGuestCount(prev => Math.max(prev - 1, 1))
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

      // Validació de DNI duplicat local
      const dniIntroduit = formData.numero_document?.trim()
      if (dniIntroduit) {
        const dniExistent = viatgers.find(v => 
          v.id !== viatgerPendent.id && 
          v.dni_passaport && 
          v.dni_passaport.trim().toLowerCase() === dniIntroduit.toLowerCase()
        )
        
        if (dniExistent) {
          setError(`El DNI/Passaport "${dniIntroduit}" ja està registrat per un altre viatger d'aquesta reserva`)
          toast.error(`DNI/Passaport duplicat: ${dniIntroduit}`)
          return
        }
      }
      
      // Preparar dades per enviar
      const viatgerData = {
        ...formData,
        dni: formData.numero_document, // Mapear numero_document a dni pel backend
        cognoms: `${formData.cognom1} ${formData.cognom2}`.trim(), // Combinar cognoms
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
        // Dades del document d'identitat
        tipus_document: 'DNI',
        numero_document: '',
        
        // Dades personals
        nom: '',
        cognom1: '',
        cognom2: '',
        data_naixement: '',
        nacionalitat: 'ESP',
        telefon: '',
        email: '',
        
        // Dades de residència habitual
        adresa_residencia: '',
        codi_postal_residencia: '',
        pais_residencia: 'ESP'
      })
      
      // Ocultar formulari temporalment
      setJustSaved(true)
      
    } catch (error) {
      console.error('Error guardant formulari:', error)
      
      // Gestió específica per DNI duplicat
      if (error.response?.data?.dni_duplicat) {
        const message = error.response.data.message || 'DNI/Passaport duplicat detectat'
        setError(message)
        toast.error(message)
      } else {
        const message = error.response?.data?.message || 'Error guardant les dades'
        setError(message)
        toast.error(message)
      }
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
              <FileText className="w-6 h-6" />
              Fitxa de Registre de Viatger
            </CardTitle>
            <CardDescription>
              Formulari oficial segons les especificacions dels Mossos d'Esquadra
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Progrés dels viatgers */}
        {viatgers.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Progrés del registre
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingGuestCount(!editingGuestCount)}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Modificar número
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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

                {/* Editor del número de viatgers */}
                {editingGuestCount && (
                  <div className="border-t pt-4">
                    <Label className="text-sm font-medium">Modificar número de viatgers:</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={decrementGuestCount}
                        disabled={newGuestCount <= 1}
                        className="px-2"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input 
                        type="number" 
                        value={newGuestCount}
                        onChange={(e) => setNewGuestCount(Math.max(1, Math.min(999, parseInt(e.target.value) || 1)))}
                        min={1}
                        max={999}
                        className="text-center w-20"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={incrementGuestCount}
                        disabled={newGuestCount >= 999}
                        className="px-2"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={handleUpdateGuestCount}
                        disabled={updatingGuestCount || newGuestCount === viatgers.length}
                        size="sm"
                        className="ml-2"
                      >
                        {updatingGuestCount ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            Actualitzant...
                          </>
                        ) : (
                          'Confirmar'
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingGuestCount(false)
                          setNewGuestCount(viatgers.length)
                        }}
                      >
                        Cancel·lar
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {newGuestCount > viatgers.length 
                        ? `S'afegiran ${newGuestCount - viatgers.length} viatgers més`
                        : newGuestCount < viatgers.length 
                        ? `S'eliminaran ${viatgers.length - newGuestCount} viatgers sense registrar`
                        : 'No hi ha canvis'
                      }
                    </p>
                  </div>
                )}
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

          {/* 1. Dades del document d'identitat */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                1. Dades del document d'identitat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipus_document">Tipus de document *</Label>
                  <Select
                    value={formData.tipus_document}
                    onValueChange={(value) => handleInputChange('tipus_document', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tipus de document" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DNI">DNI</SelectItem>
                      <SelectItem value="NIE">NIE</SelectItem>
                      <SelectItem value="P">Passaport</SelectItem>
                      <SelectItem value="D">Carnet de conduir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="numero_document">Número del document *</Label>
                  <Input
                    id="numero_document"
                    value={formData.numero_document}
                    onChange={(e) => handleInputChange('numero_document', e.target.value)}
                    placeholder="Ex: 12345678A"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Dades personals */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                2. Dades personals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <Label htmlFor="cognom1">Primer cognom *</Label>
                  <Input
                    id="cognom1"
                    value={formData.cognom1}
                    onChange={(e) => handleInputChange('cognom1', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cognom2">Segon cognom *</Label>
                  <Input
                    id="cognom2"
                    value={formData.cognom2}
                    onChange={(e) => handleInputChange('cognom2', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="data_naixement">Data de naixement *</Label>
                  <Input
                    id="data_naixement"
                    type="date"
                    value={formData.data_naixement}
                    onChange={(e) => handleInputChange('data_naixement', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nacionalitat">Nacionalitat *</Label>
                  <Select
                    value={formData.nacionalitat}
                    onValueChange={(value) => handleInputChange('nacionalitat', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona nacionalitat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ESP">Espanyola</SelectItem>
                      <SelectItem value="FRA">Francesa</SelectItem>
                      <SelectItem value="DEU">Alemanya</SelectItem>
                      <SelectItem value="ITA">Italiana</SelectItem>
                      <SelectItem value="GBR">Britànica</SelectItem>
                      <SelectItem value="USA">Nord-americana</SelectItem>
                      <SelectItem value="MAR">Marroquina</SelectItem>
                      <SelectItem value="ROU">Romanesa</SelectItem>
                      <SelectItem value="BGR">Búlgara</SelectItem>
                      <SelectItem value="POL">Polonesa</SelectItem>
                      <SelectItem value="OTHER">Altres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefon">Telèfon *</Label>
                  <Input
                    id="telefon"
                    type="tel"
                    value={formData.telefon}
                    onChange={(e) => handleInputChange('telefon', e.target.value)}
                    placeholder="Ex: +34 600 123 456"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Correu electrònic *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="exemple@correu.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Dades de residència habitual */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                3. Dades de residència habitual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="adresa_residencia">Adreça postal *</Label>
                <Input
                  id="adresa_residencia"
                  value={formData.adresa_residencia}
                  onChange={(e) => handleInputChange('adresa_residencia', e.target.value)}
                  placeholder="Carrer, número, pis, porta"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="codi_postal_residencia">Codi postal *</Label>
                  <Input
                    id="codi_postal_residencia"
                    value={formData.codi_postal_residencia}
                    onChange={(e) => handleInputChange('codi_postal_residencia', e.target.value)}
                    placeholder="Ex: 08600"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pais_residencia">País *</Label>
                  <Select
                    value={formData.pais_residencia}
                    onValueChange={(value) => handleInputChange('pais_residencia', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona país" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ESP">Espanya</SelectItem>
                      <SelectItem value="FRA">França</SelectItem>
                      <SelectItem value="DEU">Alemanya</SelectItem>
                      <SelectItem value="ITA">Itàlia</SelectItem>
                      <SelectItem value="GBR">Regne Unit</SelectItem>
                      <SelectItem value="USA">Estats Units</SelectItem>
                      <SelectItem value="MAR">Marroc</SelectItem>
                      <SelectItem value="OTHER">Altres</SelectItem>
                    </SelectContent>
                  </Select>
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

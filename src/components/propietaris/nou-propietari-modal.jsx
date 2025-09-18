import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { 
  IconUser, 
  IconMail, 
  IconPhone, 
  IconMapPin,
  IconFileText 
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { PropietarisService } from '@/services/propietaris'

export function NouPropietariModal({ open, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const { success, error } = useToast()

  // Configuració de react-hook-form
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues: {
      nom: '',
      cognoms: '',
      dni: '',
      email: '',
      telefon: '',
      adreca: '',
      ciutat: '',
      codi_postal: '',
      provincia: '',
      pais: 'Espanya',
      data_naixement: '',
      estat: 'actiu',
      notes: ''
    }
  })

  const estats = [
    { value: 'actiu', label: 'Actiu' },
    { value: 'inactiu', label: 'Inactiu' },
    { value: 'suspès', label: 'Suspès' }
  ]

  useEffect(() => {
    if (open) {
      reset()
      clearErrors()
    }
  }, [open, reset, clearErrors])

  const onSubmit = async (data) => {
    setLoading(true)
    clearErrors()

    // Preparar dades per al backend
    const dataToSend = {
      ...data,
      dni: data.dni.toUpperCase(),
      // Camps opcionals com null si estan buits
      telefon: data.telefon || null,
      adreca: data.adreca || null,
      ciutat: data.ciutat || null,
      codi_postal: data.codi_postal || null,
      provincia: data.provincia || null,
      data_naixement: data.data_naixement || null,
      notes: data.notes || null
    }

    const response = await PropietarisService.create(dataToSend)
    
    if (response.success) {
      success('Propietari creat correctament')
      onSuccess()
      onOpenChange(false)
      reset()
    } else {
      // Gestionar errors específics de validació
      if (response.errors) {
        Object.keys(response.errors).forEach(field => {
          setError(field, {
            type: 'server',
            message: Array.isArray(response.errors[field]) 
              ? response.errors[field][0] 
              : response.errors[field]
          })
        })
        
        error('Hi ha errors en el formulari. Revisa els camps marcats.')
      } else {
        error(response.message || 'Error en crear el propietari')
      }
    }
    
    setLoading(false)
  }

  const handleClose = () => {
    reset()
    clearErrors()
    onOpenChange(false)
  }

  // Component per mostrar errors
  const FieldError = ({ error }) => {
    if (!error) return null
    return (
      <div className="text-sm text-red-500 mt-1">
        {error.message}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-0 shadow-2xl backdrop-blur-xl">
        {/* Background decorations */}
        <div className="absolute top-4 -left-4 w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        
        <div className="relative">
          <DialogHeader className="space-y-4 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <IconUser className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Nou Propietari
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-1">
                  Afegeix un nou propietari al sistema
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[70vh] pr-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Informació personal */}
              <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 space-y-6 shadow-lg">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <IconUser className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Informació Personal
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="nom" className="text-sm font-medium text-gray-700">Nom *</Label>
                    <Input
                      id="nom"
                      {...register('nom', { 
                        required: 'El nom és obligatori',
                        minLength: { value: 2, message: 'El nom ha de tenir almenys 2 caràcters' }
                      })}
                      placeholder="Nom del propietari"
                      className={`bg-white/80 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl transition-all duration-300 ${errors.nom ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    <FieldError error={errors.nom} />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="cognoms" className="text-sm font-medium text-gray-700">Cognoms *</Label>
                    <Input
                      id="cognoms"
                      {...register('cognoms', { 
                        required: 'Els cognoms són obligatoris',
                        minLength: { value: 2, message: 'Els cognoms han de tenir almenys 2 caràcters' }
                      })}
                      placeholder="Cognoms del propietari"
                      className={`bg-white/80 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl transition-all duration-300 ${errors.cognoms ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    <FieldError error={errors.cognoms} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="dni" className="text-sm font-medium text-gray-700">DNI *</Label>
                    <Input
                      id="dni"
                      {...register('dni', { 
                        required: 'El DNI és obligatori',
                        pattern: { 
                          value: /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i, 
                          message: 'Format de DNI invàlid (ex: 12345678A)' 
                        }
                      })}
                      placeholder="12345678A"
                      style={{ textTransform: 'uppercase' }}
                      className={`bg-white/80 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl transition-all duration-300 ${errors.dni ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    <FieldError error={errors.dni} />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="data_naixement" className="text-sm font-medium text-gray-700">Data de Naixement</Label>
                    <Input
                      id="data_naixement"
                      type="date"
                      {...register('data_naixement')}
                      className={`bg-white/80 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl transition-all duration-300 ${errors.data_naixement ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    <FieldError error={errors.data_naixement} />
                  </div>
                </div>
              </div>

              {/* Informació de contacte */}
              <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 space-y-6 shadow-lg">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <IconMail className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Informació de Contacte
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</Label>
                    <div className="relative">
                      <IconMail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        {...register('email', { 
                          required: 'L\'email és obligatori',
                          pattern: { 
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                        message: 'Format d\'email invàlid' 
                      }
                    })}
                    placeholder="propietari@example.com"
                    className={`pl-9 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                <FieldError error={errors.email} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefon">Telèfon</Label>
                <div className="relative">
                  <IconPhone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="telefon"
                    {...register('telefon', {
                      pattern: { 
                        value: /^[0-9+\s-]{9,}$/, 
                        message: 'Format de telèfon invàlid' 
                      }
                    })}
                    placeholder="+34 123 456 789"
                    className={`pl-9 ${errors.telefon ? 'border-red-500' : ''}`}
                  />
                </div>
                <FieldError error={errors.telefon} />
              </div>
            </div>
          </div>

          {/* Adreça */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Adreça</h3>
            
            <div className="space-y-2">
              <Label htmlFor="adreca">Adreça</Label>
              <div className="relative">
                <IconMapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="adreca"
                  {...register('adreca')}
                  placeholder="Carrer, número, pis..."
                  className={`pl-9 ${errors.adreca ? 'border-red-500' : ''}`}
                />
              </div>
              <FieldError error={errors.adreca} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ciutat">Ciutat</Label>
                <Input
                  id="ciutat"
                  {...register('ciutat')}
                  placeholder="Barcelona"
                  className={errors.ciutat ? 'border-red-500' : ''}
                />
                <FieldError error={errors.ciutat} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="codi_postal">Codi Postal</Label>
                <Input
                  id="codi_postal"
                  {...register('codi_postal', {
                    pattern: { value: /^\d{5}$/, message: 'El codi postal ha de tenir 5 dígits' }
                  })}
                  placeholder="08001"
                  className={errors.codi_postal ? 'border-red-500' : ''}
                />
                <FieldError error={errors.codi_postal} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="provincia">Província</Label>
                <Input
                  id="provincia"
                  {...register('provincia')}
                  placeholder="Barcelona"
                  className={errors.provincia ? 'border-red-500' : ''}
                />
                <FieldError error={errors.provincia} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pais">País</Label>
              <Input
                id="pais"
                {...register('pais')}
                placeholder="Espanya"
                className={errors.pais ? 'border-red-500' : ''}
              />
              <FieldError error={errors.pais} />
            </div>
          </div>

          {/* Estat i notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Estat i Notes</h3>
            
            <div className="space-y-2">
              <Label htmlFor="estat">Estat</Label>
              <Controller
                name="estat"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={errors.estat ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecciona l'estat" />
                    </SelectTrigger>
                    <SelectContent>
                      {estats.map((estat) => (
                        <SelectItem key={estat.value} value={estat.value}>
                          {estat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError error={errors.estat} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Notes addicionals sobre el propietari..."
                className="min-h-[100px]"
              />
              <FieldError error={errors.notes} />
            </div>
          </div>

              {/* Botons */}
              <div className="flex justify-end gap-4 pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                  className="bg-white/80 border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl px-6 py-2 transition-all duration-300"
                >
                  Cancel·lar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl px-6 py-2"
                >
                  {loading ? 'Creant...' : 'Crear Propietari'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
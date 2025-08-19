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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconUser className="h-5 w-5" />
            Nou Propietari
          </DialogTitle>
          <DialogDescription>
            Afegeix un nou propietari al sistema. Els camps marcats amb * són obligatoris.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informació personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Informació Personal</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  {...register('nom', { 
                    required: 'El nom és obligatori',
                    minLength: { value: 2, message: 'El nom ha de tenir almenys 2 caràcters' }
                  })}
                  placeholder="Nom del propietari"
                  className={errors.nom ? 'border-red-500' : ''}
                />
                <FieldError error={errors.nom} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cognoms">Cognoms *</Label>
                <Input
                  id="cognoms"
                  {...register('cognoms', { 
                    required: 'Els cognoms són obligatoris',
                    minLength: { value: 2, message: 'Els cognoms han de tenir almenys 2 caràcters' }
                  })}
                  placeholder="Cognoms del propietari"
                  className={errors.cognoms ? 'border-red-500' : ''}
                />
                <FieldError error={errors.cognoms} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dni">DNI *</Label>
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
                  className={errors.dni ? 'border-red-500' : ''}
                />
                <FieldError error={errors.dni} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_naixement">Data de Naixement</Label>
                <Input
                  id="data_naixement"
                  type="date"
                  {...register('data_naixement')}
                  className={errors.data_naixement ? 'border-red-500' : ''}
                />
                <FieldError error={errors.data_naixement} />
              </div>
            </div>
          </div>

          {/* Informació de contacte */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Informació de Contacte</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <IconMail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel·lar
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creant...' : 'Crear Propietari'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

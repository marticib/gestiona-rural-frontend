import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Copy, Link2, X } from 'lucide-react'
import { toast } from 'sonner'

const MostrarLinkModal = ({ isOpen, onClose, reserva, formulariReserva }) => {
  if (!isOpen || !reserva) return null

  console.log('formulariReserva data:', formulariReserva) // Debug

  // Gestionar diferents estructures de dades
  const formulari = formulariReserva?.data?.formulari || formulariReserva?.formulari
  const viatgers = formulariReserva?.data?.viatgers || formulariReserva?.viatgers || []
  const linkFormulari = formulariReserva?.data?.link || 
    (formulari?.token_formulari ? `${window.location.origin}/formulari/${formulari.token_formulari}` : null)

  const handleCopiarLink = async () => {
    if (!linkFormulari) {
      toast.error('No hi ha link disponible')
      return
    }
    
    try {
      await navigator.clipboard.writeText(linkFormulari)
      toast.success('Link copiat al portapapers!')
    } catch (error) {
      // Fallback per navegadors que no suporten clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = linkFormulari
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand('copy')
        toast.success('Link copiat al portapapers!')
      } catch (fallbackError) {
        toast.error('No s\'ha pogut copiar el link')
      }
      document.body.removeChild(textArea)
    }
  }

  const handleCompartirWhatsApp = () => {
    if (!linkFormulari) return
    
    const missatge = encodeURIComponent(
      `Hola, si us plau completa les dades dels viatgers de la reserva #${reserva.id} utilitzant aquest enllaç: ${linkFormulari}`
    )
    window.open(`https://wa.me/?text=${missatge}`, '_blank')
  }

  const handleCompartirEmail = () => {
    if (!linkFormulari) return
    
    const assumpte = encodeURIComponent('Formulari de viatgers per completar')
    const cos = encodeURIComponent(
      `Hola,\n\nSi us plau completa les dades dels viatgers de la reserva #${reserva.id} utilitzant aquest enllaç:\n\n${linkFormulari}\n\nGràcies!`
    )
    window.open(`mailto:?subject=${assumpte}&body=${cos}`, '_blank')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="w-5 h-5" />
                Link del Formulari de Reserva
              </CardTitle>
              <CardDescription>
                Reserva #{reserva.id} - {viatgers?.length || 0} viatgers
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Link del formulari:</label>
            {linkFormulari ? (
              <div className="flex gap-2">
                <Input
                  value={linkFormulari}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  onClick={handleCopiarLink}
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                <p>No hi ha formulari generat per aquesta reserva</p>
                <p className="mt-2 text-xs">Debug info:</p>
                <pre className="text-xs overflow-auto mt-1">
                  {JSON.stringify({ formulari, viatgers, formulariReserva }, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Compartir:</label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCompartirWhatsApp}
                className="flex-1"
                disabled={!linkFormulari}
              >
                WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={handleCompartirEmail}
                className="flex-1"
                disabled={!linkFormulari}
              >
                Email
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Tancar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MostrarLinkModal

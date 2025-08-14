import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

export function ToastExamplePage() {
  const toast = useToast()

  const showSuccessToast = () => {
    toast.success('Operació completada!', 'L\'acció s\'ha realitzat correctament.')
  }

  const showErrorToast = () => {
    toast.error('Error!', 'Hi ha hagut un problema amb l\'operació.')
  }

  const showInfoToast = () => {
    toast.info('Informació', 'Aquesta és una notificació informativa.')
  }

  const showWarningToast = () => {
    toast.warning('Atenció!', 'Aquesta acció no es pot desfer.')
  }

  const showLoadingToast = () => {
    const loadingToast = toast.loading('Carregant...')
    
    // Simular una operació que triga 3 segons
    setTimeout(() => {
      toast.dismiss(loadingToast)
      toast.success('Carrega completada!')
    }, 3000)
  }

  const showPromiseToast = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve('Èxit!')
        } else {
          reject('Error!')
        }
      }, 2000)
    })

    toast.promise(promise, {
      loading: 'Processant...',
      success: 'Operació completada amb èxit!',
      error: 'Hi ha hagut un error en el procés.'
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Exemples de Notificacions Toast</h1>
        <p className="text-muted-foreground mt-2">
          Prova els diferents tipus de notificacions disponibles
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Button onClick={showSuccessToast} variant="default">
          Toast d'Èxit
        </Button>

        <Button onClick={showErrorToast} variant="destructive">
          Toast d'Error
        </Button>

        <Button onClick={showInfoToast} variant="secondary">
          Toast d'Informació
        </Button>

        <Button onClick={showWarningToast} variant="outline">
          Toast d'Advertència
        </Button>

        <Button onClick={showLoadingToast} variant="ghost">
          Toast de Carrega
        </Button>

        <Button onClick={showPromiseToast} variant="secondary">
          Toast amb Promesa
        </Button>
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Com utilitzar-ho:</h2>
        <pre className="text-sm bg-background p-3 rounded border overflow-x-auto">
{`import { useToast } from '@/hooks/use-toast'

function MyComponent() {
  const toast = useToast()
  
  const handleClick = () => {
    toast.success('Missatge d'èxit!')
    toast.error('Missatge d'error!')
    toast.info('Missatge informatiu!')
    toast.warning('Missatge d'advertència!')
  }
  
  return <button onClick={handleClick}>Mostrar Toast</button>
}`}
        </pre>
      </div>
    </div>
  )
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/auth-context.jsx'
import { router } from './router'
import { Toaster } from '@/components/ui/sonner'
import './lib/api-interceptor.js' // Importar l'interceptor API
import './index.css'

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </StrictMode>,
  )
}

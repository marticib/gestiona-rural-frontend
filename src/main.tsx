import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/auth-context.jsx'
import { router } from './router'
import { Toaster } from '@/components/ui/sonner'
import './index.css'

// Només carregar l'interceptor API si no estem a la landing page
if (window.location.pathname !== '/') {
  import('./lib/api-interceptor.js')
}

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

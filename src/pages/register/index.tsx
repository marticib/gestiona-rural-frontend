import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Building2, ArrowLeft } from 'lucide-react'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Gestiona</span>
            </Link>

            {/* Navigation buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Tornar a l'inici
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline">
                  Iniciar Sessió
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <Building2 className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Registra't a Gestiona
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Aquesta funcionalitat està en desenvolupament
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">
                Vols accedir a la plataforma?
              </h2>
              <p className="text-blue-700 mb-4">
                Si ja tens un compte o vols provar la plataforma, pots iniciar sessió amb les credencials de prova.
              </p>
              <Link to="/login">
                <Button>
                  Anar al Login
                </Button>
              </Link>
            </div>

            <div className="space-y-4 text-left">
              <h3 className="text-lg font-semibold text-gray-900">
                Funcionalitats que podràs utilitzar:
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Gestió completa d'allotjaments turístics
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Control de clients i reserves
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Dashboard amb analítiques en temps real
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Sistema de rols per propietaris i superadmins
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Interfície intuïtiva i fàcil d'utilitzar
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2025 Gestiona. Tots els drets reservats.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

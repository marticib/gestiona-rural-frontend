import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Building2, Users, Calendar, BarChart3, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Gestiona</span>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">
                  Iniciar Sessió
                </Button>
              </Link>
              <Link to="/register">
                <Button>
                  Registrar-se
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Gestiona els teus
            <span className="text-blue-600"> allotjaments turístics</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            La plataforma completa per gestionar propietaris, allotjaments, clients i reserves. 
            Simplifica la gestió del teu negoci turístic amb una eina intuïtiva i potent.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link to="/app">
                <Button size="lg" className="w-full sm:w-auto">
                  Comença ara
                </Button>
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Saber més
              </Button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Gestió d'Allotjaments</h3>
              <p className="mt-2 text-base text-gray-500">
                Organitza i gestiona tots els teus allotjaments turístics des d'un sol lloc.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Control de Clients</h3>
              <p className="mt-2 text-base text-gray-500">
                Mantén un registre complet dels teus clients i la seva informació.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mx-auto">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Reserves</h3>
              <p className="mt-2 text-base text-gray-500">
                Gestiona totes les reserves amb un sistema intuïtiu i eficient.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white mx-auto">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Analítiques</h3>
              <p className="mt-2 text-base text-gray-500">
                Obtén insights valuosos sobre el rendiment del teu negoci.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white mx-auto">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Seguretat</h3>
              <p className="mt-2 text-base text-gray-500">
                Dades segures amb control d'accés basat en rols d'usuari.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Automatització</h3>
              <p className="mt-2 text-base text-gray-500">
                Automatitza processos repetitius i estalvia temps valuós.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 sm:py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Comença a gestionar els teus allotjaments avui
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Uneix-te a centenars de propietaris que ja utilitzen Gestiona per optimitzar el seu negoci.
              </p>
              <div className="mt-8">
                <Link to="/app">
                  <Button size="lg">
                    Inicia sessió ara
                  </Button>
                </Link>
              </div>
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

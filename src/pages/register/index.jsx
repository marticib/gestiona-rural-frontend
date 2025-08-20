import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Building2, ArrowLeft, CheckCircle, Star, Users, Shield } from 'lucide-react'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900">Gestiona</span>
            </Link>

            {/* Navigation buttons */}
            <div className="flex items-center space-x-3">
              <Link to="/">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Tornar a l'inici
                </Button>
              </Link>
              <Link to="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-full">
                  Iniciar Sessió
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-8 flex items-center justify-center">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 mb-6 tracking-tight">
            Registra't a Gestiona
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Aquesta funcionalitat està en desenvolupament. Mentrestant, pots provar la plataforma amb el nostre compte de demostració.
          </p>
        </div>

        {/* Demo Access Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 lg:p-12 mb-12 border border-blue-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Prova la plataforma ara mateix
            </h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              Accedeix al nostre entorn de demostració amb dades reals per explorar totes les funcionalitats de Gestiona.
            </p>
            <Link to="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 text-lg rounded-full h-auto font-medium">
                Accedir a la demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Gestió multi-usuari
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Sistema de rols avançat amb permisos personalitzats per propietaris, administradors i clients.
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Seguretat avançada
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Autenticació segura, xifratge de dades i compliment total amb la normativa de protecció de dades.
            </p>
          </div>
        </div>

        {/* Benefits List */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 lg:p-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Quan et registris, podràs:
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Gestionar allotjaments sense límits",
              "Crear i administrar reserves",
              "Controlar clients registrats i convidats",
              "Accedir a analítiques detallades",
              "Configurar alertes personalitzades",
              "Exportar informes en PDF",
              "Sincronitzar amb calendaris externs",
              "Rebre suport tècnic prioritari"
            ].map((benefit, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Bottom */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Vols ser dels primers en provar-ho?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Deixa'ns les teves dades i t'avisarem tan bon punt estigui disponible el registre públic.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg rounded-full h-auto border-gray-300 hover:border-gray-400">
              Notifica'm quan estigui llest
            </Button>
            <Link to="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-full h-auto font-medium">
                Explorar demo ara
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center mr-3">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">Gestiona</span>
            </div>
            <p className="text-gray-500 text-sm">© 2025 Gestiona. Tots els drets reservats.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

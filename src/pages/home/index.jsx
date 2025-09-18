import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Building2, Users, Calendar, BarChart3, Shield, Zap, ArrowRight, CheckCircle, Star } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useState, useEffect } from 'react'
import publicService from '@/services/publicService'

export default function HomePage() {
  const { user } = useAuth()
  const [plans, setPlans] = useState([])
  const [loadingPlans, setLoadingPlans] = useState(true)
  
  // URLs del Hub per login i registre
  const HUB_URL = import.meta.env.VITE_HUB_APP_URL || 'http://localhost:3000'
  const currentUrl = encodeURIComponent(window.location.origin)
  const hubLoginUrl = `${HUB_URL}/login?return_url=${currentUrl}&app=gestiona-rural`
  const hubRegisterUrl = `${HUB_URL}/register?return_url=${currentUrl}&app=gestiona-rural`

  // Carregar plans quan es munta el component
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const plansData = await publicService.getPublicPlans()
        setPlans(plansData)
      } catch (error) {
        console.error('Error carregant plans:', error)
      } finally {
        setLoadingPlans(false)
      }
    }
    
    loadPlans()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 animate-in fade-in-2 slide-in-from-top-4 duration-1000">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">Gestiona</span>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center space-x-3">
              {user ? (
                // Si l'usuari està autenticat, mostra botons per accedir a l'app
                <>
                  <span className="text-gray-600">Hola, {user.name}</span>
                  <Link to="/app">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      Accedir a l'App
                    </Button>
                  </Link>
                </>
              ) : (
                // Si no està autenticat, mostra botons de login local i registre del Hub
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 transform transition-all duration-300 hover:scale-105">
                      Iniciar Sessió
                    </Button>
                  </Link>
                  <a href={hubRegisterUrl}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      Registrar-se
                    </Button>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center">
          <h1 className="text-5xl lg:text-7xl font-semibold text-gray-900 tracking-tight leading-tight animate-in fade-in-2 slide-in-from-bottom-4 duration-1000">
            Gestiona els teus
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-in slide-in-from-bottom-4 duration-1000 delay-100">
              allotjaments turístics
            </span>
          </h1>
          <p className="mt-8 max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-100">
            La plataforma més intuïtiva per gestionar propietaris, allotjaments, clients i reserves. 
            Simplifica el teu negoci turístic amb tecnologia d'avantguarda.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-100">
            {user ? (
              <Link to="/app">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-full h-auto font-medium group transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  Accedir a l'App
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            ) : (
              <a href={hubRegisterUrl}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-full h-auto font-medium group transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  Comença ara
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </a>
            )}
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg rounded-full h-auto border-gray-300 hover:border-gray-400 transform transition-all duration-300 hover:scale-105 hover:bg-gray-50">
              Veure demo
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex items-center justify-center space-x-8 text-sm text-gray-500 animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-100">
            <div className="flex items-center transform transition-all duration-300 hover:scale-110">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Segur i privat
            </div>
            <div className="flex items-center transform transition-all duration-300 hover:scale-110">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Sense permanència
            </div>
            <div className="flex items-center transform transition-all duration-300 hover:scale-110">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Suport 24/7
            </div>
          </div>
        </div>

        {/* Product preview */}
        <div className="py-16">
          <div className="relative mx-auto max-w-4xl animate-in fade-in-2 slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative bg-white border border-gray-200 rounded-3xl shadow-2xl p-8 transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
              <div className="bg-gray-50 rounded-2xl p-6 min-h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center transform transition-all duration-500 hover:rotate-12 hover:scale-110">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Dashboard intuïtiu</h3>
                  <p className="text-gray-600">Visualitza totes les dades del teu negoci d'un cop d'ull</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="py-16">
          <div className="text-center mb-16 animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-200">
            <h2 className="text-4xl font-semibold text-gray-900 mb-4">
              Tot el que necessites per créixer
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Funcionalitats pensades per facilitar la gestió diària del teu negoci turístic
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: "Gestió d'Allotjaments",
                description: "Organitza tots els teus allotjaments amb informació detallada i actualitzada en temps real.",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: Users,
                title: "Control de Clients",
                description: "Base de dades completa dels teus clients amb historial de reserves i preferències.",
                color: "from-green-500 to-green-600"
              },
              {
                icon: Calendar,
                title: "Gestió de Reserves",
                description: "Sistema avançat de reserves amb calendari intel·ligent i gestió automàtica.",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: BarChart3,
                title: "Analítiques Avançades",
                description: "Reports detallats sobre ocupació, ingressos i rendiment del teu negoci.",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Shield,
                title: "Seguretat Total",
                description: "Dades protegides amb xifratge avançat i control d'accés basat en rols.",
                color: "from-red-500 to-pink-500"
              },
              {
                icon: Zap,
                title: "Automatització",
                description: "Automatitza tasques repetitives i centra't en fer créixer el teu negoci.",
                color: "from-indigo-500 to-purple-500"
              }
            ].map((feature, index) => (
              <div key={index} className={`group animate-in fade-in-2 slide-in-from-bottom-4 duration-1000`} style={{ animationDelay: `${400 + index * 150}ms` }}>
                <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 group-hover:border-gray-200">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 transition-colors duration-300 group-hover:text-blue-600">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed transition-colors duration-300 group-hover:text-gray-700">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plans Section */}
        <div className="py-16 bg-gray-50">
          <div className="text-center mb-16 animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-300">
            <h2 className="text-4xl font-semibold text-gray-900 mb-4">
              Tria el pla perfecte per al teu negoci
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Plans flexibles que s'adapten a les necessitats del teu allotjament rural
            </p>
          </div>

          {loadingPlans ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
              {plans.map((plan, index) => {
                // Marcar com a popular el pla amb sort_order més baix (excepte el primer si és gratuït)
                const isPopular = plan.sort_order === 2 || (plans.length > 1 && index === 1)
                
                return (
                  <div key={plan.id} className={`bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${isPopular ? 'ring-2 ring-blue-500 relative' : ''}`}>
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          Més popular
                        </div>
                      </div>
                    )}
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        {parseFloat(plan.price) === 0 ? 'Gratis' : `€${plan.price}`}
                      </span>
                      {parseFloat(plan.price) > 0 && <span className="text-gray-600">/mes</span>}
                    </div>
                    
                    <div className="space-y-3 mb-8">
                      {plan.features && plan.features.map((feature, i) => (
                        <div key={i} className="flex items-center text-left">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </div>
                      ))}
                      
                      {plan.max_users && (
                        <div className="flex items-center text-left">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-600">Fins a {plan.max_users} usuaris</span>
                        </div>
                      )}
                      
                      {plan.max_storage_gb && (
                        <div className="flex items-center text-left">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-600">{plan.max_storage_gb}GB d'emmagatzematge</span>
                        </div>
                      )}
                    </div>
                    
                    <a href={hubRegisterUrl} className="w-full">
                      <Button 
                        className={`w-full py-3 rounded-full font-medium transition-all duration-300 ${
                          isPopular 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                        }`}
                      >
                        Començar amb {plan.name}
                      </Button>
                    </a>
                  </div>
                </div>
              )
              })}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="py-20">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12 lg:p-16 text-center animate-in fade-in-2 slide-in-from-bottom-8 duration-1000 delay-500 transform transition-all duration-500 hover:scale-105">
            <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 mb-6 animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-700">
              Comença avui mateix
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-900">
              Uneix-te a centenars de propietaris que ja han revolucionat la gestió dels seus allotjaments turístics
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-1100">
              <Link to="/app">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 text-lg rounded-full h-auto font-medium transform transition-all duration-300 hover:scale-110 hover:shadow-2xl">
                  Començar gratis
                </Button>
              </Link>
              <p className="text-sm text-gray-500 animate-in fade-in-2 duration-1000 delay-1300">Sense targeta de crèdit · Configuració en 2 minuts</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-20 animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-300">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0 group">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center mr-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">Gestiona</span>
            </div>
            <p className="text-gray-500 text-sm transition-colors duration-300 hover:text-gray-700">© 2025 Gestiona. Tots els drets reservats.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

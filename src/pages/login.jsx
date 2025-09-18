import { useState } from "react"
import { IconEye, IconEyeOff, IconLogin } from "@tabler/icons-react"
import { Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context.jsx"
import { useNavigate } from "react-router-dom"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(email, password)
      
      if (success) {
        // Login exitós, navegar al dashboard
        navigate('/app', { replace: true })
      }
      // Si no és exitós, l'error ja es mostra amb toast al context
    } catch (err) {
      // L'error ja es mostra amb toast al context
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-200 to-blue-200 rounded-full blur-3xl opacity-20 animate-pulse delay-300"></div>
      </div>
      
      <div className="relative max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center animate-in fade-in-2 slide-in-from-top-4 duration-1000">
          <div className="flex justify-center mb-6 group">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Benvingut de nou
          </h2>
          <p className="text-lg text-gray-600">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Gestiona
            </span> el teu negoci rural
          </p>
        </div>
        
        {/* Form container */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl animate-in fade-in-2 slide-in-from-bottom-4 duration-1000 delay-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="group">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 transition-colors duration-300 group-focus-within:text-blue-600">
                  Correu electrònic
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="transition-all duration-300 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12"
                  placeholder="exemple@correu.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="group">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 transition-colors duration-300 group-focus-within:text-blue-600">
                  Contrasenya
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="transition-all duration-300 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 pr-12"
                    placeholder="La teva contrasenya"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors duration-300 text-gray-400 hover:text-blue-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <IconEyeOff className="h-5 w-5" />
                    ) : (
                      <IconEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center group">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-300"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700 transition-colors duration-300 group-hover:text-blue-600">
                  Recorda'm
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-300">
                  Has oblidat la contrasenya?
                </a>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Iniciant sessió...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <IconLogin className="mr-2 h-5 w-5" />
                    Iniciar sessió
                  </div>
                )}
              </Button>
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                No tens compte?{" "}
                <a href="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-300">
                  Registra't aquí
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

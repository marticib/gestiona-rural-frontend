import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import ssoService from "@/services/ssoService"
import { hubApi } from "@/services/apiService"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  // Comprovar si hi ha un token guardat i validar-lo quan es carrega l'app
  useEffect(() => {
    const initializeAuth = async () => {
      // Primer, comprovar si hi ha paràmetres SSO a la URL
      const ssoCheck = ssoService.checkSSO()
      
      if (ssoCheck.hasSSO) {
        // Hi ha token SSO, verificar-lo
        console.log('Token SSO detectat:', ssoCheck.token)
        const ssoResult = await ssoService.verifySSO(ssoCheck.token)
        
        if (ssoResult.success) {
          setToken(ssoResult.token)
          setUser(ssoResult.user)
          setIsLoading(false)
          toast.success(`Benvingut/da des del Hub, ${ssoResult.user.name}!`)
          return
        } else {
          console.error('Error verificant token SSO:', ssoResult.message)
          toast.error('Error d\'autenticació SSO')
        }
      }

      // Si no hi ha SSO, comprovar token local guardat
      const savedToken = localStorage.getItem("auth_token")
      const savedUser = localStorage.getItem("user")
      
      if (savedToken && savedUser) {
        try {
          // Verificar si el token és vàlid consultant el Hub API
          const response = await hubApi.get('/auth/user')
          
          if (response.status === 200) {
            // Token vàlid, restaurar l'estat
            setToken(savedToken)
            setUser(response.data.user)
          } else {
            // Token invàlid, netejar localStorage
            localStorage.removeItem("auth_token")
            localStorage.removeItem("user")
            console.log("Token expirat o invàlid, sessió netejada")
          }
        } catch (error) {
          // Error de connexió o parsing, netejar localStorage
          console.error("Error validant token:", error)
          localStorage.removeItem("auth_token")
          localStorage.removeItem("user")
        }
      }
      
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email, password) => {
    // En una aplicació SSO, redirigir al Hub per login
    if (!email || !password) {
      ssoService.redirectToHub()
      return false
    }

    try {
      const response = await hubApi.post('/auth/login', { email, password })

      if (response.status === 200) {
        const data = response.data
        setToken(data.token)
        setUser(data.user)
        localStorage.setItem("auth_token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        toast.success(`Benvingut/da, ${data.user.name}!`)
        return true
      } else {
        toast.error(data.message || "Error d'autenticació")
        throw new Error(data.message || "Error d'autenticació")
      }
    } catch (error) {
      console.error("Error de login:", error)
      toast.error("Error de connexió amb el servidor")
      return false
    }
  }

  const logout = async () => {
    try {
      // Utilitzar el SSO service per logout
      ssoService.logout()
    } catch (error) {
      console.error("Error en logout:", error)
    } finally {
      // Sempre netejar l'estat local
      setUser(null)
      setToken(null)
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")
      toast.info("Sessió tancada correctament")
    }
  }

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

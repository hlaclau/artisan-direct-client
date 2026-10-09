import { useState, useContext, ReactNode } from 'react'
import { AuthContext, AuthContextType, User } from './AuthContext'

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isPending, setIsPending] = useState<boolean>(false)

  const logout = async () => {
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    isPending,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

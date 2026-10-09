import { createContext } from 'react'

export interface User {
  id: string
  email: string
  name: string
  image?: string | null
}

export interface AuthContextType {
  user: User | null
  isPending: boolean
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

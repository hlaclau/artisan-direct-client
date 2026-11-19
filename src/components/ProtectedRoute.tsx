import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isPending } = useAuth()
  const location = useLocation()

  if (isPending) {
    return <div className="p-8 text-center text-stone-600">Chargement...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

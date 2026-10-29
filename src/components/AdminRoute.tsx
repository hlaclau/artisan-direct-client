import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isPending } = useAuth()
  const location = useLocation()

  if (isPending) {
    return <div className="p-8 text-center text-stone-600">Chargement...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // `user.role` est fourni par le back (ADP-126). Tant qu'il n'est pas exposé dans la
  // session, tous les utilisateurs sont redirigés vers l'accueil.
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

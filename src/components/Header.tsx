import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between border-b border-stone-200 bg-white px-6 py-4">
      <Link to="/" className="text-xl font-bold text-stone-900">
        ArtisansDirect
      </Link>
      <nav className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-stone-600">{user.email}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="rounded-lg bg-stone-900 px-3 py-1.5 text-sm text-white hover:bg-stone-700"
          >
            Connexion
          </Link>
        )}
      </nav>
    </header>
  )
}

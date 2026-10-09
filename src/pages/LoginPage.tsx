import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Une erreur est survenue lors de la connexion.')
      return
    }

    login(email)
    navigate(from, { replace: true })
  }

  const handleGoogleLogin = () => {
    login('user.google@example.com')
    navigate(from, { replace: true })
  }

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-stone-50 p-4">
      <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-stone-900">Connexion</h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-stone-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-stone-300 p-2 text-stone-900"
              required
            />
          </div>

          <div>
            <label htmlFor="password font-medium text-stone-700" className="mb-1 block text-sm">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-stone-300 p-2 text-stone-900"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-stone-900 py-2 font-medium text-white hover:bg-stone-800"
          >
            Se connecter
          </button>
        </form>

        <div className="my-4 flex items-center justify-center gap-2">
          <span className="h-px flex-1 bg-stone-200" />
          <span className="text-xs text-stone-400">OU</span>
          <span className="h-px flex-1 bg-stone-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full rounded-lg border border-stone-300 py-2 font-medium text-stone-700 hover:bg-stone-50"
        >
          Continuer avec Google
        </button>

        <p className="mt-6 text-center text-sm text-stone-600">
          Pas encore de compte ?{' '}
          <Link to="/register" className="font-medium text-stone-900 underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}

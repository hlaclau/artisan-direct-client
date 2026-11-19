import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { authClient, useSession } from '../lib/auth-client'

type Role = 'client' | 'artisan'
type Field = 'firstName' | 'lastName' | 'email' | 'password'
type Errors = Partial<Record<Field, string>>

function signupErrorMessage(error: { code?: string; status?: number } | null) {
  if (
    error?.code === 'USER_ALREADY_EXISTS' ||
    error?.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL'
  ) {
    return 'Cette adresse email est déjà utilisée. Veuillez vous connecter.'
  }
  if (error?.status === 0 || (error?.status !== undefined && error.status >= 500)) {
    return "Le service d'inscription est indisponible. Vérifiez votre connexion et réessayez."
  }
  return "L'inscription a échoué. Vérifiez vos informations ou réessayez."
}

export function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('client')
  const [errors, setErrors] = useState<Errors>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [accountCreated, setAccountCreated] = useState(false)
  const [registeredUserId, setRegisteredUserId] = useState<string | null>(null)
  const submitting = useRef(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    refetch,
    data: currentSession,
    error: sessionError,
    isPending: sessionPending,
    isRefetching,
  } = useSession()

  useEffect(() => {
    if (
      registeredUserId &&
      user?.id === registeredUserId &&
      currentSession?.session &&
      currentSession.user?.id === registeredUserId &&
      !sessionError &&
      !sessionPending &&
      !isRefetching
    ) {
      navigate('/dashboard', { replace: true })
    }
  }, [registeredUserId, user, navigate, currentSession, sessionError, sessionPending, isRefetching])

  const displayedError =
    error ||
    (registeredUserId &&
    !sessionPending &&
    !isRefetching &&
    (sessionError || !currentSession?.session || currentSession.user?.id !== registeredUserId)
      ? "Compte créé, mais la session n'a pas pu être confirmée. Veuillez vous connecter."
      : '')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting.current || accountCreated) return
    const nextErrors: Errors = {}
    if (!firstName.trim()) nextErrors.firstName = 'Veuillez saisir votre prénom.'
    if (!lastName.trim()) nextErrors.lastName = 'Veuillez saisir votre nom.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Veuillez saisir une adresse email valide.'
    }
    if (password.length < 8)
      nextErrors.password = 'Le mot de passe doit contenir au moins 8 caractères.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    submitting.current = true
    setLoading(true)
    setError('')
    try {
      // signupRole is a backend hook input, not an additional user field.
      const payload = {
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        password,
        signupRole: role === 'client' ? 'customer' : 'worker',
      }
      const result = await authClient.signUp.email(payload)
      if (result.error || !result.data?.user) {
        setError(signupErrorMessage(result.error))
        return
      }

      setAccountCreated(true)
      const session = await authClient.getSession()
      if (
        session.error ||
        !session.data?.session ||
        session.data.user?.id !== result.data.user.id
      ) {
        setError("Compte créé, mais la session n'a pas pu être confirmée. Veuillez vous connecter.")
        return
      }
      await refetch()
      setRegisteredUserId(result.data.user.id)
    } catch {
      setError(
        'Une erreur est survenue. Vérifiez votre connexion ou essayez de vous connecter si votre compte a été créé.',
      )
    } finally {
      submitting.current = false
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-stone-50 p-4">
      <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-stone-900">Créer un compte</h1>

        {displayedError && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
          >
            {displayedError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div>
            <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-stone-700">
              Prénom
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-lg border border-stone-300 p-2 text-stone-900"
              required
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            />
            {errors.firstName && (
              <p id="firstName-error" role="alert" className="mt-1 text-sm text-red-600">
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-stone-700">
              Nom
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-lg border border-stone-300 p-2 text-stone-900"
              required
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            />
            {errors.lastName && (
              <p id="lastName-error" role="alert" className="mt-1 text-sm text-red-600">
                {errors.lastName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-stone-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-stone-300 p-2 text-stone-900"
              required
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-stone-700">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-stone-300 p-2 text-stone-900"
              required
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : 'password-hint'}
            />
            <p id="password-hint" className="mt-1 text-sm text-stone-600">
              Au moins 8 caractères.
            </p>
            {errors.password && (
              <p id="password-error" role="alert" className="mt-1 text-sm text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-stone-700">
              Je souhaite m'inscrire en tant que :
            </legend>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="client"
                  checked={role === 'client'}
                  onChange={() => setRole('client')}
                />
                Client
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="artisan"
                  checked={role === 'artisan'}
                  onChange={() => setRole('artisan')}
                />
                Artisan
              </label>
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={loading || accountCreated}
            className="w-full rounded-lg bg-stone-900 py-2 font-medium text-white hover:bg-stone-800 disabled:opacity-50"
          >
            {loading ? 'Inscription en cours...' : 'Créer mon compte'}
          </button>
        </form>

        <div className="my-4 flex items-center justify-center gap-2" aria-hidden="true">
          <span className="h-px flex-1 bg-stone-200" />
          <span className="text-xs text-stone-400">OU</span>
          <span className="h-px flex-1 bg-stone-200" />
        </div>
        <button
          type="button"
          disabled
          aria-describedby="google-unavailable"
          className="w-full rounded-lg border border-stone-300 py-2 font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continuer avec Google
        </button>
        <p id="google-unavailable" className="mt-2 text-center text-sm text-stone-600">
          La connexion avec Google n'est pas encore disponible.
        </p>

        <p className="mt-6 text-center text-sm text-stone-600">
          Déjà un compte ?{' '}
          <Link to="/login" className="font-medium text-stone-900 underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}

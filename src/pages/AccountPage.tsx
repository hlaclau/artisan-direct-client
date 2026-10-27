import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

type Feedback = { type: 'success' | 'error'; message: string } | null

export function AccountPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const isGoogleAccount = user?.provider === 'google'

  const updateProfile = () => {}
  const changePassword = () => {}
  const deleteAccount = () => {}

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateProfile()
    setFeedback({
      type: 'success',
      message:
        'Formulaire valide. Les modifications ne seront enregistrées qu’après le branchement du service.',
    })
  }

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (newPassword !== confirmPassword) {
      setFeedback({
        type: 'error',
        message: 'La confirmation ne correspond pas au nouveau mot de passe.',
      })
      return
    }

    changePassword()
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setFeedback({
      type: 'success',
      message:
        'Formulaire valide. Le mot de passe ne sera modifié qu’après le branchement du service.',
    })
  }

  const handleDeleteAccount = async () => {
    deleteAccount()
    await logout()
    navigate('/')
  }

  const inputClassName =
    'mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15'
  const labelClassName = 'block text-sm font-medium text-stone-700'

  return (
    <main className="min-h-[calc(100vh-73px)] bg-stone-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 border-b border-stone-200 pb-6">
          <p className="text-sm font-medium text-emerald-800">Espace personnel</p>
          <h1 className="mt-1 text-3xl font-bold text-stone-900">Mon compte</h1>
          <p className="mt-2 text-stone-600">
            Consultez et gérez les informations de votre compte.
          </p>
        </div>

        {feedback && (
          <p
            role={feedback.type === 'error' ? 'alert' : 'status'}
            className={`mb-6 rounded-md border px-4 py-3 text-sm ${
              feedback.type === 'error'
                ? 'border-red-200 bg-red-50 text-red-800'
                : 'border-emerald-200 bg-emerald-50 text-emerald-900'
            }`}
          >
            {feedback.message}
          </p>
        )}

        <section aria-labelledby="profile-heading" className="border-b border-stone-200 py-7">
          <div className="mb-5">
            <h2 id="profile-heading" className="text-xl font-semibold text-stone-900">
              Informations du compte
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Connecté avec {isGoogleAccount ? 'Google' : 'une adresse email'} · {user?.email}
            </p>
          </div>
          <form onSubmit={handleProfileSubmit} className="grid gap-4 sm:grid-cols-2">
            <label className={labelClassName} htmlFor="firstName">
              Prénom
              <input
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className={inputClassName}
                required
              />
            </label>
            <label className={labelClassName} htmlFor="lastName">
              Nom
              <input
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className={inputClassName}
                required
              />
            </label>
            <label className={`${labelClassName} sm:col-span-2`} htmlFor="accountEmail">
              Adresse email
              <input
                id="accountEmail"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClassName}
                required
              />
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
              >
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </section>

        {!isGoogleAccount && (
          <section aria-labelledby="password-heading" className="border-b border-stone-200 py-7">
            <div className="mb-5">
              <h2 id="password-heading" className="text-xl font-semibold text-stone-900">
                Changer le mot de passe
              </h2>
            </div>
            <form onSubmit={handlePasswordSubmit} className="grid gap-4 sm:grid-cols-2">
              <label className={`${labelClassName} sm:col-span-2`} htmlFor="currentPassword">
                Mot de passe actuel
                <input
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className={inputClassName}
                  required
                />
              </label>
              <label className={labelClassName} htmlFor="newPassword">
                Nouveau mot de passe
                <input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className={inputClassName}
                  required
                />
              </label>
              <label className={labelClassName} htmlFor="confirmPassword">
                Confirmer le nouveau mot de passe
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className={inputClassName}
                  required
                />
              </label>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
                >
                  Mettre à jour le mot de passe
                </button>
              </div>
            </form>
          </section>
        )}

        <section aria-labelledby="delete-heading" className="py-7">
          <h2 id="delete-heading" className="text-xl font-semibold text-stone-900">
            Supprimer le compte
          </h2>
          <p className="mt-1 max-w-xl text-sm text-stone-600">
            Cette action est définitive. Vous serez déconnecté après confirmation.
          </p>
          <button
            type="button"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="mt-4 rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-800 transition hover:bg-red-50"
          >
            Supprimer mon compte
          </button>
        </section>
      </div>

      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-xl"
          >
            <h2 id="delete-dialog-title" className="text-xl font-semibold text-stone-900">
              Confirmer la suppression ?
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Votre compte sera supprimé et vous serez déconnecté.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
              >
                Confirmer la suppression
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

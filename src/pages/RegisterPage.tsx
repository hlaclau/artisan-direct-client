import { Link } from 'react-router-dom'

export function RegisterPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Page d'inscription</h1>
      <Link to="/login" className="mt-4 inline-block text-stone-600 underline">
        Déjà un compte ? Se connecter
      </Link>
    </div>
  )
}

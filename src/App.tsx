import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-stone-50 text-stone-900">
      <h1 className="text-4xl font-bold">ArtisansDirect</h1>
      <button
        type="button"
        className="rounded-lg bg-stone-900 px-4 py-2 text-white hover:bg-stone-700"
        onClick={() => setCount((count) => count + 1)}
      >
        Count is {count}
      </button>
    </main>
  )
}

export default App

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders home page title', () => {
    render(<App />)
    expect(screen.getByText(/Page d'accueil/i)).toBeInTheDocument()
  })
})

import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { App } from './App'

describe('Mahalle Ustası shell', () => {
  beforeEach(() => localStorage.clear())

  it('starts in Turkish and shows Başla for a new player', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Mahalle Ustası' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Başla/ })).toBeInTheDocument()
  })

  it('switches the complete interface to English', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Ayarlar' }))
    fireEvent.click(screen.getByRole('button', { name: /English/ }))
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByRole('heading', { name: 'Neighbourhood Master' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Start/ })).toBeInTheDocument()
  })

  it('changes Başla to Devam Et after starting', () => {
    const { unmount } = render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Başla/ }))
    unmount()
    render(<App />)
    expect(screen.getByRole('button', { name: /Devam Et/ })).toBeInTheDocument()
  })

  it('completes the first level through the touch-first flow', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Başla/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Fırın' }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Boş alan' })[1])
    expect(await screen.findByRole('heading', { name: 'Mahalle canlandı!' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sonraki Bölüm/ })).toBeInTheDocument()
  })
})

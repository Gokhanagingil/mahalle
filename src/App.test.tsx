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
    const map = screen.getByRole('application')
    Object.defineProperty(map, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, right: 100, bottom: 118, width: 100, height: 118, x: 0, y: 0, toJSON: () => ({}) }),
    })
    Object.defineProperty(map.closest('.organic-map')!, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, right: 100, bottom: 118, width: 100, height: 118, x: 0, y: 0, toJSON: () => ({}) }),
    })
    Object.defineProperty(map, 'setPointerCapture', { value: () => undefined })
    Object.defineProperty(map, 'hasPointerCapture', { value: () => true })
    Object.defineProperty(map, 'releasePointerCapture', { value: () => undefined })
    fireEvent.pointerDown(map, { pointerId: 1, clientX: 24, clientY: 28 })
    fireEvent.pointerMove(map, { pointerId: 1, clientX: 49, clientY: 57 })
    fireEvent.pointerUp(map, { pointerId: 1, clientX: 76, clientY: 88 })
    expect(await screen.findByRole('heading', { name: 'Mahalle canlandı!' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sonraki Bölüm/ })).toBeInTheDocument()
  })
})

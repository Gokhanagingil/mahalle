import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { initialMissionState } from '../game/engine'
import { levels } from '../game/levels'
import type { Settings } from '../game/types'
import { GameScreen } from './GameScreen'

const settings: Settings = {
  locale: 'tr',
  largeText: false,
  highContrast: false,
  sound: false,
  haptics: false,
  reducedMotion: true,
}

function renderLevel(levelIndex: number) {
  const level = levels[levelIndex]
  const props = {
    level,
    locale: 'tr' as const,
    settings,
    initialMission: initialMissionState(level),
    onSave: vi.fn(),
    onComplete: vi.fn(),
    onNext: vi.fn(),
    onHome: vi.fn(),
  }
  render(<GameScreen {...props} />)
  const map = screen.getByRole('application')
  Object.defineProperty(map.closest('.organic-map')!, 'getBoundingClientRect', {
    value: () => ({ left: 0, top: 0, right: 100, bottom: 118, width: 100, height: 118, x: 0, y: 0, toJSON: () => ({}) }),
  })
  return { map, props }
}

describe('multi-tool mission interface', () => {
  it('completes the bus-stop mission by selecting and placing an object', async () => {
    const { map, props } = renderLevel(1)
    expect(screen.getByLabelText('YERLEŞTİRİLECEKLER')).toBeInTheDocument()
    expect(screen.getByText('UYGUN YER')).toBeInTheDocument()
    expect(screen.getByText('Önce bir öğeye dokun')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Otobüs durağı/ }))
    expect(screen.getByText(/Otobüs durağı seçildi/)).toBeInTheDocument()
    fireEvent.click(map, { clientX: 50, clientY: 35 })

    expect(await screen.findByRole('heading', { name: 'Mahalle canlandı!' })).toBeInTheDocument()
    expect(props.onComplete).toHaveBeenCalledOnce()
    expect(screen.getByText('3/3')).toBeInTheDocument()
  })

  it('offers distinct placement and road tools in the mixed mission', () => {
    renderLevel(4)
    const move = screen.getByRole('button', { name: /Yerleştir/ })
    const road = screen.getByRole('button', { name: /Yol çiz/ })

    expect(move).toHaveClass('active')
    fireEvent.click(road)
    expect(road).toHaveClass('active')
    expect(move).not.toHaveClass('active')
  })
})

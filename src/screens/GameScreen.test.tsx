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
    totalLevels: levels.length,
    onSave: vi.fn(),
    onComplete: vi.fn(),
    onNext: vi.fn(),
    onHome: vi.fn(),
  }
  render(<GameScreen {...props} />)
  const map = screen.getByRole('application')
  Object.defineProperties(map, {
    setPointerCapture: { value: vi.fn() },
    releasePointerCapture: { value: vi.fn() },
    hasPointerCapture: { value: () => true },
  })
  Object.defineProperty(map.closest('.organic-map')!, 'getBoundingClientRect', {
    value: () => ({ left: 0, top: 0, right: 100, bottom: 118, width: 100, height: 118, x: 0, y: 0, toJSON: () => ({}) }),
  })
  return { map, props }
}

describe('multi-tool mission interface', () => {
  it('shows the road gesture before asking the player to copy it', async () => {
    const { map, props } = renderLevel(0)

    expect(screen.getByText('ÖNCE HAREKETİ İZLE')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Şimdi dene/ }))
    expect(screen.getByText('ŞİMDİ SEN YAP')).toBeInTheDocument()
    expect(screen.getByText('BURADAN BAŞLA')).toBeInTheDocument()
    expect(screen.getByText('BURADA BIRAK')).toBeInTheDocument()
    expect(screen.queryByText('Bugünün işi')).not.toBeInTheDocument()

    fireEvent.pointerDown(map, { pointerId: 1, clientX: 23, clientY: 27 })
    fireEvent.pointerMove(map, { pointerId: 1, clientX: 50, clientY: 58 })
    fireEvent.pointerUp(map, { pointerId: 1, clientX: 77, clientY: 91 })

    expect(props.onSave).toHaveBeenCalledOnce()
    expect(await screen.findByRole('heading', { name: 'Mahalle canlandı!' })).toBeInTheDocument()
  })

  it('completes the bus-stop lesson with one direct drag', async () => {
    const { props } = renderLevel(1)
    expect(screen.getByLabelText('YERLEŞTİRİLECEKLER')).toBeInTheDocument()
    expect(screen.getByText('BURAYA SÜRÜKLE')).toBeInTheDocument()
    expect(screen.getByText('Durağı basılı tut ve evlerin ortasına sürükle.')).toBeInTheDocument()
    expect(screen.queryByText('Önce bir öğeye dokun')).not.toBeInTheDocument()

    const stop = screen.getByRole('button', { name: /Otobüs durağı/ })
    Object.defineProperties(stop, {
      setPointerCapture: { value: vi.fn() },
      releasePointerCapture: { value: vi.fn() },
      hasPointerCapture: { value: () => true },
    })
    fireEvent.pointerDown(stop, { pointerId: 2 })
    fireEvent.pointerMove(stop, { pointerId: 2, clientX: 50, clientY: 35 })
    fireEvent.pointerUp(stop, { pointerId: 2, clientX: 50, clientY: 35 })

    expect(await screen.findByRole('heading', { name: 'Mahalle canlandı!' })).toBeInTheDocument()
    expect(props.onComplete).toHaveBeenCalledOnce()
    expect(screen.getByText('3/3')).toBeInTheDocument()
  })

  it('turns a tap on the first item into a concrete drag reminder', () => {
    renderLevel(1)
    fireEvent.click(screen.getByRole('button', { name: /Otobüs durağı/ }))

    expect(screen.getByText('Durağın üstünde basılı tut ve parmağını haritaya doğru sürükle.')).toBeInTheDocument()
    expect(screen.queryByText(/seçildi/)).not.toBeInTheDocument()
  })

  it('does not reveal exact answer targets after the hands-on lesson', () => {
    const { map } = renderLevel(2)

    expect(map.closest('.organic-map')?.querySelector('.placement-guide')).toBeNull()
    expect(screen.queryByText('BURAYA SÜRÜKLE')).not.toBeInTheDocument()
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

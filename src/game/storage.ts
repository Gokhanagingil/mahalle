import type { SavedGame, Settings } from './types'

const STORAGE_KEY = 'mahalle-ustasi-save-v1'

export const defaultSettings: Settings = {
  locale: 'tr',
  sound: true,
  haptics: true,
  highContrast: false,
  largeText: false,
  reducedMotion: false,
}

export const defaultGame: SavedGame = {
  hasStarted: false,
  currentLevel: 0,
  completedLevels: [],
  placements: {},
  settings: defaultSettings,
}

export function loadGame(): SavedGame {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultGame
    const parsed = JSON.parse(stored) as Partial<SavedGame>
    return {
      ...defaultGame,
      ...parsed,
      settings: { ...defaultSettings, ...parsed.settings },
      completedLevels: parsed.completedLevels ?? [],
      placements: parsed.placements ?? {},
    }
  } catch {
    return defaultGame
  }
}

export function saveGame(game: SavedGame) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(game))
}

export function resetGame() {
  localStorage.removeItem(STORAGE_KEY)
}

import type { SavedGame, Settings } from './types'

const STORAGE_KEY = 'mahalle-ustasi-save-v3'
const LEGACY_KEYS = ['mahalle-ustasi-save-v2', 'mahalle-ustasi-save-v1']

export const defaultSettings: Settings = {
  locale: 'tr', sound: true, haptics: true, highContrast: false, largeText: false, reducedMotion: false,
}

export const defaultGame: SavedGame = {
  hasStarted: false, currentLevel: 0, completedLevels: [], missions: {}, settings: defaultSettings,
}

export function loadGame(): SavedGame {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<SavedGame>
      return {
        ...defaultGame, ...parsed,
        settings: { ...defaultSettings, ...parsed.settings },
        completedLevels: parsed.completedLevels ?? [], missions: parsed.missions ?? {},
      }
    }
    for (const key of LEGACY_KEYS) {
      const legacy = localStorage.getItem(key)
      if (legacy) {
        const parsed = JSON.parse(legacy) as { settings?: Partial<Settings> }
        return { ...defaultGame, settings: { ...defaultSettings, ...parsed.settings } }
      }
    }
    return defaultGame
  } catch {
    return defaultGame
  }
}

export function saveGame(game: SavedGame) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(game))
}

export function resetGame() {
  localStorage.removeItem(STORAGE_KEY)
  LEGACY_KEYS.forEach((key) => localStorage.removeItem(key))
}

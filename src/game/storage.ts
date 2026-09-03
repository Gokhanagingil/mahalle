import type { SavedGame, Settings } from './types'

const STORAGE_KEY = 'mahalle-ustasi-save-v2'
const LEGACY_KEY = 'mahalle-ustasi-save-v1'

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
  roadNetworks: {},
  settings: defaultSettings,
}

export function loadGame(): SavedGame {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<SavedGame>
      return {
        ...defaultGame,
        ...parsed,
        settings: { ...defaultSettings, ...parsed.settings },
        completedLevels: parsed.completedLevels ?? [],
        roadNetworks: parsed.roadNetworks ?? {},
      }
    }
    const legacy = localStorage.getItem(LEGACY_KEY)
    if (!legacy) return defaultGame
    const parsedLegacy = JSON.parse(legacy) as { settings?: Partial<Settings> }
    return { ...defaultGame, settings: { ...defaultSettings, ...parsedLegacy.settings } }
  } catch {
    return defaultGame
  }
}

export function saveGame(game: SavedGame) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(game))
}

export function resetGame() {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(LEGACY_KEY)
}

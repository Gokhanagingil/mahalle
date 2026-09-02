export type Locale = 'tr' | 'en'

export type BuildingType =
  | 'home'
  | 'bakery'
  | 'park'
  | 'road'
  | 'pharmacy'
  | 'clinic'
  | 'busStop'
  | 'square'

export type Position = { row: number; col: number }

export type BoardItem = {
  id: string
  type: BuildingType
  position?: Position
  fixed?: boolean
}

export type Rule =
  | {
      id: string
      kind: 'adjacent'
      subject: BuildingType
      target: BuildingType
    }
  | {
      id: string
      kind: 'notAdjacent'
      subject: BuildingType
      target: BuildingType
    }
  | {
      id: string
      kind: 'coverage'
      subject: BuildingType
      target: BuildingType
      count: number
    }

export type LocalizedText = { tr: string; en: string }

export type Level = {
  id: number
  name: LocalizedText
  intro: LocalizedText
  size: number
  items: BoardItem[]
  rules: Rule[]
  tutorial?: 'firstPlacement' | 'distance'
}

export type RuleResult = {
  ruleId: string
  satisfied: boolean
}

export type Settings = {
  locale: Locale
  sound: boolean
  haptics: boolean
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
}

export type SavedGame = {
  hasStarted: boolean
  currentLevel: number
  completedLevels: number[]
  placements: Record<number, BoardItem[]>
  settings: Settings
}

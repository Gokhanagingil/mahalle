export type Locale = 'tr' | 'en'

export type Point = { x: number; y: number }

export type LandmarkType = 'home' | 'bakery' | 'clinic' | 'busStop' | 'entrance' | 'park'
export type ObstacleType = 'tree' | 'pond' | 'garden'

export type LocalizedText = { tr: string; en: string }

export type Landmark = {
  id: string
  type: LandmarkType
  position: Point
  label: LocalizedText
}

export type Obstacle = {
  id: string
  type: ObstacleType
  position: Point
  radius: number
  label: LocalizedText
}

export type RoadStroke = {
  id: string
  points: Point[]
}

export type ConnectionGoal =
  | { kind: 'connectAll'; landmarkIds: string[] }
  | { kind: 'coverage'; sourceId: string; targetIds: string[]; count: number }

export type RoadLevel = {
  id: number
  name: LocalizedText
  intro: LocalizedText
  objective: LocalizedText
  landmarks: Landmark[]
  obstacles: Obstacle[]
  goal: ConnectionGoal
  roadBudget?: number
  efficientLength: number
  tutorialPath?: Point[]
}

export type RoadEvaluation = {
  complete: boolean
  networkComplete: boolean
  withinBudget: boolean
  connectedLandmarkIds: string[]
  connectedCount: number
  requiredCount: number
  totalLength: number
  efficient: boolean
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
  roadNetworks: Record<number, RoadStroke[]>
  settings: Settings
}

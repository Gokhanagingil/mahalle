export type Locale = 'tr' | 'en'
export type Point = { x: number; y: number }
export type LocalizedText = { tr: string; en: string }

export type LandmarkType = 'home' | 'bakery' | 'clinic' | 'busStop' | 'entrance' | 'park' | 'pharmacy' | 'square'
export type PlaceableType = 'busStop' | 'clinic' | 'bench' | 'lamp' | 'flowerBed' | 'marketStall' | 'pharmacy' | 'square' | 'park'
export type MapObjectType = LandmarkType | PlaceableType | 'road'
export type ObstacleType = 'tree' | 'pond' | 'garden'
export type ToolKind = 'road' | 'move'

export type Landmark = {
  id: string
  type: LandmarkType
  position: Point
  label: LocalizedText
}

export type Placeable = {
  id: string
  type: PlaceableType
  position: Point
  label: LocalizedText
  guide?: {
    position: Point
    radius: number
    reason: LocalizedText
  }
}

export type Obstacle = {
  id: string
  type: ObstacleType
  position: Point
  radius: number
  label: LocalizedText
}

export type RoadStroke = { id: string; points: Point[] }

type RequirementBase = { id: string; text: LocalizedText }
export type Requirement =
  | RequirementBase & { kind: 'connect'; anchorIds: string[] }
  | RequirementBase & { kind: 'coverage'; itemId: string; targetIds: string[]; radius: number; count: number }
  | RequirementBase & { kind: 'nearObstacle'; itemId: string; obstacleId: string; min?: number; max?: number }
  | RequirementBase & { kind: 'nearItem'; itemId: string; targetItemId: string; max: number }
  | RequirementBase & { kind: 'nearLandmark'; itemIds: string[]; landmarkId: string; min?: number; max?: number }
  | RequirementBase & { kind: 'separated'; itemIds: string[]; min: number }
  | RequirementBase & { kind: 'nearRoad'; itemIds: string[]; max: number }
  | RequirementBase & { kind: 'awayFromLandmark'; itemIds: string[]; landmarkId: string; min: number }
  | RequirementBase & { kind: 'moved'; itemIds: string[] }

export type MissionLevel = {
  id: number
  name: LocalizedText
  intro: LocalizedText
  objective: LocalizedText
  tools: ToolKind[]
  landmarks: Landmark[]
  placeables: Placeable[]
  obstacles: Obstacle[]
  baseRoads?: RoadStroke[]
  requirements: Requirement[]
  roadBudget?: number
  efficientLength?: number
  tutorialPath?: Point[]
  serviceRadius?: { itemId: string; radius: number }
}

export type Chapter = {
  id: number
  startLevel: number
  endLevel: number
  name: LocalizedText
}

export type RequirementResult = { id: string; satisfied: boolean; progress?: number; target?: number }
export type MissionEvaluation = {
  complete: boolean
  requirements: RequirementResult[]
  connectedAnchorIds: string[]
  totalLength: number
  withinBudget: boolean
  efficient: boolean
}

export type MissionState = {
  roads: RoadStroke[]
  positions: Record<string, Point>
  movedItemIds: string[]
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
  missions: Record<number, MissionState>
  settings: Settings
}

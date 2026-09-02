import type { BoardItem, BuildingType, Level, Position, Rule, RuleResult } from './types'

export const areAdjacent = (a: Position, b: Position) =>
  Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1

const positioned = (items: BoardItem[], type: BuildingType) =>
  items.filter((item): item is BoardItem & { position: Position } => item.type === type && !!item.position)

export function evaluateRule(rule: Rule, items: BoardItem[]): boolean {
  const subjects = positioned(items, rule.subject)
  const targets = positioned(items, rule.target)

  if (subjects.length === 0) return false

  if (rule.kind === 'adjacent') {
    return subjects.every((subject) => targets.some((target) => areAdjacent(subject.position, target.position)))
  }

  if (rule.kind === 'notAdjacent') {
    return subjects.every((subject) => targets.every((target) => !areAdjacent(subject.position, target.position)))
  }

  return subjects.every(
    (subject) => targets.filter((target) => areAdjacent(subject.position, target.position)).length >= rule.count,
  )
}

export function evaluateLevel(level: Level, items: BoardItem[]): RuleResult[] {
  return level.rules.map((rule) => ({ ruleId: rule.id, satisfied: evaluateRule(rule, items) }))
}

export function isLevelComplete(level: Level, items: BoardItem[]): boolean {
  const allMovablePlaced = items.filter((item) => !item.fixed).every((item) => !!item.position)
  return allMovablePlaced && evaluateLevel(level, items).every((result) => result.satisfied)
}

export function cellKey(position: Position): string {
  return `${position.row}-${position.col}`
}

export function itemAt(items: BoardItem[], position: Position) {
  return items.find((item) => item.position && cellKey(item.position) === cellKey(position))
}

export function placeItem(items: BoardItem[], itemId: string, target: Position): BoardItem[] {
  const occupied = itemAt(items, target)
  if (occupied?.fixed) return items

  return items.map((item) => {
    if (item.id === itemId) return { ...item, position: target }
    if (occupied && item.id === occupied.id) return { ...item, position: undefined }
    return item
  })
}

export function removeItem(items: BoardItem[], itemId: string): BoardItem[] {
  return items.map((item) => (item.id === itemId && !item.fixed ? { ...item, position: undefined } : item))
}

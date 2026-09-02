import { describe, expect, it } from 'vitest'
import { levels } from './levels'
import { areAdjacent, isLevelComplete, placeItem } from './engine'
import type { BoardItem, Level, Position } from './types'

function permutations<T>(values: T[], length: number): T[][] {
  if (length === 0) return [[]]
  return values.flatMap((value, index) =>
    permutations(values.filter((_, candidateIndex) => candidateIndex !== index), length - 1)
      .map((rest) => [value, ...rest]),
  )
}

function solutionsFor(level: Level) {
  const occupied = new Set(level.items.filter((item) => item.position).map((item) => `${item.position!.row}-${item.position!.col}`))
  const emptyCells: Position[] = []
  for (let row = 0; row < level.size; row += 1) {
    for (let col = 0; col < level.size; col += 1) {
      if (!occupied.has(`${row}-${col}`)) emptyCells.push({ row, col })
    }
  }
  const movable = level.items.filter((item) => !item.fixed)
  return permutations(emptyCells, movable.length).filter((positions) => {
    const placed = movable.reduce<BoardItem[]>(
      (items, item, index) => placeItem(items, item.id, positions[index]),
      level.items,
    )
    return isLevelComplete(level, placed)
  })
}

describe('neighbourhood rule engine', () => {
  it('uses edge adjacency, not diagonal adjacency', () => {
    expect(areAdjacent({ row: 0, col: 0 }, { row: 0, col: 1 })).toBe(true)
    expect(areAdjacent({ row: 0, col: 0 }, { row: 1, col: 1 })).toBe(false)
  })

  it.each(levels)('level $id has several valid player-created solutions', (level) => {
    expect(solutionsFor(level).length).toBeGreaterThanOrEqual(2)
  })

  it('never moves a fixed building', () => {
    const level = levels[0]
    const fixedHome = level.items[0]
    const result = placeItem(level.items, 'bakery-1', fixedHome.position!)
    expect(result).toBe(level.items)
  })
})

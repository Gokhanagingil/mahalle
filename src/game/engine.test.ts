import { describe, expect, it } from 'vitest'
import { levels } from './levels'
import {
  connectedLandmarks,
  distance,
  evaluateRoadLevel,
  magnetizePath,
  pathHitsObstacle,
  pointToSegmentDistance,
  roadLength,
  simplifyPath,
  smoothPath,
} from './engine'
import type { RoadLevel, RoadStroke } from './types'

const road = (id: string, points: Array<[number, number]>): RoadStroke => ({
  id,
  points: points.map(([x, y]) => ({ x, y })),
})

describe('organic road engine', () => {
  it('measures ordinary and segment distance correctly', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5)
    expect(pointToSegmentDistance({ x: 5, y: 4 }, { x: 0, y: 0 }, { x: 10, y: 0 })).toBe(4)
  })

  it('removes hand jitter without changing the endpoints', () => {
    const points = Array.from({ length: 20 }, (_, index) => ({ x: index, y: index % 2 ? .12 : -.12 }))
    const simplified = simplifyPath(points, .4)
    expect(simplified).toEqual([points[0], points.at(-1)])
  })

  it('creates a smooth SVG route from a player stroke', () => {
    expect(smoothPath([{ x: 1, y: 2 }, { x: 5, y: 8 }, { x: 9, y: 3 }])).toContain('Q 5 8')
  })

  it('magnetically snaps both ends to nearby landmarks', () => {
    const level = levels[0]
    const result = magnetizePath([{ x: 22, y: 29 }, { x: 48, y: 55 }, { x: 79, y: 86 }], level.landmarks, [])
    expect(result[0]).toEqual(level.landmarks[0].position)
    expect(result.at(-1)).toEqual(level.landmarks[1].position)
  })

  it('magnetically snaps a branch to an existing road', () => {
    const base = road('base', [[10, 50], [90, 50]])
    const result = magnetizePath([{ x: 48, y: 54 }, { x: 50, y: 20 }], [], [base])
    expect(result[0]).toEqual({ x: 48, y: 50 })
  })

  it('rejects routes that cut through protected landscape', () => {
    const level = levels[2]
    expect(pathHitsObstacle([{ x: 20, y: 47 }, { x: 80, y: 47 }], level)).toBe(true)
    expect(pathHitsObstacle([{ x: 10, y: 15 }, { x: 90, y: 15 }], level)).toBe(false)
  })

  it('completes the first level with a freehand road', () => {
    const level = levels[0]
    const result = evaluateRoadLevel(level, [road('fresh-bread', [[24, 28], [48, 52], [76, 88]])])
    expect(result.complete).toBe(true)
    expect(result.connectedCount).toBe(1)
    expect(result.requiredCount).toBe(1)
    expect(result.efficient).toBe(true)
  })

  it('turns crossing strokes into a working intersection', () => {
    const level: RoadLevel = {
      id: 99,
      name: { tr: 'Test', en: 'Test' }, intro: { tr: 'Test', en: 'Test' }, objective: { tr: 'Test', en: 'Test' },
      landmarks: [
        { id: 'west', type: 'home', position: { x: 5, y: 50 }, label: { tr: 'Batı', en: 'West' } },
        { id: 'east', type: 'home', position: { x: 95, y: 50 }, label: { tr: 'Doğu', en: 'East' } },
        { id: 'north', type: 'clinic', position: { x: 50, y: 5 }, label: { tr: 'Kuzey', en: 'North' } },
      ],
      obstacles: [], goal: { kind: 'connectAll', landmarkIds: ['west', 'east', 'north'] }, efficientLength: 200,
    }
    const roads = [road('horizontal', [[5, 50], [95, 50]]), road('vertical', [[50, 5], [50, 95]])]
    expect(connectedLandmarks(level, roads, 'west')).toEqual(['west', 'east', 'north'])
    expect(evaluateRoadLevel(level, roads).complete).toBe(true)
  })

  it('counts only homes reached from the bus stop in coverage goals', () => {
    const level = levels[3]
    const roads = [
      road('one', [[51, 107], [15, 22]]),
      road('two', [[51, 107], [51, 18]]),
    ]
    const result = evaluateRoadLevel(level, roads)
    expect(result.connectedCount).toBe(2)
    expect(result.requiredCount).toBe(3)
    expect(result.complete).toBe(false)
  })

  it('uses total road length to recognise an efficient plan', () => {
    expect(roadLength(road('right-angle', [[0, 0], [3, 0], [3, 4]]))).toBe(7)
  })

  it('asks for a shorter plan when the network exceeds its road allowance', () => {
    const level = levels[1]
    const separateLongRoads = [
      road('first', [[12, 106], [37, 26]]),
      road('second', [[12, 106], [83, 52]]),
    ]
    const result = evaluateRoadLevel(level, separateLongRoads)
    expect(result.networkComplete).toBe(true)
    expect(result.withinBudget).toBe(false)
    expect(result.complete).toBe(false)
  })

  it('keeps every published level solvable around its protected areas and within budget', () => {
    const plans: RoadStroke[][] = [
      [road('l1', [[24, 28], [76, 88]])],
      [road('l2-a', [[12, 106], [37, 26]]), road('l2-b', [[37, 26], [83, 52]])],
      [road('l3-a', [[79, 22], [17, 29]]), road('l3-b', [[17, 29], [25, 103]])],
      [road('l4-a', [[51, 107], [51, 18]]), road('l4-b', [[51, 18], [15, 22]]), road('l4-c', [[51, 18], [85, 42]])],
      [
        road('l5-a', [[9, 108], [25, 74]]),
        road('l5-b', [[25, 74], [21, 24]]),
        road('l5-c', [[21, 24], [80, 22]]),
        road('l5-d', [[80, 22], [81, 93]]),
      ],
    ]
    levels.forEach((level, index) => {
      expect(plans[index].every((candidate) => !pathHitsObstacle(candidate.points, level))).toBe(true)
      expect(evaluateRoadLevel(level, plans[index]).complete).toBe(true)
    })
  })
})

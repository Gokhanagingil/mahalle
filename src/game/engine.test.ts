import { describe, expect, it } from 'vitest'
import { levels } from './levels'
import {
  distance,
  evaluateMission,
  findSnapTarget,
  initialMissionState,
  magnetizePath,
  pathHitsObstacle,
  pointToSegmentDistance,
  positionHitsObstacle,
  roadJunctions,
  roadLength,
  simplifyPath,
  smoothPath,
} from './engine'
import type { MissionState, RoadStroke } from './types'

const road = (id: string, points: Array<[number, number]>): RoadStroke => ({ id, points: points.map(([x, y]) => ({ x, y })) })
const movedState = (levelIndex: number, positions: MissionState['positions'], roads: RoadStroke[] = []): MissionState => ({
  ...initialMissionState(levels[levelIndex]), positions, roads, movedItemIds: Object.keys(positions),
})

describe('multi-tool neighbourhood engine', () => {
  it('measures ordinary and segment distance correctly', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5)
    expect(pointToSegmentDistance({ x: 5, y: 4 }, { x: 0, y: 0 }, { x: 10, y: 0 })).toBe(4)
  })

  it('removes hand jitter without changing endpoints', () => {
    const points = Array.from({ length: 20 }, (_, index) => ({ x: index, y: index % 2 ? .12 : -.12 }))
    expect(simplifyPath(points, .4)).toEqual([points[0], points.at(-1)])
  })

  it('creates a smooth SVG route', () => {
    expect(smoothPath([{ x: 1, y: 2 }, { x: 5, y: 8 }, { x: 9, y: 3 }])).toContain('Q 5 8')
  })

  it('uses a generous magnetic field around places', () => {
    const anchors = levels[0].landmarks
    const target = findSnapTarget({ x: 35, y: 31 }, anchors, [])
    expect(target?.id).toBe('bakery')
    const result = magnetizePath([{ x: 35, y: 31 }, { x: 51, y: 60 }, { x: 68, y: 83 }], anchors, [])
    expect(result[0]).toEqual(anchors[0].position)
    expect(result.at(-1)).toEqual(anchors[1].position)
  })

  it('pulls a new branch onto an existing street', () => {
    const base = road('base', [[10, 50], [90, 50]])
    const target = findSnapTarget({ x: 47, y: 58 }, [], [base])
    expect(target).toMatchObject({ kind: 'road', id: 'base', point: { x: 47, y: 50 } })
  })

  it('turns crossing and T-shaped streets into visible junctions', () => {
    const cross = roadJunctions([road('horizontal', [[5, 50], [95, 50]]), road('vertical', [[50, 5], [50, 95]])])
    const tee = roadJunctions([road('main', [[5, 50], [95, 50]]), road('branch', [[30, 20], [30, 50]])])
    expect(cross[0]).toEqual({ x: 50, y: 50 })
    expect(tee[0]).toEqual({ x: 30, y: 50 })
  })

  it('protects natural areas from roads and objects', () => {
    expect(pathHitsObstacle([{ x: 20, y: 67 }, { x: 80, y: 67 }], levels[1])).toBe(true)
    expect(positionHitsObstacle({ x: 49, y: 67 }, levels[1])).toBe(true)
    expect(positionHitsObstacle({ x: 50, y: 35 }, levels[1])).toBe(false)
  })

  it('completes the road-drawing tutorial', () => {
    const state = { ...initialMissionState(levels[0]), roads: [road('street', [[23, 27], [77, 91]])] }
    expect(evaluateMission(levels[0], state).complete).toBe(true)
  })

  it('evaluates the bus-stop coverage puzzle', () => {
    const state = movedState(1, { stop: { x: 50, y: 35 } })
    const result = evaluateMission(levels[1], state)
    expect(result.requirements.every((item) => item.satisfied)).toBe(true)
    expect(result.complete).toBe(true)
  })

  it('evaluates the park arrangement puzzle', () => {
    const state = movedState(2, { bench: { x: 26, y: 48 }, lamp: { x: 27, y: 66 }, flowers: { x: 40, y: 68 } })
    expect(evaluateMission(levels[2], state).complete).toBe(true)
  })

  it('evaluates the market layout puzzle', () => {
    const state = movedState(3, { 'stall-a': { x: 18, y: 64 }, 'stall-b': { x: 47, y: 65 }, 'stall-c': { x: 72, y: 62 } })
    expect(evaluateMission(levels[3], state).complete).toBe(true)
  })

  it('evaluates the mixed placement and road mission', () => {
    const state = movedState(4, { clinic: { x: 50, y: 25 } }, [
      road('south', [[10, 108], [83, 96]]), road('north', [[83, 96], [50, 25]]),
    ])
    const result = evaluateMission(levels[4], state)
    expect(result.withinBudget).toBe(true)
    expect(result.complete).toBe(true)
    expect(result.efficient).toBe(true)
  })

  it('recognises road allowance and exact polyline length', () => {
    expect(roadLength(road('right-angle', [[0, 0], [3, 0], [3, 4]]))).toBe(7)
    const state = movedState(4, { clinic: { x: 50, y: 25 } }, [road('too-long', [[10, 108], [97, 4], [83, 96], [50, 25]])])
    expect(evaluateMission(levels[4], state).withinBudget).toBe(false)
  })
})

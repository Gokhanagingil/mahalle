import type { MissionEvaluation, MissionLevel, MissionState, Point, RoadStroke } from './types'

export type Anchor = { id: string; position: Point }
export type SnapTarget = { id: string; kind: 'anchor' | 'road'; point: Point; distance: number }

export const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y)

export function pointToSegmentDistance(point: Point, start: Point, end: Point): number {
  const dx = end.x - start.x
  const dy = end.y - start.y
  if (dx === 0 && dy === 0) return distance(point, start)
  const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy)))
  return distance(point, { x: start.x + t * dx, y: start.y + t * dy })
}

function closestPointOnSegment(point: Point, start: Point, end: Point): Point {
  const dx = end.x - start.x
  const dy = end.y - start.y
  const denominator = dx * dx + dy * dy || 1
  const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / denominator))
  return { x: start.x + t * dx, y: start.y + t * dy }
}

export function pointToRoadDistance(point: Point, road: RoadStroke): number {
  if (road.points.length === 1) return distance(point, road.points[0])
  return Math.min(...road.points.slice(1).map((end, index) => pointToSegmentDistance(point, road.points[index], end)))
}

export function simplifyPath(points: Point[], tolerance = 0.85): Point[] {
  if (points.length <= 2) return points
  let greatest = 0
  let splitAt = 0
  for (let index = 1; index < points.length - 1; index += 1) {
    const deviation = pointToSegmentDistance(points[index], points[0], points.at(-1)!)
    if (deviation > greatest) {
      greatest = deviation
      splitAt = index
    }
  }
  if (greatest <= tolerance) return [points[0], points.at(-1)!]
  const left = simplifyPath(points.slice(0, splitAt + 1), tolerance)
  const right = simplifyPath(points.slice(splitAt), tolerance)
  return [...left.slice(0, -1), ...right]
}

export function smoothPath(points: Point[]): string {
  if (!points.length) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`
  if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`
  let path = `M ${points[0].x} ${points[0].y}`
  for (let index = 1; index < points.length - 1; index += 1) {
    const midpoint = { x: (points[index].x + points[index + 1].x) / 2, y: (points[index].y + points[index + 1].y) / 2 }
    path += ` Q ${points[index].x} ${points[index].y} ${midpoint.x} ${midpoint.y}`
  }
  const last = points.at(-1)!
  return `${path} L ${last.x} ${last.y}`
}

export function roadLength(road: RoadStroke): number {
  return road.points.slice(1).reduce((total, point, index) => total + distance(road.points[index], point), 0)
}

export function findSnapTarget(point: Point, anchors: Anchor[], roads: RoadStroke[]): SnapTarget | null {
  const anchor = anchors
    .map((item) => ({ id: item.id, kind: 'anchor' as const, point: item.position, distance: distance(point, item.position) }))
    .filter((candidate) => candidate.distance <= 17)
    .sort((a, b) => a.distance - b.distance)[0]
  if (anchor) return anchor

  let roadTarget: SnapTarget | null = null
  roads.forEach((road) => road.points.slice(1).forEach((end, index) => {
    const candidate = closestPointOnSegment(point, road.points[index], end)
    const gap = distance(point, candidate)
    if (gap <= 10 && (!roadTarget || gap < roadTarget.distance)) {
      roadTarget = { id: road.id, kind: 'road', point: candidate, distance: gap }
    }
  }))
  return roadTarget
}

export function magnetizePath(points: Point[], anchors: Anchor[], roads: RoadStroke[]): Point[] {
  const simple = simplifyPath(points)
  if (simple.length < 2) return simple
  const startTarget = findSnapTarget(simple[0], anchors, roads)
  const endTarget = findSnapTarget(simple.at(-1)!, anchors, roads)
  const result = simple.map((point) => ({ ...point }))
  if (startTarget) result[0] = { ...startTarget.point }
  if (endTarget) {
    const rawEnd = result.at(-1)!
    if (distance(rawEnd, endTarget.point) > 2.2 && result.length > 2) {
      const before = result[result.length - 2]
      result[result.length - 2] = {
        x: before.x * .72 + endTarget.point.x * .28,
        y: before.y * .72 + endTarget.point.y * .28,
      }
    }
    result[result.length - 1] = { ...endTarget.point }
  }
  return result
}

export function pathHitsObstacle(points: Point[], level: MissionLevel): boolean {
  return level.obstacles.some((obstacle) => points.slice(1).some((end, index) => (
    pointToSegmentDistance(obstacle.position, points[index], end) < obstacle.radius + 2.8
  )))
}

export function positionHitsObstacle(point: Point, level: MissionLevel, clearance = 7): boolean {
  return level.obstacles.some((obstacle) => distance(point, obstacle.position) < obstacle.radius + clearance)
}

function orientation(a: Point, b: Point, c: Point) {
  return (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y)
}

function segmentsCross(a: Point, b: Point, c: Point, d: Point) {
  const o1 = orientation(a, b, c)
  const o2 = orientation(a, b, d)
  const o3 = orientation(c, d, a)
  const o4 = orientation(c, d, b)
  return ((o1 > 0 && o2 < 0) || (o1 < 0 && o2 > 0)) && ((o3 > 0 && o4 < 0) || (o3 < 0 && o4 > 0))
}

function segmentGap(a: Point, b: Point, c: Point, d: Point) {
  if (segmentsCross(a, b, c, d)) return 0
  return Math.min(
    pointToSegmentDistance(a, c, d), pointToSegmentDistance(b, c, d),
    pointToSegmentDistance(c, a, b), pointToSegmentDistance(d, a, b),
  )
}

function roadsTouch(a: RoadStroke, b: RoadStroke, threshold = 3.8): boolean {
  return a.points.slice(1).some((aEnd, aIndex) => (
    b.points.slice(1).some((bEnd, bIndex) => segmentGap(a.points[aIndex], aEnd, b.points[bIndex], bEnd) <= threshold)
  ))
}

function lineIntersection(a: Point, b: Point, c: Point, d: Point): Point | null {
  const denominator = (a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x)
  if (Math.abs(denominator) < .001 || !segmentsCross(a, b, c, d)) return null
  const determinantA = a.x * b.y - a.y * b.x
  const determinantB = c.x * d.y - c.y * d.x
  return {
    x: (determinantA * (c.x - d.x) - (a.x - b.x) * determinantB) / denominator,
    y: (determinantA * (c.y - d.y) - (a.y - b.y) * determinantB) / denominator,
  }
}

export function roadJunctions(roads: RoadStroke[]): Point[] {
  const junctions: Point[] = []
  const add = (point: Point) => {
    if (!junctions.some((existing) => distance(existing, point) < 2)) junctions.push(point)
  }
  roads.forEach((road, roadIndex) => roads.slice(roadIndex + 1).forEach((other) => {
    road.points.slice(1).forEach((end, index) => other.points.slice(1).forEach((otherEnd, otherIndex) => {
      const start = road.points[index]
      const otherStart = other.points[otherIndex]
      const crossing = lineIntersection(start, end, otherStart, otherEnd)
      if (crossing) add(crossing)
      ;[start, end].forEach((endpoint) => {
        if (pointToSegmentDistance(endpoint, otherStart, otherEnd) < .8) add(closestPointOnSegment(endpoint, otherStart, otherEnd))
      })
      ;[otherStart, otherEnd].forEach((endpoint) => {
        if (pointToSegmentDistance(endpoint, start, end) < .8) add(closestPointOnSegment(endpoint, start, end))
      })
    }))
  }))
  return junctions
}

export function connectedAnchors(anchors: Anchor[], roads: RoadStroke[], originId: string): string[] {
  const anchorIds = anchors.map((anchor) => anchor.id)
  const roadIds = roads.map((road) => road.id)
  const adjacency = new Map<string, Set<string>>([...anchorIds, ...roadIds].map((id) => [id, new Set<string>()]))
  const link = (a: string, b: string) => {
    adjacency.get(a)?.add(b)
    adjacency.get(b)?.add(a)
  }
  anchors.forEach((anchor) => roads.forEach((road) => {
    if (pointToRoadDistance(anchor.position, road) <= 7.2) link(anchor.id, road.id)
  }))
  roads.forEach((road, index) => roads.slice(index + 1).forEach((other) => {
    if (roadsTouch(road, other)) link(road.id, other.id)
  }))
  const visited = new Set<string>()
  const queue = [originId]
  while (queue.length) {
    const current = queue.shift()!
    if (visited.has(current)) continue
    visited.add(current)
    adjacency.get(current)?.forEach((next) => { if (!visited.has(next)) queue.push(next) })
  }
  return anchorIds.filter((id) => visited.has(id))
}

export function initialMissionState(level: MissionLevel): MissionState {
  return {
    roads: [],
    positions: Object.fromEntries(level.placeables.map((item) => [item.id, { ...item.position }])),
    movedItemIds: [],
  }
}

export function evaluateMission(level: MissionLevel, state: MissionState): MissionEvaluation {
  const positions = new Map<string, Point>([
    ...level.landmarks.map((item) => [item.id, item.position] as const),
    ...level.placeables.map((item) => [item.id, state.positions[item.id] ?? item.position] as const),
  ])
  const anchors = [...positions].map(([id, position]) => ({ id, position }))
  const roads = [...(level.baseRoads ?? []), ...state.roads]
  const connected = new Set<string>()

  const requirements = level.requirements.map((requirement) => {
    let satisfied = false
    let progress: number | undefined
    let target: number | undefined
    if (requirement.kind === 'moved') {
      progress = requirement.itemIds.filter((id) => state.movedItemIds.includes(id)).length
      target = requirement.itemIds.length
      satisfied = progress === target
    } else if (requirement.kind === 'connect') {
      const reached = connectedAnchors(anchors, roads, requirement.anchorIds[0])
      reached.forEach((id) => connected.add(id))
      progress = requirement.anchorIds.slice(1).filter((id) => reached.includes(id)).length
      target = requirement.anchorIds.length - 1
      satisfied = progress === target
    } else if (requirement.kind === 'coverage') {
      const source = positions.get(requirement.itemId)!
      progress = requirement.targetIds.filter((id) => distance(source, positions.get(id)!) <= requirement.radius).length
      target = requirement.count
      satisfied = progress >= target
    } else if (requirement.kind === 'nearObstacle') {
      const point = positions.get(requirement.itemId)!
      const obstacle = level.obstacles.find((item) => item.id === requirement.obstacleId)!
      const gap = distance(point, obstacle.position)
      satisfied = (requirement.min === undefined || gap >= requirement.min) && (requirement.max === undefined || gap <= requirement.max)
    } else if (requirement.kind === 'nearItem') {
      satisfied = distance(positions.get(requirement.itemId)!, positions.get(requirement.targetItemId)!) <= requirement.max
    } else if (requirement.kind === 'separated') {
      satisfied = requirement.itemIds.every((id, index) => requirement.itemIds.slice(index + 1).every((other) => distance(positions.get(id)!, positions.get(other)!) >= requirement.min))
    } else if (requirement.kind === 'nearRoad') {
      satisfied = requirement.itemIds.every((id) => roads.some((road) => pointToRoadDistance(positions.get(id)!, road) <= requirement.max))
    } else if (requirement.kind === 'awayFromLandmark') {
      const landmark = positions.get(requirement.landmarkId)!
      satisfied = requirement.itemIds.every((id) => distance(positions.get(id)!, landmark) >= requirement.min)
    }
    return { id: requirement.id, satisfied, progress, target }
  })

  const totalLength = state.roads.reduce((sum, road) => sum + roadLength(road), 0)
  const withinBudget = !level.roadBudget || totalLength <= level.roadBudget
  return {
    complete: requirements.every((result) => result.satisfied) && withinBudget,
    requirements,
    connectedAnchorIds: [...connected],
    totalLength,
    withinBudget,
    efficient: requirements.every((result) => result.satisfied) && (!level.efficientLength || totalLength <= level.efficientLength),
  }
}

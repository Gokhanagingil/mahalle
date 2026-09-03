import type { Landmark, Point, RoadEvaluation, RoadLevel, RoadStroke } from './types'

export const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y)

export function pointToSegmentDistance(point: Point, start: Point, end: Point): number {
  const dx = end.x - start.x
  const dy = end.y - start.y
  if (dx === 0 && dy === 0) return distance(point, start)
  const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy)))
  return distance(point, { x: start.x + t * dx, y: start.y + t * dy })
}

export function pointToRoadDistance(point: Point, road: RoadStroke): number {
  if (road.points.length === 1) return distance(point, road.points[0])
  return Math.min(...road.points.slice(1).map((end, index) => pointToSegmentDistance(point, road.points[index], end)))
}

function perpendicularDistance(point: Point, start: Point, end: Point) {
  return pointToSegmentDistance(point, start, end)
}

export function simplifyPath(points: Point[], tolerance = 0.7): Point[] {
  if (points.length <= 2) return points
  let greatest = 0
  let splitAt = 0
  for (let index = 1; index < points.length - 1; index += 1) {
    const deviation = perpendicularDistance(points[index], points[0], points.at(-1)!)
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
  path += ` L ${last.x} ${last.y}`
  return path
}

export function roadLength(road: RoadStroke): number {
  return road.points.slice(1).reduce((total, point, index) => total + distance(road.points[index], point), 0)
}

function nearestRoadPoint(point: Point, roads: RoadStroke[]): Point | null {
  let best: { point: Point; distance: number } | null = null
  for (const road of roads) {
    for (let index = 1; index < road.points.length; index += 1) {
      const start = road.points[index - 1]
      const end = road.points[index]
      const dx = end.x - start.x
      const dy = end.y - start.y
      const denominator = dx * dx + dy * dy || 1
      const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / denominator))
      const candidate = { x: start.x + t * dx, y: start.y + t * dy }
      const gap = distance(point, candidate)
      if (!best || gap < best.distance) best = { point: candidate, distance: gap }
    }
  }
  return best && best.distance <= 6 ? best.point : null
}

function snapPoint(point: Point, landmarks: Landmark[], roads: RoadStroke[]): Point {
  const landmark = landmarks
    .map((item) => ({ point: item.position, distance: distance(point, item.position) }))
    .sort((a, b) => a.distance - b.distance)[0]
  if (landmark && landmark.distance <= 13) return { ...landmark.point }
  return nearestRoadPoint(point, roads) ?? point
}

export function magnetizePath(points: Point[], landmarks: Landmark[], roads: RoadStroke[]): Point[] {
  const simple = simplifyPath(points)
  if (simple.length < 2) return simple
  return simple.map((point, index) => {
    if (index === 0 || index === simple.length - 1) return snapPoint(point, landmarks, roads)
    return point
  })
}

export function pathHitsObstacle(points: Point[], level: RoadLevel): boolean {
  return level.obstacles.some((obstacle) => points.slice(1).some((end, index) => (
    pointToSegmentDistance(obstacle.position, points[index], end) < obstacle.radius + 2.8
  )))
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
    pointToSegmentDistance(a, c, d),
    pointToSegmentDistance(b, c, d),
    pointToSegmentDistance(c, a, b),
    pointToSegmentDistance(d, a, b),
  )
}

function roadsTouch(a: RoadStroke, b: RoadStroke, threshold = 3.4): boolean {
  return a.points.slice(1).some((aEnd, aIndex) => (
    b.points.slice(1).some((bEnd, bIndex) => segmentGap(a.points[aIndex], aEnd, b.points[bIndex], bEnd) <= threshold)
  ))
}

export function connectedLandmarks(level: RoadLevel, roads: RoadStroke[], originId: string): string[] {
  const landmarkIds = level.landmarks.map((landmark) => landmark.id)
  const roadIds = roads.map((road) => road.id)
  const adjacency = new Map<string, Set<string>>([...landmarkIds, ...roadIds].map((id) => [id, new Set<string>()]))
  const link = (a: string, b: string) => {
    adjacency.get(a)?.add(b)
    adjacency.get(b)?.add(a)
  }

  level.landmarks.forEach((landmark) => roads.forEach((road) => {
    if (pointToRoadDistance(landmark.position, road) <= 6.8) link(landmark.id, road.id)
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
    adjacency.get(current)?.forEach((next) => {
      if (!visited.has(next)) queue.push(next)
    })
  }
  return landmarkIds.filter((id) => visited.has(id))
}

export function evaluateRoadLevel(level: RoadLevel, roads: RoadStroke[]): RoadEvaluation {
  const totalLength = roads.reduce((sum, road) => sum + roadLength(road), 0)
  if (level.goal.kind === 'coverage') {
    const connected = connectedLandmarks(level, roads, level.goal.sourceId)
    const connectedTargets = level.goal.targetIds.filter((id) => connected.includes(id))
    const networkComplete = connectedTargets.length >= level.goal.count
    const withinBudget = !level.roadBudget || totalLength <= level.roadBudget
    return {
      complete: networkComplete && withinBudget,
      networkComplete,
      withinBudget,
      connectedLandmarkIds: connected,
      connectedCount: connectedTargets.length,
      requiredCount: level.goal.count,
      totalLength,
      efficient: networkComplete && totalLength <= level.efficientLength,
    }
  }

  const connected = connectedLandmarks(level, roads, level.goal.landmarkIds[0])
  const targets = level.goal.landmarkIds.slice(1)
  const reached = targets.filter((id) => connected.includes(id))
  const networkComplete = reached.length === targets.length
  const withinBudget = !level.roadBudget || totalLength <= level.roadBudget
  return {
    complete: networkComplete && withinBudget,
    networkComplete,
    withinBudget,
    connectedLandmarkIds: connected,
    connectedCount: reached.length,
    requiredCount: targets.length,
    totalLength,
    efficient: networkComplete && totalLength <= level.efficientLength,
  }
}

import { useMemo, useRef, useState } from 'react'
import { ArrowLeft, Check, HelpCircle, Lightbulb, Move, Pause, Play, RotateCcw, Route, Sparkles, Undo2, X } from 'lucide-react'
import { BuildingArt } from '../components/BuildingArt'
import {
  distance,
  evaluateMission,
  findSnapTarget,
  initialMissionState,
  magnetizePath,
  pathHitsObstacle,
  positionHitsObstacle,
  roadJunctions,
  roadLength,
  smoothPath,
} from '../game/engine'
import type { Locale, MissionLevel, MissionState, Point, Requirement, RoadStroke, Settings } from '../game/types'
import type { SnapTarget } from '../game/engine'
import { t } from '../i18n'
import type { TranslationKey } from '../i18n'
import { placementFeedback, successFeedback } from '../utils/feedback'
import { useWakeLock } from '../hooks/useWakeLock'

type Props = {
  level: MissionLevel
  locale: Locale
  settings: Settings
  initialMission: MissionState
  totalLevels: number
  onSave: (mission: MissionState) => void
  onComplete: (mission: MissionState) => void
  onNext: () => void
  onHome: () => void
}

type Notice = 'short' | 'obstacle' | 'budget' | 'placement' | 'junction' | null
type DragState = { id: string; origin: Point; point: Point; before: MissionState; moved: boolean }

function hintFor(locale: Locale, levelId: number) {
  return t(locale, `hintLevel${levelId}` as TranslationKey)
}

function requirementIncludesItem(requirement: Requirement, id: string) {
  if (requirement.kind === 'coverage' || requirement.kind === 'nearObstacle') return requirement.itemId === id
  if (requirement.kind === 'nearItem') return requirement.itemId === id || requirement.targetItemId === id
  if (requirement.kind === 'moved' || requirement.kind === 'nearRoad' || requirement.kind === 'nearLandmark' || requirement.kind === 'separated' || requirement.kind === 'awayFromLandmark') return requirement.itemIds.includes(id)
  return requirement.anchorIds.includes(id)
}

function firstRequirementItem(requirement: Requirement) {
  if (requirement.kind === 'coverage' || requirement.kind === 'nearObstacle' || requirement.kind === 'nearItem') return requirement.itemId
  if (requirement.kind === 'moved' || requirement.kind === 'nearRoad' || requirement.kind === 'nearLandmark' || requirement.kind === 'separated' || requirement.kind === 'awayFromLandmark') return requirement.itemIds[0]
  return requirement.anchorIds[0]
}

function ObstacleArt({ type, x, y, radius }: { type: 'tree' | 'pond' | 'garden'; x: number; y: number; radius: number }) {
  if (type === 'pond') return (
    <g className="map-pond" aria-hidden="true">
      <ellipse cx={x} cy={y + 1} rx={radius * 1.18} ry={radius * .72} />
      <path d={`M ${x - radius * .62} ${y} q ${radius * .32} ${-radius * .3} ${radius * .66} 0 t ${radius * .66} 0`} />
      <circle cx={x - radius * .45} cy={y - radius * .42} r="1.2" />
      <path className="reed" d={`M ${x + radius * .6} ${y + radius * .35} q 0 -5 2 -7 M ${x + radius * .8} ${y + radius * .34} q -1 -4 -3 -6`} />
    </g>
  )
  if (type === 'garden') return (
    <g className="map-garden" aria-hidden="true">
      <ellipse className="garden-bed" cx={x} cy={y + 1} rx={radius * 1.12} ry={radius * .72} />
      {[-.62, -.25, .14, .53].map((offset, index) => (
        <g key={offset} transform={`translate(${x + radius * offset} ${y + (index % 2 ? 2 : -1)})`}>
          <path d="M0 4V-1" /><circle className={`flower flower-${index}`} cy="-2" r="2.1" />
        </g>
      ))}
    </g>
  )
  return (
    <g className="map-tree" aria-hidden="true">
      <ellipse className="tree-shadow" cx={x + 1.5} cy={y + radius * .78} rx={radius * .73} ry={radius * .28} />
      <path className="tree-trunk" d={`M ${x - 1.7} ${y + radius * .78} L ${x - .8} ${y - 1} L ${x + 2} ${y - 1} L ${x + 2.7} ${y + radius * .78} Z`} />
      <circle className="tree-leaf leaf-one" cx={x - radius * .32} cy={y - radius * .28} r={radius * .62} />
      <circle className="tree-leaf leaf-two" cx={x + radius * .34} cy={y - radius * .38} r={radius * .58} />
      <circle className="tree-leaf leaf-three" cx={x + radius * .05} cy={y + radius * .1} r={radius * .61} />
    </g>
  )
}

export function GameScreen({ level, locale, settings, initialMission, totalLevels, onSave, onComplete, onNext, onHome }: Props) {
  const [mission, setMission] = useState<MissionState>(initialMission)
  const [history, setHistory] = useState<MissionState[]>([])
  const [activeTool, setActiveTool] = useState(level.tools[0])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [drawing, setDrawing] = useState<Point[]>([])
  const drawingRef = useRef<Point[]>([])
  const dragRef = useRef<DragState | null>(null)
  const suppressItemClickRef = useRef(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const lastSnapRef = useRef<string | null>(null)
  const [snapTarget, setSnapTarget] = useState<SnapTarget | null>(null)
  const [snapPulse, setSnapPulse] = useState(0)
  const [freshRoadId, setFreshRoadId] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)
  const [goalsOpen, setGoalsOpen] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [notice, setNotice] = useState<Notice>(null)
  const noticeTimer = useRef<number | undefined>(undefined)
  const initialEvaluation = evaluateMission(level, initialMission)
  const [complete, setComplete] = useState(initialEvaluation.complete)
  const completedOnce = useRef(initialEvaluation.complete)

  useWakeLock(!paused)

  const positionedItems = useMemo(() => level.placeables.map((item) => ({
    ...item, position: mission.positions[item.id] ?? item.position,
  })), [level.placeables, mission.positions])
  const anchors = useMemo(() => [...level.landmarks, ...positionedItems].map((item) => ({ id: item.id, position: item.position })), [level.landmarks, positionedItems])
  const allRoads = useMemo(() => [...(level.baseRoads ?? []), ...mission.roads], [level.baseRoads, mission.roads])
  const junctions = useMemo(() => roadJunctions(allRoads), [allRoads])
  const evaluation = useMemo(() => evaluateMission(level, mission), [level, mission])
  const previewPoints = useMemo(() => drawing.length > 1 ? magnetizePath(drawing, anchors, allRoads) : drawing, [drawing, anchors, allRoads])
  const previewHitsObstacle = previewPoints.length > 1 && pathHitsObstacle(previewPoints, level)
  const satisfiedCount = evaluation.requirements.filter((result) => result.satisfied).length
  const unplacedItems = positionedItems.filter((item) => !mission.movedItemIds.includes(item.id))
  const firstUnmetRequirement = level.requirements.find((requirement) => !evaluation.requirements.find((result) => result.id === requirement.id)?.satisfied)
  const guidedItemId = activeTool === 'move'
    ? selectedItem ?? unplacedItems[0]?.id ?? (firstUnmetRequirement ? firstRequirementItem(firstUnmetRequirement) : null)
    : null
  const guidedItem = positionedItems.find((item) => item.id === guidedItemId)
  const activeRequirement = (guidedItemId
    ? level.requirements.find((requirement) => requirement.kind !== 'moved' && requirementIncludesItem(requirement, guidedItemId) && !evaluation.requirements.find((result) => result.id === requirement.id)?.satisfied)
    : undefined) ?? firstUnmetRequirement ?? level.requirements.at(-1)!
  const activeRequirementResult = evaluation.requirements.find((result) => result.id === activeRequirement.id)!
  const serviceCentre = level.serviceRadius
    ? mission.positions[level.serviceRadius.itemId] ?? level.placeables.find((item) => item.id === level.serviceRadius!.itemId)!.position
    : null

  function toMapPoint(clientX: number, clientY: number): Point {
    const rect = mapRef.current!.getBoundingClientRect()
    return {
      x: Math.max(3, Math.min(97, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.max(4, Math.min(114, ((clientY - rect.top) / rect.height) * 118)),
    }
  }

  function showNotice(next: Notice) {
    window.clearTimeout(noticeTimer.current)
    setNotice(next)
    noticeTimer.current = window.setTimeout(() => setNotice(null), 2800)
  }

  function signalSnap(target: SnapTarget | null) {
    setSnapTarget(target)
    const key = target ? `${target.kind}-${target.id}` : null
    if (key && key !== lastSnapRef.current) {
      lastSnapRef.current = key
      setSnapPulse((value) => value + 1)
      if (settings.haptics && navigator.vibrate) navigator.vibrate(18)
    } else if (!key) {
      lastSnapRef.current = null
    }
  }

  function checkCompletion(next: MissionState) {
    const result = evaluateMission(level, next)
    if (!result.withinBudget) showNotice('budget')
    if (!completedOnce.current && result.complete) {
      completedOnce.current = true
      window.setTimeout(() => {
        successFeedback(settings)
        onComplete(next)
        setComplete(true)
      }, settings.reducedMotion ? 80 : 620)
    }
  }

  function beginRoad(event: React.PointerEvent<SVGSVGElement>) {
    if (activeTool !== 'road' || paused || complete) return
    const point = toMapPoint(event.clientX, event.clientY)
    const target = findSnapTarget(point, anchors, allRoads)
    if (!target) { showNotice('short'); return }
    event.currentTarget.setPointerCapture(event.pointerId)
    drawingRef.current = [point]
    setDrawing([point])
    signalSnap(target)
    setShowIntro(false)
    setNotice(null)
  }

  function extendRoad(event: React.PointerEvent<SVGSVGElement>) {
    if (!drawingRef.current.length || !event.currentTarget.hasPointerCapture(event.pointerId)) return
    const point = toMapPoint(event.clientX, event.clientY)
    if (distance(point, drawingRef.current.at(-1)!) < .9) return
    drawingRef.current = [...drawingRef.current, point]
    setDrawing(drawingRef.current)
    signalSnap(findSnapTarget(point, anchors, allRoads))
  }

  function finishRoad(event: React.PointerEvent<SVGSVGElement>) {
    if (!drawingRef.current.length) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    const end = toMapPoint(event.clientX, event.clientY)
    const raw = distance(end, drawingRef.current.at(-1)!) > .4 ? [...drawingRef.current, end] : drawingRef.current
    const endTarget = findSnapTarget(end, anchors, allRoads)
    const points = magnetizePath(raw, anchors, allRoads)
    drawingRef.current = []
    setDrawing([])
    signalSnap(null)
    if (!endTarget || points.length < 2 || roadLength({ id: 'preview', points }) < 5) { showNotice('short'); return }
    if (pathHitsObstacle(points, level)) { showNotice('obstacle'); return }

    const road: RoadStroke = { id: `road-${Date.now()}-${mission.roads.length}`, points }
    const beforeJunctions = roadJunctions(allRoads).length
    const next = { ...mission, roads: [...mission.roads, road] }
    setHistory((previous) => [...previous, mission])
    setMission(next)
    setFreshRoadId(road.id)
    onSave(next)
    placementFeedback(settings)
    if (roadJunctions([...allRoads, road]).length > beforeJunctions) showNotice('junction')
    checkCompletion(next)
  }

  function cancelRoad() {
    drawingRef.current = []
    setDrawing([])
    signalSnap(null)
  }

  function invalidPlacement(id: string, point: Point) {
    if (positionHitsObstacle(point, level)) return true
    if (level.landmarks.some((item) => distance(item.position, point) < 12)) return true
    return positionedItems.some((item) => item.id !== id && distance(item.position, point) < 13)
  }

  function commitPlacement(id: string, point: Point, before: MissionState) {
    if (invalidPlacement(id, point)) {
      setMission(before)
      showNotice('placement')
      return
    }
    const next: MissionState = {
      ...before,
      positions: { ...before.positions, [id]: point },
      movedItemIds: before.movedItemIds.includes(id) ? before.movedItemIds : [...before.movedItemIds, id],
    }
    setHistory((previous) => [...previous, before])
    setMission(next)
    setSelectedItem(null)
    setShowIntro(false)
    onSave(next)
    placementFeedback(settings)
    checkCompletion(next)
  }

  function beginDrag(event: React.PointerEvent<HTMLButtonElement>, id: string) {
    if (paused || complete) return
    event.stopPropagation()
    const point = mission.positions[id] ?? level.placeables.find((item) => item.id === id)!.position
    setActiveTool('move')
    setSelectedItem(id)
    setShowIntro(false)
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { id, origin: point, point, before: mission, moved: false }
  }

  function dragItem(event: React.PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current
    if (!drag || !event.currentTarget.hasPointerCapture(event.pointerId)) return
    const point = toMapPoint(event.clientX, event.clientY)
    drag.point = point
    drag.moved = drag.moved || distance(drag.origin, point) > 2
    setMission({ ...drag.before, positions: { ...drag.before.positions, [drag.id]: point } })
  }

  function finishDrag(event: React.PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current
    if (!drag) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    dragRef.current = null
    if (!drag.moved) { setMission(drag.before); return }
    suppressItemClickRef.current = true
    window.setTimeout(() => { suppressItemClickRef.current = false }, 0)
    commitPlacement(drag.id, drag.point, drag.before)
  }

  function tapMap(event: React.MouseEvent<SVGSVGElement>) {
    if (activeTool !== 'move' || !selectedItem || dragRef.current) return
    commitPlacement(selectedItem, toMapPoint(event.clientX, event.clientY), mission)
  }

  function undo() {
    const previous = history.at(-1)
    if (!previous) return
    setMission(previous)
    setHistory((entries) => entries.slice(0, -1))
    setComplete(false)
    completedOnce.current = false
    setSelectedItem(null)
    onSave(previous)
  }

  function restart() {
    const fresh = initialMissionState(level)
    setHistory((previous) => [...previous, mission])
    setMission(fresh)
    setComplete(false)
    completedOnce.current = false
    setPaused(false)
    setShowIntro(true)
    setSelectedItem(null)
    onSave(fresh)
  }

  const noticeCopy = notice === 'obstacle' ? t(locale, 'obstacleNotice')
    : notice === 'budget' ? t(locale, 'budgetNotice')
      : notice === 'placement' ? t(locale, 'placementNotice')
        : notice === 'junction' ? t(locale, 'junctionNotice') : t(locale, 'gentleTryAgain')

  return (
    <main className="game-screen road-game mission-game">
      <header className="game-header">
        <button className="round-button" onClick={() => setPaused(true)} aria-label={t(locale, 'pause')}><Pause /></button>
        <div className="level-heading"><small>{t(locale, 'level')} {level.id} / {totalLevels}</small><strong>{level.name[locale]}</strong></div>
        <div className="level-progress" aria-hidden="true"><i style={{ width: `${(level.id / totalLevels) * 100}%` }} /></div>
      </header>

      <section className="mission-brief" aria-live="polite">
        <div className="mission-title-row">
          <div className="objective-copy"><span className="objective-icon">{activeTool === 'road' ? <Route /> : <Move />}</span><div><small>{t(locale, 'goals')}</small><strong>{level.objective[locale]}</strong></div></div>
          <button className="connection-meter" onClick={() => setGoalsOpen(true)} aria-label={t(locale, 'allGoals')}><strong>{satisfiedCount}/{evaluation.requirements.length}</strong><span>{t(locale, 'goalsMet')}</span></button>
        </div>
        <div className={`active-requirement ${activeRequirementResult.satisfied ? 'satisfied' : ''}`}>
          <span>{activeRequirementResult.satisfied ? <Check /> : <i />}</span>
          <div><small>{t(locale, 'currentGoal')}</small><b>{activeRequirement.text[locale]}</b></div>
          {activeRequirementResult.target !== undefined && <em>{activeRequirementResult.progress}/{activeRequirementResult.target}</em>}
        </div>
      </section>

      {level.tools.length > 1 && (
        <div className="mission-tool-switch" role="group" aria-label={t(locale, 'chooseTool')}>
          <button className={activeTool === 'move' ? 'active' : ''} onClick={() => { setActiveTool('move'); setSelectedItem(null) }}><Move /> {t(locale, 'moveTool')}</button>
          <button className={activeTool === 'road' ? 'active' : ''} onClick={() => { setActiveTool('road'); setSelectedItem(null) }}><Route /> {t(locale, 'roadTool')}</button>
        </div>
      )}

      {activeTool === 'move' && unplacedItems.length > 0 && (
        <section className="placement-tray" aria-label={t(locale, 'toPlace')}>
          <div className="placement-tray-heading"><strong><Move /> {t(locale, 'toPlace')}</strong><span>{t(locale, 'tapOrDrag')}</span></div>
          <div className="placement-tray-items">
            {unplacedItems.map((item, index) => (
              <button
                key={item.id}
                className={`${selectedItem === item.id ? 'selected' : ''} ${guidedItemId === item.id ? 'is-next' : ''}`}
                aria-label={`${item.label[locale]}. ${t(locale, 'dragToMove')}`}
                onPointerDown={(event) => beginDrag(event, item.id)} onPointerMove={dragItem} onPointerUp={finishDrag} onPointerCancel={finishDrag}
                onClick={(event) => {
                  if (suppressItemClickRef.current) { suppressItemClickRef.current = false; return }
                  event.stopPropagation()
                  setSelectedItem(item.id)
                  setActiveTool('move')
                  setShowIntro(false)
                }}
              >
                <span className="tray-order">{index + 1}</span><BuildingArt type={item.type} decorative /><b>{item.label[locale]}</b><span className="tray-move"><Move /></span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="organic-map-wrap">
        <div ref={mapRef} className={`organic-map ${drawing.length ? 'is-drawing' : ''} tool-${activeTool} ${snapTarget ? 'snap-active' : ''}`}>
          <svg
            className="road-drawing-surface" viewBox="0 0 100 118" role="application"
            aria-label={`${level.objective[locale]}. ${activeTool === 'road' ? t(locale, 'drawCoach') : t(locale, 'moveCoach')}`}
            onPointerDown={beginRoad} onPointerMove={extendRoad} onPointerUp={finishRoad} onPointerCancel={cancelRoad} onClick={tapMap}
          >
            <defs>
              <linearGradient id={`grass-${level.id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e3f1cd" /><stop offset="1" stopColor="#b7dba4" /></linearGradient>
              <filter id={`road-shadow-${level.id}`} x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="#47634a" floodOpacity=".3" /></filter>
            </defs>
            <rect width="100" height="118" rx="7" fill={`url(#grass-${level.id})`} />
            <path className="terrain-patch patch-one" d="M-8 17C10 5 26 4 40 13s27 8 42-1 27-4 29 8v22c-20-7-28 1-42 4S42 34 27 39 7 42-35 32z" />
            <path className="terrain-patch patch-two" d="M-4 86c18-11 31-7 45 1s31 6 43-3 23-4 25 10v25H-4z" />
            <path className="meadow-line" d="M4 57c17-9 24 3 40 0s28-12 51-3" />

            {level.serviceRadius && serviceCentre && <circle className="service-radius" cx={serviceCentre.x} cy={serviceCentre.y} r={level.serviceRadius.radius} />}

            {level.tutorialPath && mission.roads.length === 0 && <path className="tutorial-route" d={smoothPath(level.tutorialPath)} />}

            <g className="road-verges" filter={`url(#road-shadow-${level.id})`}>
              {allRoads.map((road) => <path key={`v-${road.id}`} className={`${road.id === freshRoadId ? 'fresh-road-line ' : ''}road-verge`} d={smoothPath(road.points)} pathLength="1" />)}
            </g>
            <g className="road-surfaces">
              {allRoads.map((road) => <path key={`s-${road.id}`} className={`${road.id === freshRoadId ? 'fresh-road-line ' : ''}road-surface`} d={smoothPath(road.points)} pathLength="1" />)}
            </g>
            <g className="road-centres">
              {allRoads.map((road) => <path key={`c-${road.id}`} className={`${road.id === freshRoadId ? 'fresh-road-line ' : ''}road-centre`} d={smoothPath(road.points)} pathLength="1" />)}
            </g>
            <g className="junction-layer">
              {junctions.map((point, index) => <g key={`${point.x}-${point.y}`} className="road-junction"><circle cx={point.x} cy={point.y} r="3.25" /><circle className="junction-heart" cx={point.x} cy={point.y} r="1.05" /><circle className="junction-wave" cx={point.x} cy={point.y} r="4" style={{ animationDelay: `${index * 80}ms` }} /></g>)}
            </g>

            {previewPoints.length > 1 && <g className={`road-preview-group ${previewHitsObstacle ? 'is-blocked' : ''}`}><path className="road-preview-verge" d={smoothPath(previewPoints)} /><path className="road-preview" d={smoothPath(previewPoints)} /></g>}
            {snapTarget && drawing.length > 0 && <g key={`${snapTarget.id}-${snapPulse}`} className="magnetic-catch"><path d={`M ${drawing.at(-1)!.x} ${drawing.at(-1)!.y} L ${snapTarget.point.x} ${snapTarget.point.y}`} /><circle className="magnet-wave-one" cx={snapTarget.point.x} cy={snapTarget.point.y} r="4" /><circle className="magnet-wave-two" cx={snapTarget.point.x} cy={snapTarget.point.y} r="7" /><circle className="magnet-core" cx={snapTarget.point.x} cy={snapTarget.point.y} r="2" /></g>}

            {level.obstacles.map((obstacle) => <ObstacleArt key={obstacle.id} type={obstacle.type} x={obstacle.position.x} y={obstacle.position.y} radius={obstacle.radius} />)}
          </svg>

          {guidedItem?.guide && <div
            className={`placement-guide ${selectedItem === guidedItem.id ? 'is-ready' : ''}`}
            style={{
              left: `${guidedItem.guide.position.x}%`,
              top: `${(guidedItem.guide.position.y / 118) * 100}%`,
              width: `${guidedItem.guide.radius * 2}%`,
              aspectRatio: '1',
            }}
            aria-hidden="true"
          ><span className="guide-ghost"><BuildingArt type={guidedItem.type} decorative /></span><strong>{t(locale, 'placeHere')}</strong></div>}

          {level.landmarks.map((landmark, index) => {
            const connected = evaluation.connectedAnchorIds.includes(landmark.id)
            const withinService = !!(serviceCentre && level.serviceRadius && distance(serviceCentre, landmark.position) <= level.serviceRadius.radius)
            return <div key={landmark.id} className={`map-landmark landmark-${landmark.type} ${connected ? 'is-connected' : ''} ${withinService ? 'within-service' : ''}`} style={{ left: `${landmark.position.x}%`, top: `${(landmark.position.y / 118) * 100}%`, '--landmark-delay': `${index * 90}ms` } as React.CSSProperties}><span className="landmark-halo" /><BuildingArt type={landmark.type} decorative /><span className="landmark-label">{landmark.label[locale]}</span></div>
          })}

          {positionedItems.filter((item) => mission.movedItemIds.includes(item.id) || dragRef.current?.id === item.id).map((item) => (
            <button
              key={item.id} className={`map-landmark placeable landmark-${item.type} ${selectedItem === item.id ? 'is-selected' : ''} ${mission.movedItemIds.includes(item.id) ? 'was-moved' : ''}`}
              style={{ left: `${item.position.x}%`, top: `${(item.position.y / 118) * 100}%` }} aria-label={`${item.label[locale]}. ${t(locale, 'dragToMove')}`}
              onPointerDown={(event) => beginDrag(event, item.id)} onPointerMove={dragItem} onPointerUp={finishDrag} onPointerCancel={finishDrag}
              onClick={(event) => {
                event.stopPropagation()
                if (suppressItemClickRef.current) { suppressItemClickRef.current = false; return }
                setSelectedItem(item.id)
                setActiveTool('move')
                setShowIntro(false)
              }}
            ><span className="drag-ring" /><BuildingArt type={item.type} decorative /><span className="landmark-label">{item.label[locale]}</span><span className="drag-handle"><Move /></span></button>
          ))}

          {showIntro && activeTool === 'road' && <div className="map-coach" role="status"><span className="coach-avatar"><HelpCircle /></span><p>{level.intro[locale]}</p><button onClick={() => setShowIntro(false)} aria-label={t(locale, 'close')}><X /></button></div>}
          {showIntro && activeTool === 'move' && <div className="placement-coach" role="status"><span><b>1</b>{t(locale, 'chooseItemStep')}</span><i /><span><b>2</b>{t(locale, 'choosePlaceStep')}</span></div>}
          {!showIntro && !drawing.length && !notice && <div className={`action-coach coach-${activeTool}`} aria-hidden="true"><span className={activeTool === 'road' ? 'finger-trail' : 'move-pulse'} /> <strong>{activeTool === 'road' ? t(locale, 'drawCoachShort') : selectedItem ? `${positionedItems.find((item) => item.id === selectedItem)?.label[locale]} ${t(locale, 'selectedItem')} — ${t(locale, 'choosePlaceStep')}` : t(locale, 'moveCoachShort')}</strong></div>}
          {snapTarget && drawing.length > 0 && <div className="snap-toast" role="status"><Sparkles /> {t(locale, snapTarget.kind === 'road' ? 'snapToRoad' : 'snapToPlace')}</div>}
          {notice && <div className={`map-notice notice-${notice}`} role="status"><span>{notice === 'obstacle' || notice === 'placement' ? '🌿' : notice === 'junction' ? '✨' : notice === 'budget' ? '✂️' : '↗'}</span>{noticeCopy}</div>}
        </div>
      </section>

      {level.tools.includes('road') && <div className={`road-status-row ${!evaluation.withinBudget ? 'over-budget' : ''}`}>
        <span><Route /> {level.roadBudget ? t(locale, 'roadBudget') : t(locale, 'roadLength')}: <strong>{Math.round(evaluation.totalLength)}{level.roadBudget ? ` / ${level.roadBudget}` : ''} m</strong></span>
        <span className="alive-status"><i /> {t(locale, satisfiedCount ? 'neighbourhoodAlive' : 'planning')}</span>
      </div>}

      <nav className="game-toolbar" aria-label={locale === 'tr' ? 'Oyun işlemleri' : 'Game actions'}>
        <button onClick={undo} disabled={!history.length}><Undo2 /><span>{t(locale, 'undo')}</span></button>
        <button className={hintOpen ? 'active' : ''} onClick={() => setHintOpen(true)}><Lightbulb /><span>{t(locale, 'hint')}</span></button>
        <button onClick={() => setPaused(true)}><Pause /><span>{t(locale, 'pause')}</span></button>
      </nav>

      {hintOpen && <div className="bottom-sheet-backdrop" onClick={() => setHintOpen(false)}><section className="bottom-sheet" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="hint-title"><div className="sheet-handle" /><span className="sheet-icon"><Lightbulb /></span><h2 id="hint-title">{t(locale, 'hintIntro')}</h2><p>{hintFor(locale, level.id)}</p><button className="primary-button" onClick={() => setHintOpen(false)}>{t(locale, 'resume')}</button></section></div>}

      {goalsOpen && <div className="bottom-sheet-backdrop" onClick={() => setGoalsOpen(false)}><section className="bottom-sheet goals-sheet" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="goals-title"><div className="sheet-handle" /><h2 id="goals-title">{t(locale, 'allGoals')}</h2><div className="goals-sheet-list">{level.requirements.map((requirement) => {
        const result = evaluation.requirements.find((item) => item.id === requirement.id)!
        return <div key={requirement.id} className={`requirement-chip ${result.satisfied ? 'satisfied' : ''}`}><span>{result.satisfied ? <Check /> : <i />}</span><b>{requirement.text[locale]}</b>{result.target !== undefined && <em>{result.progress}/{result.target}</em>}</div>
      })}</div><button className="primary-button" onClick={() => setGoalsOpen(false)}>{t(locale, 'resume')}</button></section></div>}

      {paused && <div className="modal-backdrop"><section className="pause-modal" role="dialog" aria-modal="true"><span className="modal-icon"><Pause /></span><h2>{t(locale, 'pause')}</h2><button className="primary-button" onClick={() => setPaused(false)}><Play /> {t(locale, 'resume')}</button><button className="modal-action" onClick={restart}><RotateCcw /> {t(locale, 'restart')}</button><button className="modal-action" onClick={onHome}><ArrowLeft /> {t(locale, 'home')}</button></section></div>}

      {complete && <div className="modal-backdrop celebration"><div className="confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} />)}</div><section className="complete-modal" role="dialog" aria-modal="true"><span className="success-seal"><Check /></span><p className="eyebrow"><Sparkles /> {level.name[locale]}</p><h2>{level.id === totalLevels ? t(locale, 'allCompleteTitle') : level.id % 5 === 0 ? t(locale, 'chapterCompleteTitle') : t(locale, 'completeTitle')}</h2><p>{level.id === totalLevels ? t(locale, 'allCompleteBody') : level.id % 5 === 0 ? t(locale, 'chapterCompleteBody') : t(locale, 'completeBody')}</p>{evaluation.efficient && level.tools.includes('road') && <div className="master-route-badge"><Route /><div><strong>{t(locale, 'efficientRoute')}</strong><span>{t(locale, 'efficientBody')}</span></div></div>}<div className="mini-neighbourhood">{[...level.landmarks, ...positionedItems].slice(0, 4).map((item) => <BuildingArt key={item.id} type={item.type} decorative />)}</div>{level.id < totalLevels ? <button className="primary-button" onClick={onNext}>{t(locale, 'nextLevel')} <ArrowLeft className="arrow-next" /></button> : <button className="primary-button" onClick={onHome}>{t(locale, 'home')}</button>}</section></div>}
    </main>
  )
}

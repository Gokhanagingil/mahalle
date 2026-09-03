import { useMemo, useRef, useState } from 'react'
import { ArrowLeft, Check, HelpCircle, Lightbulb, Pause, Play, RotateCcw, Route, Sparkles, Undo2, X } from 'lucide-react'
import { BuildingArt } from '../components/BuildingArt'
import {
  distance,
  evaluateRoadLevel,
  magnetizePath,
  pathHitsObstacle,
  pointToRoadDistance,
  roadLength,
  smoothPath,
} from '../game/engine'
import type { Locale, Point, RoadLevel, RoadStroke, Settings } from '../game/types'
import { t } from '../i18n'
import { placementFeedback, successFeedback } from '../utils/feedback'
import { useWakeLock } from '../hooks/useWakeLock'

type Props = {
  level: RoadLevel
  locale: Locale
  settings: Settings
  initialRoads: RoadStroke[]
  onSave: (roads: RoadStroke[]) => void
  onComplete: (roads: RoadStroke[]) => void
  onNext: () => void
  onHome: () => void
}

type Notice = 'short' | 'obstacle' | 'budget' | null

function hintFor(locale: Locale, levelId: number) {
  if (levelId === 1) return t(locale, 'hintLevel1')
  if (levelId === 2) return t(locale, 'hintBranch')
  if (levelId === 3) return t(locale, 'hintObstacle')
  return t(locale, 'hintNetwork')
}

function ObstacleArt({ type, x, y, radius }: { type: 'tree' | 'pond' | 'garden'; x: number; y: number; radius: number }) {
  if (type === 'pond') {
    return (
      <g className="map-pond" aria-hidden="true">
        <ellipse cx={x} cy={y + 1} rx={radius * 1.18} ry={radius * 0.72} />
        <path d={`M ${x - radius * .62} ${y} q ${radius * .32} ${-radius * .3} ${radius * .66} 0 t ${radius * .66} 0`} />
        <circle cx={x - radius * .45} cy={y - radius * .42} r="1.2" />
        <path className="reed" d={`M ${x + radius * .6} ${y + radius * .35} q 0 -5 2 -7 M ${x + radius * .8} ${y + radius * .34} q -1 -4 -3 -6`} />
      </g>
    )
  }
  if (type === 'garden') {
    return (
      <g className="map-garden" aria-hidden="true">
        <ellipse className="garden-bed" cx={x} cy={y + 1} rx={radius * 1.12} ry={radius * .72} />
        {[-.62, -.25, .14, .53].map((offset, index) => (
          <g key={offset} transform={`translate(${x + radius * offset} ${y + (index % 2 ? 2 : -1)})`}>
            <path d="M0 4V-1" />
            <circle className={`flower flower-${index}`} cy="-2" r="2.1" />
          </g>
        ))}
      </g>
    )
  }
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

export function GameScreen({ level, locale, settings, initialRoads, onSave, onComplete, onNext, onHome }: Props) {
  const [roads, setRoads] = useState<RoadStroke[]>(initialRoads)
  const [history, setHistory] = useState<RoadStroke[][]>([])
  const [drawing, setDrawing] = useState<Point[]>([])
  const drawingRef = useRef<Point[]>([])
  const [paused, setPaused] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)
  const [showIntro, setShowIntro] = useState(initialRoads.length === 0)
  const [notice, setNotice] = useState<Notice>(null)
  const [freshRoadId, setFreshRoadId] = useState<string | null>(null)
  const initialEvaluation = evaluateRoadLevel(level, initialRoads)
  const [complete, setComplete] = useState(initialEvaluation.complete)
  const completedOnce = useRef(initialEvaluation.complete)
  const noticeTimer = useRef<number | undefined>(undefined)

  useWakeLock(!paused)

  const evaluation = useMemo(() => evaluateRoadLevel(level, roads), [level, roads])
  const previewPoints = useMemo(
    () => (drawing.length > 1 ? magnetizePath(drawing, level.landmarks, roads) : drawing),
    [drawing, level.landmarks, roads],
  )
  const previewHitsObstacle = previewPoints.length > 1 && pathHitsObstacle(previewPoints, level)

  function mapPoint(event: React.PointerEvent<SVGSVGElement>): Point {
    const rect = event.currentTarget.getBoundingClientRect()
    return {
      x: Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(118, ((event.clientY - rect.top) / rect.height) * 118)),
    }
  }

  function isAnchored(point: Point) {
    return level.landmarks.some((landmark) => distance(point, landmark.position) <= 15)
      || roads.some((road) => pointToRoadDistance(point, road) <= 7)
  }

  function showNotice(next: Notice) {
    window.clearTimeout(noticeTimer.current)
    setNotice(next)
    noticeTimer.current = window.setTimeout(() => setNotice(null), 2500)
  }

  function beginRoad(event: React.PointerEvent<SVGSVGElement>) {
    if (paused || complete) return
    const point = mapPoint(event)
    if (!isAnchored(point)) {
      showNotice('short')
      return
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    drawingRef.current = [point]
    setDrawing([point])
    setShowIntro(false)
    setNotice(null)
  }

  function extendRoad(event: React.PointerEvent<SVGSVGElement>) {
    if (!drawingRef.current.length || !event.currentTarget.hasPointerCapture(event.pointerId)) return
    const point = mapPoint(event)
    if (distance(point, drawingRef.current.at(-1)!) < 1.1) return
    drawingRef.current = [...drawingRef.current, point]
    setDrawing(drawingRef.current)
  }

  function finishRoad(event: React.PointerEvent<SVGSVGElement>) {
    if (!drawingRef.current.length) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    const end = mapPoint(event)
    const raw = distance(end, drawingRef.current.at(-1)!) > .5 ? [...drawingRef.current, end] : drawingRef.current
    const points = magnetizePath(raw, level.landmarks, roads)
    drawingRef.current = []
    setDrawing([])

    if (points.length < 2 || roadLength({ id: 'preview', points }) < 5 || !isAnchored(points.at(-1)!)) {
      showNotice('short')
      return
    }
    if (pathHitsObstacle(points, level)) {
      showNotice('obstacle')
      return
    }

    const road: RoadStroke = { id: `road-${Date.now()}-${roads.length}`, points }
    const next = [...roads, road]
    setHistory((previous) => [...previous, roads])
    setRoads(next)
    setFreshRoadId(road.id)
    onSave(next)
    placementFeedback(settings)

    const nextEvaluation = evaluateRoadLevel(level, next)
    if (nextEvaluation.networkComplete && !nextEvaluation.withinBudget) showNotice('budget')
    if (!completedOnce.current && nextEvaluation.complete) {
      completedOnce.current = true
      window.setTimeout(() => {
        successFeedback(settings)
        onComplete(next)
        setComplete(true)
      }, settings.reducedMotion ? 100 : 650)
    }
  }

  function undo() {
    const previous = history.at(-1)
    if (!previous) return
    setRoads(previous)
    setHistory((entries) => entries.slice(0, -1))
    setComplete(false)
    completedOnce.current = false
    onSave(previous)
  }

  function restart() {
    setHistory((previous) => [...previous, roads])
    setRoads([])
    setDrawing([])
    drawingRef.current = []
    setComplete(false)
    completedOnce.current = false
    setPaused(false)
    setShowIntro(true)
    onSave([])
  }

  return (
    <main className="game-screen road-game">
      <header className="game-header">
        <button className="round-button" onClick={() => setPaused(true)} aria-label={t(locale, 'pause')}><Pause /></button>
        <div className="level-heading">
          <small>{t(locale, 'level')} {level.id} / {5}</small>
          <strong>{level.name[locale]}</strong>
        </div>
        <div className="level-progress" aria-hidden="true"><i style={{ width: `${level.id * 20}%` }} /></div>
      </header>

      <section className="road-objective" aria-live="polite">
        <div className="objective-copy">
          <span className="objective-icon"><Route aria-hidden="true" /></span>
          <div><small>{t(locale, 'goals')}</small><strong>{level.objective[locale]}</strong></div>
        </div>
        <div className="connection-meter" aria-label={`${evaluation.connectedCount} / ${evaluation.requiredCount} ${t(locale, 'connected')}`}>
          <strong>{evaluation.connectedCount}/{evaluation.requiredCount}</strong>
          <span>{t(locale, 'connected')}</span>
        </div>
      </section>

      <section className="organic-map-wrap">
        <div className={`organic-map ${drawing.length ? 'is-drawing' : ''}`}>
          <svg
            className="road-drawing-surface"
            viewBox="0 0 100 118"
            role="application"
            aria-label={`${level.objective[locale]}. ${t(locale, 'drawCoach')}`}
            onPointerDown={beginRoad}
            onPointerMove={extendRoad}
            onPointerUp={finishRoad}
            onPointerCancel={finishRoad}
          >
            <defs>
              <linearGradient id={`grass-${level.id}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#dff0c7" />
                <stop offset="1" stopColor="#b9dda6" />
              </linearGradient>
              <filter id={`road-shadow-${level.id}`} x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="#47634a" floodOpacity=".3" />
              </filter>
            </defs>

            <rect width="100" height="118" rx="7" fill={`url(#grass-${level.id})`} />
            <path className="terrain-patch patch-one" d="M-8 17C10 5 26 4 40 13s27 8 42-1 27-4 29 8v22c-20-7-28 1-42 4S42 34 27 39 7 42-35 32z" />
            <path className="terrain-patch patch-two" d="M-4 86c18-11 31-7 45 1s31 6 43-3 23-4 25 10v25H-4z" />
            <path className="meadow-line" d="M4 57c17-9 24 3 40 0s28-12 51-3" />
            {[{ x: 8, y: 14 }, { x: 92, y: 13 }, { x: 9, y: 65 }, { x: 92, y: 105 }].map((plant) => (
              <g key={`${plant.x}-${plant.y}`} className="tiny-plant" transform={`translate(${plant.x} ${plant.y})`} aria-hidden="true">
                <path d="M0 4V0m0 2-2-2m2 1 2-2" />
              </g>
            ))}

            {level.tutorialPath && roads.length === 0 && (
              <path className="tutorial-route" d={smoothPath(level.tutorialPath)} />
            )}

            {roads.map((road, index) => {
              const path = smoothPath(road.points)
              return (
                <g key={road.id} className={road.id === freshRoadId ? 'fresh-road' : ''} filter={`url(#road-shadow-${level.id})`}>
                  <path className="road-verge" d={path} pathLength="1" />
                  <path className="road-surface" d={path} pathLength="1" />
                  <path className="road-centre" d={path} pathLength="1" />
                  {!settings.reducedMotion && index < 3 && (
                    <circle className={`street-life life-${index}`} r="1.25">
                      <animateMotion dur={`${6 + index * 1.8}s`} repeatCount="indefinite" path={path} />
                    </circle>
                  )}
                </g>
              )
            })}

            {previewPoints.length > 1 && (
              <g className={`road-preview-group ${previewHitsObstacle ? 'is-blocked' : ''}`}>
                <path className="road-preview-verge" d={smoothPath(previewPoints)} />
                <path className="road-preview" d={smoothPath(previewPoints)} />
              </g>
            )}

            {level.obstacles.map((obstacle) => (
              <ObstacleArt key={obstacle.id} type={obstacle.type} x={obstacle.position.x} y={obstacle.position.y} radius={obstacle.radius} />
            ))}
          </svg>

          {level.landmarks.map((landmark, index) => {
            const connected = evaluation.connectedLandmarkIds.includes(landmark.id) && roads.length > 0
            return (
              <div
                key={landmark.id}
                className={`map-landmark landmark-${landmark.type} ${connected ? 'is-connected' : ''}`}
                style={{ left: `${landmark.position.x}%`, top: `${(landmark.position.y / 118) * 100}%`, '--landmark-delay': `${index * 90}ms` } as React.CSSProperties}
                aria-label={`${landmark.label[locale]}${connected ? `, ${t(locale, 'connected')}` : ''}`}
              >
                <span className="landmark-halo" aria-hidden="true" />
                <BuildingArt type={landmark.type} decorative />
                <span className="landmark-label">{landmark.label[locale]}</span>
              </div>
            )
          })}

          {showIntro && (
            <div className="map-coach" role="status">
              <span className="coach-avatar"><HelpCircle /></span>
              <p>{level.intro[locale]}</p>
              <button onClick={() => setShowIntro(false)} aria-label={t(locale, 'close')}><X /></button>
            </div>
          )}

          {!showIntro && roads.length === 0 && !drawing.length && !notice && (
            <div className="draw-coach" aria-hidden="true"><span className="finger-trail" /><strong>{t(locale, 'drawCoachShort')}</strong></div>
          )}

          {notice && (
            <div className={`map-notice notice-${notice}`} role="status">
              <span>{notice === 'obstacle' ? '🌿' : notice === 'budget' ? '✂️' : '↗'}</span>
              {notice === 'obstacle' ? t(locale, 'obstacleNotice') : notice === 'budget' ? t(locale, 'budgetNotice') : t(locale, 'gentleTryAgain')}
            </div>
          )}
        </div>
      </section>

      <div className={`road-status-row ${!evaluation.withinBudget ? 'over-budget' : ''}`}>
        <span><Route /> {level.roadBudget ? t(locale, 'roadBudget') : t(locale, 'roadLength')}: <strong>{Math.round(evaluation.totalLength)}{level.roadBudget ? ` / ${level.roadBudget}` : ''} m</strong></span>
        {roads.length > 0 && <span className="alive-status"><i /> {t(locale, 'neighbourhoodAlive')}</span>}
      </div>

      <nav className="game-toolbar" aria-label={locale === 'tr' ? 'Oyun işlemleri' : 'Game actions'}>
        <button onClick={undo} disabled={!history.length}><Undo2 /><span>{t(locale, 'undo')}</span></button>
        <button className={hintOpen ? 'active' : ''} onClick={() => setHintOpen(true)}><Lightbulb /><span>{t(locale, 'hint')}</span></button>
        <button onClick={() => setPaused(true)}><Pause /><span>{t(locale, 'pause')}</span></button>
      </nav>

      {hintOpen && (
        <div className="bottom-sheet-backdrop" onClick={() => setHintOpen(false)}>
          <section className="bottom-sheet" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="hint-title">
            <div className="sheet-handle" />
            <span className="sheet-icon"><Lightbulb /></span>
            <h2 id="hint-title">{t(locale, 'hintIntro')}</h2>
            <p>{hintFor(locale, level.id)}</p>
            <button className="primary-button" onClick={() => setHintOpen(false)}>{t(locale, 'resume')}</button>
          </section>
        </div>
      )}

      {paused && (
        <div className="modal-backdrop">
          <section className="pause-modal" role="dialog" aria-modal="true">
            <span className="modal-icon"><Pause /></span>
            <h2>{t(locale, 'pause')}</h2>
            <button className="primary-button" onClick={() => setPaused(false)}><Play /> {t(locale, 'resume')}</button>
            <button className="modal-action" onClick={restart}><RotateCcw /> {t(locale, 'restart')}</button>
            <button className="modal-action" onClick={onHome}><ArrowLeft /> {t(locale, 'home')}</button>
          </section>
        </div>
      )}

      {complete && (
        <div className="modal-backdrop celebration">
          <div className="confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} />)}</div>
          <section className="complete-modal" role="dialog" aria-modal="true">
            <span className="success-seal"><Check /></span>
            <p className="eyebrow"><Sparkles /> {level.name[locale]}</p>
            <h2>{level.id === 5 ? t(locale, 'allCompleteTitle') : t(locale, 'completeTitle')}</h2>
            <p>{level.id === 5 ? t(locale, 'allCompleteBody') : t(locale, 'completeBody')}</p>
            {evaluation.efficient && (
              <div className="master-route-badge"><Route /><div><strong>{t(locale, 'efficientRoute')}</strong><span>{t(locale, 'efficientBody')}</span></div></div>
            )}
            <div className="mini-neighbourhood" aria-hidden="true">
              {level.landmarks.slice(0, 4).map((landmark) => <BuildingArt key={landmark.id} type={landmark.type} decorative />)}
            </div>
            {level.id < 5 ? (
              <button className="primary-button" onClick={onNext}>{t(locale, 'nextLevel')} <ArrowLeft className="arrow-next" /></button>
            ) : (
              <button className="primary-button" onClick={onHome}>{t(locale, 'home')}</button>
            )}
          </section>
        </div>
      )}
    </main>
  )
}

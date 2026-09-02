import { useMemo, useRef, useState } from 'react'
import { ArrowLeft, Check, HelpCircle, Lightbulb, LockKeyhole, Pause, Play, RotateCcw, Sparkles, Undo2, X } from 'lucide-react'
import { BuildingArt } from '../components/BuildingArt'
import { evaluateLevel, isLevelComplete, itemAt, placeItem } from '../game/engine'
import type { BoardItem, BuildingType, Level, Locale, Position, Settings } from '../game/types'
import { buildingName, ruleText, t } from '../i18n'
import { placementFeedback, successFeedback } from '../utils/feedback'
import { useWakeLock } from '../hooks/useWakeLock'

type Props = {
  level: Level
  locale: Locale
  settings: Settings
  initialItems: BoardItem[]
  onSave: (items: BoardItem[]) => void
  onComplete: (items: BoardItem[]) => void
  onNext: () => void
  onHome: () => void
}

function goodCellsFor(type: BuildingType, level: Level): Position[] {
  const cells: Position[] = []
  for (let row = 0; row < level.size; row += 1) {
    for (let col = 0; col < level.size; col += 1) {
      const target = { row, col }
      if (itemAt(level.items, target)) continue
      const item = level.items.find((candidate) => candidate.type === type && !candidate.fixed)
      if (!item) continue
      const testItems = placeItem(level.items, item.id, target)
      const relevant = level.rules.filter((rule) => rule.subject === type)
      if (relevant.length && relevant.every((rule) => evaluateLevel({ ...level, rules: [rule] }, testItems)[0].satisfied)) {
        cells.push(target)
      }
    }
  }
  return cells
}

function hintFor(locale: Locale, level: Level) {
  const subject = level.rules[0]?.subject
  if (subject === 'park') return t(locale, 'hintPark')
  if (subject === 'bakery') return t(locale, 'hintBakery')
  if (subject === 'pharmacy') return t(locale, 'hintPharmacy')
  if (subject === 'busStop') return t(locale, 'hintStop')
  return t(locale, 'hintGeneric')
}

export function GameScreen({ level, locale, settings, initialItems, onSave, onComplete, onNext, onHome }: Props) {
  const [items, setItems] = useState<BoardItem[]>(initialItems)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [history, setHistory] = useState<BoardItem[][]>([])
  const [paused, setPaused] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)
  const [complete, setComplete] = useState(() => isLevelComplete(level, initialItems))
  const [showIntro, setShowIntro] = useState(true)
  const completedOnce = useRef(isLevelComplete(level, initialItems))

  useWakeLock(!paused)

  const results = useMemo(() => evaluateLevel(level, items), [level, items])
  const selected = items.find((item) => item.id === selectedId)
  const inventory = items.filter((item) => !item.fixed && !item.position)
  const placedMovables = items.filter((item) => !item.fixed && item.position)
  const highlightCells = useMemo(
    () => (selected && (hintOpen || level.tutorial) ? goodCellsFor(selected.type, { ...level, items }) : []),
    [hintOpen, items, level, selected],
  )

  const tutorialMessage = useMemo(() => {
    if (!level.tutorial || complete) return null
    if (level.tutorial === 'firstPlacement') return selected ? t(locale, 'tutorialPlace') : t(locale, 'tutorialSelect')
    return selected ? t(locale, 'tutorialDistancePlace') : t(locale, 'tutorialDistanceSelect')
  }, [complete, level.tutorial, locale, selected])

  function commit(next: BoardItem[]) {
    setHistory((previous) => [...previous, items])
    setItems(next)
    onSave(next)
    placementFeedback(settings)
    window.setTimeout(() => {
      if (!completedOnce.current && isLevelComplete(level, next)) {
        completedOnce.current = true
        successFeedback(settings)
        onComplete(next)
        setComplete(true)
      }
    }, settings.reducedMotion ? 80 : 520)
  }

  function selectItem(item: BoardItem) {
    if (item.fixed) return
    setSelectedId(item.id === selectedId ? null : item.id)
    setShowIntro(false)
  }

  function selectCell(position: Position) {
    const cellItem = itemAt(items, position)
    if (selectedId) {
      if (cellItem?.fixed) return
      const next = placeItem(items, selectedId, position)
      if (next !== items) {
        commit(next)
        setSelectedId(null)
        setHintOpen(false)
      }
      return
    }
    if (cellItem && !cellItem.fixed) selectItem(cellItem)
  }

  function undo() {
    const previous = history.at(-1)
    if (!previous) return
    setItems(previous)
    setHistory((entries) => entries.slice(0, -1))
    setSelectedId(null)
    setComplete(false)
    completedOnce.current = false
    onSave(previous)
  }

  function restart() {
    const fresh = level.items.map((item) => ({ ...item, position: item.position ? { ...item.position } : undefined }))
    setHistory((previous) => [...previous, items])
    setItems(fresh)
    setSelectedId(null)
    setComplete(false)
    completedOnce.current = false
    setPaused(false)
    onSave(fresh)
  }

  return (
    <main className="game-screen">
      <header className="game-header">
        <button className="round-button" onClick={() => setPaused(true)} aria-label={t(locale, 'pause')}><Pause /></button>
        <div className="level-heading">
          <small>{t(locale, 'level')} {level.id} / 5</small>
          <strong>{level.name[locale]}</strong>
        </div>
        <div className="level-progress" aria-hidden="true"><i style={{ width: `${level.id * 20}%` }} /></div>
      </header>

      <section className="goal-panel">
        <div className="goal-title"><Sparkles aria-hidden="true" /><span>{t(locale, 'goals')}</span></div>
        <div className="rules-list">
          {level.rules.map((rule) => {
            const satisfied = results.find((result) => result.ruleId === rule.id)?.satisfied
            return (
              <div key={rule.id} className={`rule-chip ${satisfied ? 'satisfied' : ''}`} role="status">
                <span className="rule-status">{satisfied ? <Check /> : <i />}</span>
                <span>{ruleText(locale, rule)}</span>
              </div>
            )
          })}
        </div>
      </section>

      {(showIntro || tutorialMessage) && (
        <div className="coach-bubble" role="status">
          <span className="coach-avatar"><HelpCircle /></span>
          <p>{showIntro ? level.intro[locale] : tutorialMessage}</p>
          {showIntro && <button onClick={() => setShowIntro(false)} aria-label={t(locale, 'close')}><X /></button>}
        </div>
      )}

      <section className="board-wrap">
        <div className={`game-board size-${level.size}`} style={{ '--board-size': level.size } as React.CSSProperties}>
          {Array.from({ length: level.size * level.size }, (_, index) => {
            const position = { row: Math.floor(index / level.size), col: index % level.size }
            const item = itemAt(items, position)
            const highlighted = highlightCells.some((cell) => cell.row === position.row && cell.col === position.col)
            return (
              <button
                key={`${position.row}-${position.col}`}
                className={`board-cell ${item ? 'occupied' : ''} ${item?.fixed ? 'fixed' : ''} ${item?.id === selectedId ? 'selected' : ''} ${highlighted ? 'hint-cell' : ''}`}
                onClick={() => selectCell(position)}
                aria-label={item ? `${buildingName(locale, item.type)}${item.fixed ? `, ${t(locale, 'fixed')}` : ''}` : t(locale, 'emptyCell')}
              >
                <span className="plot-grass" aria-hidden="true" />
                {item && <BuildingArt type={item.type} decorative />}
                {item?.fixed && <span className="fixed-mark" aria-hidden="true"><LockKeyhole /></span>}
              </button>
            )
          })}
        </div>
      </section>

      <section className="inventory-panel">
        <div className="inventory-heading">
          <span>{t(locale, 'placeThese')}</span>
          <small>{selected ? t(locale, 'movePrompt') : t(locale, 'selectPrompt')}</small>
        </div>
        <div className="inventory-list">
          {[...inventory, ...placedMovables].map((item) => (
            <button key={item.id} className={`inventory-item ${item.id === selectedId ? 'selected' : ''} ${item.position ? 'placed' : ''}`} onClick={() => selectItem(item)}>
              <BuildingArt type={item.type} decorative />
              <span>{buildingName(locale, item.type)}</span>
              {item.id === selectedId && <i>{t(locale, 'selected')}</i>}
              {item.position && item.id !== selectedId && <Check aria-hidden="true" />}
            </button>
          ))}
        </div>
      </section>

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
            <p>{hintFor(locale, level)}</p>
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
            <div className="mini-neighbourhood" aria-hidden="true">
              {items.filter((item) => item.type !== 'road').slice(0, 4).map((item) => <BuildingArt key={item.id} type={item.type} decorative />)}
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

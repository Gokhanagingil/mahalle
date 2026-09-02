import { ArrowLeft, Check, LockKeyhole, MapPin } from 'lucide-react'
import { levels } from '../game/levels'
import { t } from '../i18n'
import type { Locale } from '../game/types'

type Props = {
  locale: Locale
  currentLevel: number
  completedLevels: number[]
  onSelect: (index: number) => void
  onBack: () => void
}

export function LevelsScreen({ locale, currentLevel, completedLevels, onSelect, onBack }: Props) {
  return (
    <main className="panel-screen levels-screen">
      <header className="panel-header">
        <button className="round-button" onClick={onBack} aria-label={t(locale, 'back')}><ArrowLeft /></button>
        <div>
          <p>{t(locale, 'progress')}</p>
          <h1>{t(locale, 'chooseLevel')}</h1>
        </div>
        <span className="header-spacer" />
      </header>

      <div className="level-path" aria-hidden="true" />
      <section className="level-list">
        {levels.map((level, index) => {
          const completed = completedLevels.includes(level.id)
          const unlocked = index <= currentLevel || completed
          return (
            <button
              key={level.id}
              className={`level-card ${completed ? 'completed' : ''} ${index === currentLevel ? 'current' : ''}`}
              onClick={() => unlocked && onSelect(index)}
              disabled={!unlocked}
              aria-label={`${t(locale, 'level')} ${level.id}: ${level.name[locale]}${!unlocked ? `, ${t(locale, 'locked')}` : ''}`}
            >
              <span className="level-number">{completed ? <Check /> : !unlocked ? <LockKeyhole /> : <MapPin />}</span>
              <span className="level-copy">
                <small>{t(locale, 'level')} {level.id}</small>
                <strong>{level.name[locale]}</strong>
              </span>
              {index === currentLevel && !completed && <span className="current-badge">{t(locale, 'current')}</span>}
            </button>
          )
        })}
      </section>
    </main>
  )
}

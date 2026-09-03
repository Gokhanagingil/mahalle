import { ChevronRight, Map, Settings as SettingsIcon, Sparkles } from 'lucide-react'
import { AmbientScene } from '../components/AmbientScene'
import { BrandMark } from '../components/BrandMark'
import { t } from '../i18n'
import type { Locale } from '../game/types'

type Props = {
  locale: Locale
  hasStarted: boolean
  completedCount: number
  totalCount: number
  onPlay: () => void
  onLevels: () => void
  onSettings: () => void
}

export function HomeScreen({ locale, hasStarted, completedCount, totalCount, onPlay, onLevels, onSettings }: Props) {
  return (
    <main className="home-screen">
      <AmbientScene />
      <header className="home-header">
        <button className="round-button" onClick={onSettings} aria-label={t(locale, 'settings')}>
          <SettingsIcon aria-hidden="true" />
        </button>
      </header>

      <section className="hero-card">
        <BrandMark />
        <p className="eyebrow"><Sparkles aria-hidden="true" /> {locale === 'tr' ? 'Her sokak yeni bir fikir' : 'A new idea on every street'}</p>
        <h1>{t(locale, 'appName')}</h1>
        <p className="hero-tagline">{t(locale, 'tagline')}</p>

        {hasStarted && (
          <div className="progress-pill" aria-label={`${t(locale, 'progress')}: ${completedCount}/${totalCount}`}>
            <span className="progress-chapters" aria-hidden="true">
              {Array.from({ length: Math.ceil(totalCount / 5) }, (_, index) => {
                const chapterProgress = Math.max(0, Math.min(5, completedCount - index * 5))
                return <i key={index}><span style={{ width: `${chapterProgress * 20}%` }} /></i>
              })}
            </span>
            <strong>{completedCount}/{totalCount}</strong>
          </div>
        )}

        <button className="primary-button play-button" onClick={onPlay}>
          <span>{t(locale, hasStarted ? 'continue' : 'start')}</span>
          <ChevronRight aria-hidden="true" />
        </button>

        <button className="secondary-button" onClick={onLevels}>
          <Map aria-hidden="true" />
          <span>{t(locale, 'levels')}</span>
        </button>
      </section>

      <p className="home-footnote">{locale === 'tr' ? 'Süre yok · Ceza yok · Her çözüm size ait' : 'No timer · No penalties · Every solution is yours'}</p>
    </main>
  )
}

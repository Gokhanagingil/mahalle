import { ArrowLeft, Contrast, Languages, RotateCcw, Type, Volume2, Vibrate, Waves } from 'lucide-react'
import { t } from '../i18n'
import type { Locale, Settings } from '../game/types'

type Props = {
  settings: Settings
  onChange: (settings: Settings) => void
  onBack: () => void
  onReset: () => void
}

type ToggleProps = {
  label: string
  icon: React.ReactNode
  checked: boolean
  onChange: (checked: boolean) => void
}

function Toggle({ label, icon, checked, onChange }: ToggleProps) {
  return (
    <label className="setting-row">
      <span className="setting-icon">{icon}</span>
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="switch" aria-hidden="true"><i /></span>
    </label>
  )
}

export function SettingsScreen({ settings, onChange, onBack, onReset }: Props) {
  const locale = settings.locale
  const patch = (change: Partial<Settings>) => onChange({ ...settings, ...change })

  return (
    <main className="panel-screen">
      <header className="panel-header">
        <button className="round-button" onClick={onBack} aria-label={t(locale, 'back')}><ArrowLeft /></button>
        <h1>{t(locale, 'settings')}</h1>
        <span className="header-spacer" />
      </header>

      <section className="settings-card">
        <h2><Languages aria-hidden="true" /> {t(locale, 'language')}</h2>
        <div className="language-choice" role="group" aria-label={t(locale, 'language')}>
          {(['tr', 'en'] as Locale[]).map((value) => (
            <button key={value} className={locale === value ? 'active' : ''} onClick={() => patch({ locale: value })}>
              <span aria-hidden="true">{value === 'tr' ? 'TR' : 'EN'}</span>
              {t(locale, value === 'tr' ? 'turkish' : 'english')}
            </button>
          ))}
        </div>
      </section>

      <section className="settings-card">
        <h2>{t(locale, 'accessibility')}</h2>
        <Toggle label={t(locale, 'sound')} icon={<Volume2 />} checked={settings.sound} onChange={(sound) => patch({ sound })} />
        <Toggle label={t(locale, 'haptics')} icon={<Vibrate />} checked={settings.haptics} onChange={(haptics) => patch({ haptics })} />
        <Toggle label={t(locale, 'largeText')} icon={<Type />} checked={settings.largeText} onChange={(largeText) => patch({ largeText })} />
        <Toggle label={t(locale, 'highContrast')} icon={<Contrast />} checked={settings.highContrast} onChange={(highContrast) => patch({ highContrast })} />
        <Toggle label={t(locale, 'reducedMotion')} icon={<Waves />} checked={settings.reducedMotion} onChange={(reducedMotion) => patch({ reducedMotion })} />
      </section>

      <p className="privacy-note">{t(locale, 'privacyNote')}</p>
      <button className="danger-quiet-button" onClick={onReset}><RotateCcw /> {t(locale, 'reset')}</button>
    </main>
  )
}

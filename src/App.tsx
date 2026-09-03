import { useEffect, useState } from 'react'
import { GameScreen } from './screens/GameScreen'
import { HomeScreen } from './screens/HomeScreen'
import { LevelsScreen } from './screens/LevelsScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { levels } from './game/levels'
import { initialMissionState } from './game/engine'
import { defaultGame, loadGame, resetGame, saveGame } from './game/storage'
import type { MissionState, SavedGame, Settings } from './game/types'
import { t } from './i18n'

type Screen = 'home' | 'game' | 'levels' | 'settings'

export function App() {
  const [game, setGame] = useState<SavedGame>(() => loadGame())
  const [screen, setScreen] = useState<Screen>('home')

  useEffect(() => {
    saveGame(game)
    document.documentElement.lang = game.settings.locale
  }, [game])

  const classNames = [
    'app-shell',
    game.settings.highContrast ? 'high-contrast' : '',
    game.settings.largeText ? 'large-text' : '',
    game.settings.reducedMotion ? 'reduced-motion' : '',
  ].filter(Boolean).join(' ')

  function begin() {
    setGame((previous) => ({ ...previous, hasStarted: true }))
    setScreen('game')
  }

  function saveMission(mission: MissionState) {
    setGame((previous) => ({
      ...previous,
      hasStarted: true,
      missions: { ...previous.missions, [previous.currentLevel]: mission },
    }))
  }

  function completeLevel(mission: MissionState) {
    setGame((previous) => {
      const levelId = levels[previous.currentLevel].id
      return {
        ...previous,
        completedLevels: previous.completedLevels.includes(levelId)
          ? previous.completedLevels
          : [...previous.completedLevels, levelId],
        missions: { ...previous.missions, [previous.currentLevel]: mission },
      }
    })
  }

  function nextLevel() {
    setGame((previous) => ({ ...previous, currentLevel: Math.min(previous.currentLevel + 1, levels.length - 1) }))
    setScreen('game')
  }

  function selectLevel(index: number) {
    setGame((previous) => ({ ...previous, currentLevel: index, hasStarted: true }))
    setScreen('game')
  }

  function changeSettings(settings: Settings) {
    setGame((previous) => ({ ...previous, settings }))
  }

  function requestReset() {
    if (!window.confirm(t(game.settings.locale, 'resetConfirm'))) return
    resetGame()
    setGame({ ...defaultGame, settings: game.settings })
    setScreen('home')
  }

  const level = levels[game.currentLevel] ?? levels[0]
  const initialMission = game.missions[game.currentLevel] ?? initialMissionState(level)

  return (
    <div className={classNames}>
      {screen === 'home' && (
        <HomeScreen
          locale={game.settings.locale}
          hasStarted={game.hasStarted}
          completedCount={game.completedLevels.length}
          onPlay={begin}
          onLevels={() => setScreen('levels')}
          onSettings={() => setScreen('settings')}
        />
      )}
      {screen === 'settings' && (
        <SettingsScreen settings={game.settings} onChange={changeSettings} onBack={() => setScreen('home')} onReset={requestReset} />
      )}
      {screen === 'levels' && (
        <LevelsScreen
          locale={game.settings.locale}
          currentLevel={game.currentLevel}
          completedLevels={game.completedLevels}
          onSelect={selectLevel}
          onBack={() => setScreen('home')}
        />
      )}
      {screen === 'game' && (
        <GameScreen
          key={level.id}
          level={level}
          locale={game.settings.locale}
          settings={game.settings}
          initialMission={initialMission}
          onSave={saveMission}
          onComplete={completeLevel}
          onNext={nextLevel}
          onHome={() => setScreen('home')}
        />
      )}
    </div>
  )
}

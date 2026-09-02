import type { Settings } from '../game/types'

let audioContext: AudioContext | null = null

function tone(frequency: number, duration: number, volume: number) {
  try {
    audioContext ??= new AudioContext()
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(volume, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)
    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    oscillator.start()
    oscillator.stop(audioContext.currentTime + duration)
  } catch {
    // Audio feedback is optional.
  }
}

export function placementFeedback(settings: Settings) {
  if (settings.sound) tone(360, 0.1, 0.035)
  if (settings.haptics) navigator.vibrate?.(18)
}

export function successFeedback(settings: Settings) {
  if (settings.sound) {
    tone(440, 0.18, 0.045)
    window.setTimeout(() => tone(554, 0.18, 0.04), 110)
    window.setTimeout(() => tone(659, 0.28, 0.035), 220)
  }
  if (settings.haptics) navigator.vibrate?.([25, 45, 35])
}

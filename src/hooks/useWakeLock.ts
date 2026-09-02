import { useEffect } from 'react'

type WakeLockSentinelLike = { release: () => Promise<void> }

export function useWakeLock(active: boolean) {
  useEffect(() => {
    let sentinel: WakeLockSentinelLike | null = null

    async function request() {
      try {
        const wakeLock = (navigator as Navigator & {
          wakeLock?: { request: (type: 'screen') => Promise<WakeLockSentinelLike> }
        }).wakeLock
        if (active && wakeLock) sentinel = await wakeLock.request('screen')
      } catch {
        // Unsupported or denied; the game remains fully usable.
      }
    }

    void request()
    return () => {
      void sentinel?.release()
    }
  }, [active])
}

import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => cleanup())

if (!window.PointerEvent) {
  Object.defineProperty(window, 'PointerEvent', { value: window.MouseEvent })
}

Object.defineProperty(window.navigator, 'vibrate', {
  configurable: true,
  value: () => true,
})

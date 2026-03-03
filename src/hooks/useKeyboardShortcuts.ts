import { useEffect } from 'react'

interface ShortcutHandlers {
  onPrevMove: () => void
  onNextMove: () => void
  onFirstMove: () => void
  onLastMove: () => void
  onUndo: () => void
  onFlip: () => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          handlers.onPrevMove()
          break
        case 'ArrowRight':
          e.preventDefault()
          handlers.onNextMove()
          break
        case 'Home':
          e.preventDefault()
          handlers.onFirstMove()
          break
        case 'End':
          e.preventDefault()
          handlers.onLastMove()
          break
        case 'u':
          handlers.onUndo()
          break
        case 'f':
          handlers.onFlip()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlers])
}

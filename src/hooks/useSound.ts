import { useCallback, useRef } from 'react'

const AudioContext = window.AudioContext || (window as any).webkitAudioContext

function createTone(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.3,
) {
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

  gainNode.gain.setValueAtTime(volume, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + duration)
}

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null)
  const enabledRef = useRef(true)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    return ctxRef.current
  }, [])

  const playMove = useCallback(() => {
    if (!enabledRef.current) return
    const ctx = getCtx()
    createTone(ctx, 600, 0.08, 'sine', 0.2)
  }, [getCtx])

  const playCapture = useCallback(() => {
    if (!enabledRef.current) return
    const ctx = getCtx()
    createTone(ctx, 300, 0.12, 'sawtooth', 0.15)
    setTimeout(() => createTone(ctx, 200, 0.1, 'sine', 0.1), 50)
  }, [getCtx])

  const playCheck = useCallback(() => {
    if (!enabledRef.current) return
    const ctx = getCtx()
    createTone(ctx, 800, 0.1, 'square', 0.15)
    setTimeout(() => createTone(ctx, 1000, 0.15, 'square', 0.12), 100)
  }, [getCtx])

  const playGameOver = useCallback(() => {
    if (!enabledRef.current) return
    const ctx = getCtx()
    createTone(ctx, 400, 0.2, 'sine', 0.2)
    setTimeout(() => createTone(ctx, 300, 0.2, 'sine', 0.2), 200)
    setTimeout(() => createTone(ctx, 200, 0.4, 'sine', 0.25), 400)
  }, [getCtx])

  const toggleSound = useCallback(() => {
    enabledRef.current = !enabledRef.current
    return enabledRef.current
  }, [])

  return { playMove, playCapture, playCheck, playGameOver, toggleSound, enabled: enabledRef }
}

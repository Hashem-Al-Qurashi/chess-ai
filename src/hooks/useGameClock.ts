import { useState, useRef, useCallback, useEffect } from 'react'

export function useGameClock() {
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)
  const accumulatedRef = useRef<number>(0)

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (isRunning) {
      accumulatedRef.current += Date.now() - startTimeRef.current
    }
    setIsRunning(false)
  }, [isRunning])

  const start = useCallback(() => {
    if (intervalRef.current) return
    startTimeRef.current = Date.now()
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setElapsed(accumulatedRef.current + (Date.now() - startTimeRef.current))
    }, 1000)
  }, [])

  const reset = useCallback(() => {
    stop()
    accumulatedRef.current = 0
    setElapsed(0)
  }, [stop])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return { elapsed, isRunning, start, stop, reset }
}

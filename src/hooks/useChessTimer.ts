import { useState, useRef, useCallback } from 'react'

export type TimeControl = 'bullet' | 'blitz' | 'rapid' | 'classical' | 'none'

const timeControlSeconds: Record<TimeControl, number> = {
  bullet: 60,
  blitz: 180,
  rapid: 600,
  classical: 1800,
  none: 0,
}

export interface TimerState {
  whiteTime: number
  blackTime: number
  activeColor: 'w' | 'b' | null
  timeControl: TimeControl
  isExpired: 'w' | 'b' | null
}

export function useChessTimer() {
  const [timerState, setTimerState] = useState<TimerState>({
    whiteTime: 0,
    blackTime: 0,
    activeColor: null,
    timeControl: 'none',
    isExpired: null,
  })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startTimer = useCallback((timeControl: TimeControl) => {
    stopInterval()
    const seconds = timeControlSeconds[timeControl]
    setTimerState({
      whiteTime: seconds,
      blackTime: seconds,
      activeColor: null,
      timeControl,
      isExpired: null,
    })
  }, [stopInterval])

  const switchTurn = useCallback((color: 'w' | 'b') => {
    stopInterval()
    setTimerState(prev => {
      if (prev.timeControl === 'none' || prev.isExpired) return prev
      return { ...prev, activeColor: color }
    })

    intervalRef.current = setInterval(() => {
      setTimerState(prev => {
        if (prev.isExpired || prev.timeControl === 'none') return prev

        const key = color === 'w' ? 'whiteTime' : 'blackTime'
        const newTime = Math.max(0, prev[key] - 0.1)

        if (newTime <= 0) {
          stopInterval()
          return { ...prev, [key]: 0, isExpired: color, activeColor: null }
        }

        return { ...prev, [key]: newTime }
      })
    }, 100)
  }, [stopInterval])

  const pauseTimer = useCallback(() => {
    stopInterval()
    setTimerState(prev => ({ ...prev, activeColor: null }))
  }, [stopInterval])

  const resetTimer = useCallback(() => {
    stopInterval()
    setTimerState(prev => {
      const seconds = timeControlSeconds[prev.timeControl]
      return {
        whiteTime: seconds,
        blackTime: seconds,
        activeColor: null,
        timeControl: prev.timeControl,
        isExpired: null,
      }
    })
  }, [stopInterval])

  return {
    timerState,
    startTimer,
    switchTurn,
    pauseTimer,
    resetTimer,
  }
}

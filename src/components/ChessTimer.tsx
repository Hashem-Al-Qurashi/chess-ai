import { type TimerState } from '../hooks/useChessTimer'
import './ChessTimer.css'

interface ChessTimerProps {
  timerState: TimerState
  flipped: boolean
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function TimerDisplay({ time, isActive, isExpired, label }: {
  time: number
  isActive: boolean
  isExpired: boolean
  label: string
}) {
  const className = [
    'timer-display',
    isActive && 'active',
    isExpired && 'expired',
    time <= 30 && time > 0 && 'low-time',
  ].filter(Boolean).join(' ')

  return (
    <div className={className}>
      <span className="timer-label">{label}</span>
      <span className="timer-value">{formatTime(time)}</span>
    </div>
  )
}

export default function ChessTimer({ timerState, flipped }: ChessTimerProps) {
  if (timerState.timeControl === 'none') return null

  const topColor = flipped ? 'w' : 'b'
  const bottomColor = flipped ? 'b' : 'w'

  return (
    <div className="chess-timer">
      <TimerDisplay
        time={topColor === 'w' ? timerState.whiteTime : timerState.blackTime}
        isActive={timerState.activeColor === topColor}
        isExpired={timerState.isExpired === topColor}
        label={topColor === 'w' ? 'White' : 'Black'}
      />
      <TimerDisplay
        time={bottomColor === 'w' ? timerState.whiteTime : timerState.blackTime}
        isActive={timerState.activeColor === bottomColor}
        isExpired={timerState.isExpired === bottomColor}
        label={bottomColor === 'w' ? 'White' : 'Black'}
      />
    </div>
  )
}

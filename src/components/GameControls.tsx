import { useState } from 'react'
import { type GameMode, type Difficulty } from '../App'
import { type TimeControl } from '../hooks/useChessTimer'
import './GameControls.css'

interface GameControlsProps {
  gameMode: GameMode
  difficulty: Difficulty
  soundEnabled: boolean
  timeControl: TimeControl
  pgn: string
  onNewGame: (mode: GameMode, difficulty?: Difficulty, color?: 'w' | 'b') => void
  onUndo: () => void
  onFlipBoard: () => void
  onToggleSound: () => void
  onTimeControl: (tc: TimeControl) => void
  canUndo: boolean
}

const timeControls: { value: TimeControl; label: string }[] = [
  { value: 'none', label: 'No Timer' },
  { value: 'bullet', label: '1 min' },
  { value: 'blitz', label: '3 min' },
  { value: 'rapid', label: '10 min' },
  { value: 'classical', label: '30 min' },
]

export default function GameControls({
  gameMode,
  difficulty,
  soundEnabled,
  timeControl,
  pgn,
  onNewGame,
  onUndo,
  onFlipBoard,
  onToggleSound,
  onTimeControl,
  canUndo,
}: GameControlsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyPGN = async () => {
    try {
      await navigator.clipboard.writeText(pgn)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for browsers without clipboard API
      const textarea = document.createElement('textarea')
      textarea.value = pgn
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="game-controls">
      <h3>Game Controls</h3>

      <div className="control-section">
        <h4>New Game</h4>
        <div className="button-group">
          <button
            className={`btn ${gameMode === 'local' ? 'active' : ''}`}
            onClick={() => onNewGame('local')}
          >
            2 Players
          </button>
          <button
            className={`btn ${gameMode === 'ai' ? 'active' : ''}`}
            onClick={() => onNewGame('ai', difficulty, 'w')}
          >
            vs AI
          </button>
        </div>
      </div>

      {gameMode === 'ai' && (
        <>
          <div className="control-section">
            <h4>Difficulty</h4>
            <div className="button-group">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  className={`btn btn-sm ${difficulty === d ? 'active' : ''}`}
                  onClick={() => onNewGame('ai', d)}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="control-section">
            <h4>Play as</h4>
            <div className="button-group">
              <button className="btn btn-sm" onClick={() => onNewGame('ai', difficulty, 'w')}>
                White
              </button>
              <button className="btn btn-sm" onClick={() => onNewGame('ai', difficulty, 'b')}>
                Black
              </button>
            </div>
          </div>
        </>
      )}

      <div className="control-section">
        <h4>Time Control</h4>
        <div className="button-group">
          {timeControls.map((tc) => (
            <button
              key={tc.value}
              className={`btn btn-sm ${timeControl === tc.value ? 'active' : ''}`}
              onClick={() => onTimeControl(tc.value)}
            >
              {tc.label}
            </button>
          ))}
        </div>
      </div>

      <div className="control-section">
        <div className="button-group">
          <button className="btn btn-secondary" onClick={onUndo} disabled={!canUndo}>
            Undo
          </button>
          <button className="btn btn-secondary" onClick={onFlipBoard}>
            Flip
          </button>
          <button className="btn btn-secondary" onClick={onToggleSound}>
            {soundEnabled ? 'Sound On' : 'Sound Off'}
          </button>
        </div>
      </div>

      <div className="control-section">
        <button className="btn btn-secondary full-width" onClick={handleCopyPGN} disabled={!pgn}>
          {copied ? 'Copied!' : 'Copy PGN'}
        </button>
      </div>
    </div>
  )
}

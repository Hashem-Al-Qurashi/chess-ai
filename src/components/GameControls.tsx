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
  gameInProgress: boolean
  autoQueen: boolean
  onNewGame: (mode: GameMode, difficulty?: Difficulty, color?: 'w' | 'b') => void
  onToggleAutoQueen: () => void
  onResign: () => void
  onUndo: () => void
  onFlipBoard: () => void
  onToggleSound: () => void
  onTimeControl: (tc: TimeControl) => void
  onRandomOpening: () => void
  canUndo: boolean
}

export type BoardTheme = 'classic' | 'green' | 'blue' | 'purple' | 'walnut' | 'coral'

const boardThemes: { value: BoardTheme; label: string }[] = [
  { value: 'walnut', label: 'Walnut' },
  { value: 'classic', label: 'Classic' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
  { value: 'purple', label: 'Purple' },
  { value: 'coral', label: 'Coral' },
]

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
  gameInProgress,
  autoQueen,
  onNewGame,
  onToggleAutoQueen,
  onResign,
  onUndo,
  onFlipBoard,
  onToggleSound,
  onTimeControl,
  onRandomOpening,
  canUndo,
}: GameControlsProps) {
  const [copied, setCopied] = useState(false)
  const [boardTheme, setBoardTheme] = useState<BoardTheme>('walnut')

  const confirmNewGame = (mode: GameMode, diff?: Difficulty, color?: 'w' | 'b') => {
    if (gameInProgress && !confirm('Start a new game? Current game will be lost.')) return
    onNewGame(mode, diff, color)
  }

  const handleBoardTheme = (theme: BoardTheme) => {
    setBoardTheme(theme)
    document.documentElement.setAttribute('data-board', theme)
  }

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

  const handleDownloadPGN = () => {
    const date = new Date().toISOString().split('T')[0]
    const blob = new Blob([pgn], { type: 'application/x-chess-pgn' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chess-game-${date}.pgn`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="game-controls">
      <h3>Game Controls</h3>

      <div className="control-section">
        <h4>New Game</h4>
        <div className="button-group">
          <button
            className={`btn ${gameMode === 'local' ? 'active' : ''}`}
            onClick={() => confirmNewGame('local')}
          >
            2 Players
          </button>
          <button
            className={`btn ${gameMode === 'ai' ? 'active' : ''}`}
            onClick={() => confirmNewGame('ai', difficulty, 'w')}
          >
            vs AI
          </button>
          <button className="btn btn-secondary" onClick={onRandomOpening} title="Start from a random ECO opening">
            Random Opening
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
                  onClick={() => confirmNewGame('ai', d)}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
            <p className="difficulty-desc">
              {difficulty === 'easy' && 'Random legal moves'}
              {difficulty === 'medium' && 'Prefers captures & checks'}
              {difficulty === 'hard' && 'Minimax depth 3 with evaluation'}
            </p>
          </div>

          <div className="control-section">
            <h4>Play as</h4>
            <div className="button-group">
              <button className="btn btn-sm" onClick={() => confirmNewGame('ai', difficulty, 'w')}>
                White
              </button>
              <button className="btn btn-sm" onClick={() => confirmNewGame('ai', difficulty, 'b')}>
                Black
              </button>
            </div>
          </div>
        </>
      )}

      <div className="control-section">
        <h4>Board Theme</h4>
        <div className="button-group">
          {boardThemes.map((bt) => (
            <button
              key={bt.value}
              className={`btn btn-sm ${boardTheme === bt.value ? 'active' : ''}`}
              onClick={() => handleBoardTheme(bt.value)}
            >
              {bt.label}
            </button>
          ))}
        </div>
      </div>

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
          <button className={`btn btn-secondary ${autoQueen ? 'active' : ''}`} onClick={onToggleAutoQueen}>
            Auto Queen
          </button>
        </div>
      </div>

      <div className="control-section">
        <div className="button-group">
          <button className="btn btn-secondary" onClick={handleCopyPGN} disabled={!pgn}>
            {copied ? 'Copied!' : 'Copy PGN'}
          </button>
          <button className="btn btn-secondary" onClick={handleDownloadPGN} disabled={!pgn}>
            Download PGN
          </button>
          <button className="btn btn-danger" onClick={onResign} disabled={!gameInProgress}>
            Resign
          </button>
        </div>
      </div>
    </div>
  )
}

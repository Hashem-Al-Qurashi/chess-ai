import { type GameMode, type Difficulty } from '../App'
import './GameControls.css'

interface GameControlsProps {
  gameMode: GameMode
  difficulty: Difficulty
  onNewGame: (mode: GameMode, difficulty?: Difficulty, color?: 'w' | 'b') => void
  onUndo: () => void
  onFlipBoard: () => void
  canUndo: boolean
}

export default function GameControls({
  gameMode,
  difficulty,
  onNewGame,
  onUndo,
  onFlipBoard,
  canUndo,
}: GameControlsProps) {
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
        <div className="button-group">
          <button className="btn btn-secondary" onClick={onUndo} disabled={!canUndo}>
            Undo
          </button>
          <button className="btn btn-secondary" onClick={onFlipBoard}>
            Flip Board
          </button>
        </div>
      </div>
    </div>
  )
}

import { Chess } from 'chess.js'
import { type GameMode } from '../App'
import { identifyOpening } from '../data/openings'
import './GameStatus.css'

interface GameStatusProps {
  game: Chess
  isThinking: boolean
  gameMode: GameMode
  playerColor: 'w' | 'b'
  moveHistory: string[]
  elapsed: number
}

function formatElapsed(ms: number): string {
  const totalSecs = Math.floor(ms / 1000)
  const mins = Math.floor(totalSecs / 60)
  const secs = totalSecs % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function GameStatus({ game, isThinking, gameMode, playerColor, moveHistory, elapsed }: GameStatusProps) {
  const openingName = identifyOpening(moveHistory)
  const moveNumber = Math.floor(moveHistory.length / 2) + 1

  const pieceCount = (() => {
    let w = 0, b = 0
    const board = game.board()
    for (const row of board) {
      for (const sq of row) {
        if (sq) {
          if (sq.color === 'w') w++
          else b++
        }
      }
    }
    return { w, b }
  })()
  const getStatus = (): string => {
    if (game.isCheckmate()) {
      const winner = game.turn() === 'w' ? 'Black' : 'White'
      return `Checkmate! ${winner} wins!`
    }
    if (game.isDraw()) {
      if (game.isStalemate()) return 'Stalemate — Draw!'
      if (game.isThreefoldRepetition()) return 'Threefold repetition — Draw!'
      if (game.isInsufficientMaterial()) return 'Insufficient material — Draw!'
      return 'Draw by 50-move rule!'
    }
    if (isThinking) return 'AI is thinking...'
    if (game.inCheck()) {
      return `${game.turn() === 'w' ? 'White' : 'Black'} is in check!`
    }

    const turn = game.turn() === 'w' ? 'White' : 'Black'
    if (gameMode === 'ai') {
      return game.turn() === playerColor ? 'Your turn' : `${turn} to move`
    }
    return `${turn} to move`
  }

  const statusClass = game.isGameOver()
    ? 'game-over'
    : game.inCheck()
      ? 'in-check'
      : isThinking
        ? 'thinking'
        : ''

  const turnIndicator = game.turn() === 'w' ? '\u25CB' : '\u25CF'

  return (
    <div className={`game-status ${statusClass}`}>
      <div className="status-main">
        {!game.isGameOver() && <span className="turn-dot">{turnIndicator}</span>}
        {getStatus()}
        {openingName && !game.isGameOver() && (
          <span className="opening-name"> — {openingName}</span>
        )}
      </div>
      {moveHistory.length > 0 && (
        <div className="status-meta">
          <span>Move {moveNumber}</span>
          <span className="status-divider">|</span>
          <span>{formatElapsed(elapsed)}</span>
          <span className="status-divider">|</span>
          <span className="piece-count">{pieceCount.w}v{pieceCount.b}</span>
          {moveHistory.length > 0 && (
            <>
              <span className="status-divider">|</span>
              <span className="last-move-san">{moveHistory[moveHistory.length - 1]}</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}

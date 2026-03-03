import { Chess } from 'chess.js'
import { type GameMode } from '../App'
import './GameOverModal.css'

interface GameOverModalProps {
  game: Chess
  gameMode: GameMode
  playerColor: 'w' | 'b'
  timeExpired: 'w' | 'b' | null
  resigned: 'w' | 'b' | null
  onPlayAgain: () => void
  onClose: () => void
}

export default function GameOverModal({ game, gameMode, playerColor, timeExpired, resigned, onPlayAgain, onClose }: GameOverModalProps) {
  const getResult = (): { title: string; subtitle: string; emoji: string } => {
    if (resigned) {
      const loser = resigned === 'w' ? 'White' : 'Black'
      const winner = resigned === 'w' ? 'Black' : 'White'
      if (gameMode === 'ai') {
        const youResigned = resigned === playerColor
        return {
          title: youResigned ? 'You Resigned' : 'You Win!',
          subtitle: `${loser} resigned. ${winner} wins!`,
          emoji: youResigned ? '🏳️' : '🏆',
        }
      }
      return {
        title: `${winner} Wins!`,
        subtitle: `${loser} resigned`,
        emoji: '🏳️',
      }
    }

    if (timeExpired) {
      const loser = timeExpired === 'w' ? 'White' : 'Black'
      const winner = timeExpired === 'w' ? 'Black' : 'White'
      if (gameMode === 'ai') {
        const youWon = timeExpired !== playerColor
        return {
          title: youWon ? 'You Win!' : 'You Lose',
          subtitle: `${loser} ran out of time. ${winner} wins!`,
          emoji: youWon ? '🏆' : '⏰',
        }
      }
      return {
        title: `${winner} Wins!`,
        subtitle: `${loser} ran out of time`,
        emoji: '⏰',
      }
    }

    if (game.isCheckmate()) {
      const winner = game.turn() === 'w' ? 'Black' : 'White'
      if (gameMode === 'ai') {
        const youWon = game.turn() !== playerColor
        return {
          title: youWon ? 'You Win!' : 'You Lose',
          subtitle: `Checkmate! ${winner} wins.`,
          emoji: youWon ? '🏆' : '💀',
        }
      }
      return {
        title: `${winner} Wins!`,
        subtitle: 'Checkmate!',
        emoji: '👑',
      }
    }

    if (game.isStalemate()) {
      return { title: 'Draw', subtitle: 'Stalemate — no legal moves', emoji: '🤝' }
    }
    if (game.isThreefoldRepetition()) {
      return { title: 'Draw', subtitle: 'Threefold repetition', emoji: '🔄' }
    }
    if (game.isInsufficientMaterial()) {
      return { title: 'Draw', subtitle: 'Insufficient material', emoji: '🤝' }
    }

    return { title: 'Draw', subtitle: '50-move rule', emoji: '🤝' }
  }

  const result = getResult()

  return (
    <div className="game-over-overlay" onClick={onClose}>
      <div className="game-over-modal" onClick={e => e.stopPropagation()}>
        <div className="result-emoji">{result.emoji}</div>
        <h2 className="result-title">{result.title}</h2>
        <p className="result-subtitle">{result.subtitle}</p>
        <div className="result-actions">
          <button className="btn-play-again" onClick={onPlayAgain}>
            Play Again
          </button>
          <button className="btn-review" onClick={onClose}>
            Review Game
          </button>
        </div>
      </div>
    </div>
  )
}

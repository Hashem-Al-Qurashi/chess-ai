import { Chess } from 'chess.js'
import { type GameMode } from '../App'
import './GameStatus.css'

interface GameStatusProps {
  game: Chess
  isThinking: boolean
  gameMode: GameMode
  playerColor: 'w' | 'b'
}

export default function GameStatus({ game, isThinking, gameMode, playerColor }: GameStatusProps) {
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

  return (
    <div className={`game-status ${statusClass}`}>
      {getStatus()}
    </div>
  )
}

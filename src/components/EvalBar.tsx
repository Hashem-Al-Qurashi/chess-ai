import { Chess } from 'chess.js'
import './EvalBar.css'

interface EvalBarProps {
  game: Chess
}

const pieceValues: Record<string, number> = {
  p: 1, n: 3, b: 3.2, r: 5, q: 9, k: 0,
}

function evaluate(game: Chess): number {
  if (game.isCheckmate()) return game.turn() === 'w' ? -99 : 99
  if (game.isDraw()) return 0

  let score = 0
  const board = game.board()
  for (const row of board) {
    for (const square of row) {
      if (square) {
        const val = pieceValues[square.type]
        score += square.color === 'w' ? val : -val
      }
    }
  }
  return score
}

function scoreToPercent(score: number): number {
  // Sigmoid-like mapping: score of 0 = 50%, +5 ~ 85%, -5 ~ 15%
  const clamped = Math.max(-10, Math.min(10, score))
  return 50 + (clamped / 10) * 45
}

export default function EvalBar({ game }: EvalBarProps) {
  const score = evaluate(game)
  const whitePercent = scoreToPercent(score)
  const displayScore = Math.abs(score).toFixed(1)
  const leader = score > 0.1 ? 'w' : score < -0.1 ? 'b' : null

  return (
    <div className="eval-bar" title={`${score > 0 ? '+' : ''}${score.toFixed(1)}`}>
      <div className="eval-white" style={{ height: `${whitePercent}%` }}>
        {leader === 'w' && <span className="eval-score">{displayScore}</span>}
      </div>
      <div className="eval-black" style={{ height: `${100 - whitePercent}%` }}>
        {leader === 'b' && <span className="eval-score">{displayScore}</span>}
      </div>
    </div>
  )
}

import { Chess } from 'chess.js'
import './CapturedPieces.css'

interface CapturedPiecesProps {
  game: Chess
}

const pieceUnicode: Record<string, Record<string, string>> = {
  w: { p: '\u2659', n: '\u2658', b: '\u2657', r: '\u2656', q: '\u2655' },
  b: { p: '\u265F', n: '\u265E', b: '\u265D', r: '\u265C', q: '\u265B' },
}

const pieceOrder = ['q', 'r', 'b', 'n', 'p']
const pieceValues: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 }

function getCapturedPieces(game: Chess) {
  const startingPieces: Record<string, number> = { p: 8, n: 2, b: 2, r: 2, q: 1 }
  const current = { w: { ...startingPieces }, b: { ...startingPieces } }

  const board = game.board()
  for (const row of board) {
    for (const square of row) {
      if (square && square.type !== 'k') {
        current[square.color][square.type]--
      }
    }
  }

  const captured: { w: string[]; b: string[] } = { w: [], b: [] }
  for (const color of ['w', 'b'] as const) {
    for (const piece of pieceOrder) {
      for (let i = 0; i < current[color][piece]; i++) {
        // If white pieces are missing, black captured them
        captured[color === 'w' ? 'b' : 'w'].push(pieceUnicode[color][piece])
      }
    }
  }

  return captured
}

function getMaterialAdvantage(game: Chess): number {
  let score = 0
  const board = game.board()
  for (const row of board) {
    for (const square of row) {
      if (square && square.type !== 'k') {
        score += square.color === 'w' ? pieceValues[square.type] : -pieceValues[square.type]
      }
    }
  }
  return score
}

export default function CapturedPieces({ game }: CapturedPiecesProps) {
  const captured = getCapturedPieces(game)
  const advantage = getMaterialAdvantage(game)

  return (
    <div className="captured-pieces">
      <div className="captured-row">
        <span className="captured-label">B</span>
        <span className="captured-list">
          {captured.b.length > 0 ? captured.b.join('') : '—'}
        </span>
        {advantage < 0 && <span className="advantage">+{Math.abs(advantage)}</span>}
      </div>
      <div className="captured-row">
        <span className="captured-label">W</span>
        <span className="captured-list">
          {captured.w.length > 0 ? captured.w.join('') : '—'}
        </span>
        {advantage > 0 && <span className="advantage">+{advantage}</span>}
      </div>
    </div>
  )
}

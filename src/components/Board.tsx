import { Chess, type Square } from 'chess.js'
import Piece from './Piece'
import './Board.css'

interface BoardProps {
  game: Chess
  selectedSquare: string | null
  legalMoves: string[]
  lastMove: { from: string; to: string } | null
  flipped: boolean
  onSquareClick: (square: string) => void
}

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']

export default function Board({
  game,
  selectedSquare,
  legalMoves,
  lastMove,
  flipped,
  onSquareClick,
}: BoardProps) {
  const displayRanks = flipped ? [...ranks].reverse() : ranks
  const displayFiles = flipped ? [...files].reverse() : files

  const isInCheck = game.inCheck()
  const kingSquare = isInCheck ? findKingSquare(game, game.turn()) : null

  return (
    <div className="board">
      {displayRanks.map((rank, rowIndex) =>
        displayFiles.map((file, colIndex) => {
          const square = `${file}${rank}`
          const piece = game.get(square as Square)
          const isLight = (rowIndex + colIndex) % 2 === 0
          const isSelected = square === selectedSquare
          const isLegal = legalMoves.includes(square)
          const isLastMove = lastMove && (square === lastMove.from || square === lastMove.to)
          const isKingInCheck = square === kingSquare

          const classNames = [
            'square',
            isLight ? 'light' : 'dark',
            isSelected ? 'selected' : '',
            isLastMove ? 'last-move' : '',
            isKingInCheck ? 'in-check' : '',
          ].filter(Boolean).join(' ')

          return (
            <div
              key={square}
              className={classNames}
              onClick={() => onSquareClick(square)}
            >
              {/* Coordinate labels */}
              {colIndex === 0 && (
                <span className="coord rank-label">{rank}</span>
              )}
              {rowIndex === 7 && (
                <span className="coord file-label">{file}</span>
              )}

              {/* Legal move indicator */}
              {isLegal && (
                <div className={piece ? 'capture-hint' : 'move-hint'} />
              )}

              {/* Piece */}
              {piece && (
                <Piece type={piece.type} color={piece.color} />
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

function findKingSquare(game: Chess, color: 'w' | 'b'): string | null {
  const board = game.board()
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.type === 'k' && piece.color === color) {
        return `${files[col]}${8 - row}`
      }
    }
  }
  return null
}

import './Piece.css'

interface PieceProps {
  type: string
  color: 'w' | 'b'
}

const pieceUnicode: Record<string, Record<string, string>> = {
  w: { k: '\u2654', q: '\u2655', r: '\u2656', b: '\u2657', n: '\u2658', p: '\u2659' },
  b: { k: '\u265A', q: '\u265B', r: '\u265C', b: '\u265D', n: '\u265E', p: '\u265F' },
}

export default function Piece({ type, color }: PieceProps) {
  return (
    <span className={`piece ${color === 'w' ? 'white-piece' : 'black-piece'}`}>
      {pieceUnicode[color][type]}
    </span>
  )
}

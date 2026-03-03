import Piece from './Piece'
import './PromotionModal.css'

interface PromotionModalProps {
  color: 'w' | 'b'
  onSelect: (piece: 'q' | 'r' | 'b' | 'n') => void
}

const pieces: Array<'q' | 'r' | 'b' | 'n'> = ['q', 'r', 'b', 'n']
const labels: Record<string, string> = { q: 'Queen', r: 'Rook', b: 'Bishop', n: 'Knight' }

export default function PromotionModal({ color, onSelect }: PromotionModalProps) {
  return (
    <div className="promotion-overlay">
      <div className="promotion-modal">
        <h3>Promote pawn to:</h3>
        <div className="promotion-options">
          {pieces.map((p) => (
            <button key={p} className="promotion-btn" onClick={() => onSelect(p)} title={labels[p]}>
              <Piece type={p} color={color} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

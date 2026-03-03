import { useEffect, useRef } from 'react'
import './MoveHistory.css'

interface MoveHistoryProps {
  moves: string[]
  currentMoveIndex: number
  onGoToMove: (index: number) => void
}

export default function MoveHistory({ moves, currentMoveIndex, onGoToMove }: MoveHistoryProps) {
  const listRef = useRef<HTMLDivElement>(null)

  const pairs: { number: number; white: string; black?: string; whiteIdx: number; blackIdx: number }[] = []

  for (let i = 0; i < moves.length; i += 2) {
    pairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
      whiteIdx: i,
      blackIdx: i + 1,
    })
  }

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [moves.length])

  return (
    <div className="move-history">
      <h3>Moves</h3>
      <div className="moves-list" ref={listRef}>
        {pairs.length === 0 ? (
          <p className="no-moves">No moves yet</p>
        ) : (
          pairs.map((pair) => (
            <div key={pair.number} className="move-pair">
              <span className="move-number">{pair.number}.</span>
              <span
                className={`move white-move ${pair.whiteIdx === currentMoveIndex ? 'active-move' : ''}`}
                onClick={() => onGoToMove(pair.whiteIdx)}
              >
                {pair.white}
              </span>
              <span
                className={`move black-move ${pair.black && pair.blackIdx === currentMoveIndex ? 'active-move' : ''}`}
                onClick={() => pair.black && onGoToMove(pair.blackIdx)}
              >
                {pair.black || ''}
              </span>
            </div>
          ))
        )}
      </div>
      {moves.length > 0 && (
        <div className="move-nav">
          <button className="nav-btn" onClick={() => onGoToMove(-1)} disabled={currentMoveIndex === -1} title="Start">
            &laquo;
          </button>
          <button className="nav-btn" onClick={() => onGoToMove(currentMoveIndex - 1)} disabled={currentMoveIndex <= -1} title="Previous">
            &lsaquo;
          </button>
          <button className="nav-btn" onClick={() => onGoToMove(currentMoveIndex + 1)} disabled={currentMoveIndex >= moves.length - 1} title="Next">
            &rsaquo;
          </button>
          <button className="nav-btn" onClick={() => onGoToMove(moves.length - 1)} disabled={currentMoveIndex === moves.length - 1} title="Latest">
            &raquo;
          </button>
        </div>
      )}
    </div>
  )
}

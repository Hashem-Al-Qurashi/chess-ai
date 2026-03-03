import './MoveHistory.css'

interface MoveHistoryProps {
  moves: string[]
}

export default function MoveHistory({ moves }: MoveHistoryProps) {
  const pairs: { number: number; white: string; black?: string }[] = []

  for (let i = 0; i < moves.length; i += 2) {
    pairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
    })
  }

  return (
    <div className="move-history">
      <h3>Moves</h3>
      <div className="moves-list">
        {pairs.length === 0 ? (
          <p className="no-moves">No moves yet</p>
        ) : (
          pairs.map((pair) => (
            <div key={pair.number} className="move-pair">
              <span className="move-number">{pair.number}.</span>
              <span className="move white-move">{pair.white}</span>
              <span className="move black-move">{pair.black || ''}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

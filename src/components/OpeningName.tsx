import { useMemo } from 'react'
import { ecoOpenings } from '../data/eco'
import './OpeningName.css'

interface OpeningNameProps {
  pgn: string
}

export default function OpeningName({ pgn }: OpeningNameProps) {
  const opening = useMemo(() => {
    if (!pgn) return null
    const normalized = pgn.replace(/\d+\.\s*/g, '').trim()
    let best: { eco: string; name: string } | null = null
    let bestLen = 0

    for (const entry of ecoOpenings) {
      const entryMoves = entry.moves.replace(/\d+\.\s*/g, '').trim()
      if (normalized.startsWith(entryMoves) && entryMoves.length > bestLen) {
        best = { eco: entry.eco, name: entry.name }
        bestLen = entryMoves.length
      }
    }
    return best
  }, [pgn])

  if (!opening) return null

  return (
    <div className="opening-name">
      <span className="opening-eco">{opening.eco}</span>
      <span className="opening-label">{opening.name}</span>
    </div>
  )
}

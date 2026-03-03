import { useMemo } from 'react'
import { chessQuotes } from '../data/quotes'
import './DailyTip.css'

export default function DailyTip() {
  const quote = useMemo(() => {
    const day = Math.floor(Date.now() / 86400000)
    return chessQuotes[day % chessQuotes.length]
  }, [])

  return (
    <div className="daily-tip">
      <p className="tip-text">"{quote.text}"</p>
      <span className="tip-author">— {quote.author}</span>
    </div>
  )
}

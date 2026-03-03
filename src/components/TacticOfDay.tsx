import { useMemo } from 'react'
import { tacticalPatterns } from '../data/tactics'
import './TacticOfDay.css'

export default function TacticOfDay() {
  const tactic = useMemo(() => {
    const day = Math.floor(Date.now() / 86400000)
    return tacticalPatterns[day % tacticalPatterns.length]
  }, [])

  return (
    <div className="tactic-of-day">
      <h4 className="tactic-header">Tactic of the Day</h4>
      <p className="tactic-name">{tactic.name}</p>
      <p className="tactic-desc">{tactic.description}</p>
    </div>
  )
}

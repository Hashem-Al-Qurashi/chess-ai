import { usePersistedState } from '../hooks/usePersistedState'
import './GamesPlayed.css'

export default function GamesPlayed() {
  const [count] = usePersistedState('chess-games-played', 0)

  if (count === 0) return null

  return (
    <div className="games-played">
      <span className="gp-label">Games played</span>
      <span className="gp-count">{count}</span>
    </div>
  )
}

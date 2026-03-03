import './GameStats.css'

interface GameStatsProps {
  wins: number
  losses: number
  draws: number
}

export default function GameStats({ wins, losses, draws }: GameStatsProps) {
  const total = wins + losses + draws
  if (total === 0) return null

  return (
    <div className="game-stats">
      <h4>Session Record</h4>
      <div className="stats-row">
        <div className="stat win">
          <span className="stat-value">{wins}</span>
          <span className="stat-label">W</span>
        </div>
        <div className="stat draw">
          <span className="stat-value">{draws}</span>
          <span className="stat-label">D</span>
        </div>
        <div className="stat loss">
          <span className="stat-value">{losses}</span>
          <span className="stat-label">L</span>
        </div>
      </div>
    </div>
  )
}

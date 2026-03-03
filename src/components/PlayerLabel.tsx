import './PlayerLabel.css'

interface PlayerLabelProps {
  color: 'w' | 'b'
  isActive: boolean
  label: string
  isAI?: boolean
}

export default function PlayerLabel({ color, isActive, label, isAI }: PlayerLabelProps) {
  return (
    <div className={`player-label ${isActive ? 'active' : ''}`}>
      <span className={`player-dot ${color === 'w' ? 'white-dot' : 'black-dot'}`} />
      <span className="player-name">{label}</span>
      {isAI && <span className="player-badge">AI</span>}
    </div>
  )
}

import { useState } from 'react'
import { Chess } from 'chess.js'
import './FenLoader.css'

interface FenLoaderProps {
  currentFen: string
  onLoadFen: (fen: string) => void
}

export default function FenLoader({ currentFen, onLoadFen }: FenLoaderProps) {
  const [fen, setFen] = useState('')
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(false)

  const handleLoad = () => {
    const trimmed = fen.trim()
    if (!trimmed) return
    try {
      new Chess(trimmed)
      onLoadFen(trimmed)
      setFen('')
      setError('')
      setExpanded(false)
    } catch {
      setError('Invalid FEN string')
    }
  }

  const handleCopyFen = async () => {
    await navigator.clipboard.writeText(currentFen)
  }

  if (!expanded) {
    return (
      <button className="btn btn-secondary full-width fen-toggle" onClick={() => setExpanded(true)}>
        Load Position (FEN)
      </button>
    )
  }

  return (
    <div className="fen-loader">
      <input
        type="text"
        className="fen-input"
        placeholder="Paste FEN string..."
        value={fen}
        onChange={(e) => { setFen(e.target.value); setError('') }}
        onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
      />
      {error && <span className="fen-error">{error}</span>}
      <div className="fen-actions">
        <button className="btn btn-sm" onClick={handleLoad}>Load</button>
        <button className="btn btn-sm btn-secondary" onClick={handleCopyFen}>Copy Current</button>
        <button className="btn btn-sm btn-secondary" onClick={() => setExpanded(false)}>Cancel</button>
      </div>
    </div>
  )
}

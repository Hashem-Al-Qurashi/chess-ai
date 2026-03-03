import { useState } from 'react'
import { Chess } from 'chess.js'
import './FenLoader.css'

interface FenLoaderProps {
  currentFen: string
  onLoadFen: (fen: string) => void
  onLoadPgn?: (pgn: string) => void
}

export default function FenLoader({ currentFen, onLoadFen, onLoadPgn }: FenLoaderProps) {
  const [fen, setFen] = useState('')
  const [pgnInput, setPgnInput] = useState('')
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [mode, setMode] = useState<'fen' | 'pgn'>('fen')

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

  const handleLoadPgn = () => {
    const trimmed = pgnInput.trim()
    if (!trimmed || !onLoadPgn) return
    try {
      const test = new Chess()
      test.loadPgn(trimmed)
      onLoadPgn(trimmed)
      setPgnInput('')
      setError('')
      setExpanded(false)
    } catch {
      setError('Invalid PGN')
    }
  }

  const handleCopyFen = async () => {
    await navigator.clipboard.writeText(currentFen)
  }

  if (!expanded) {
    return (
      <button className="btn btn-secondary full-width fen-toggle" onClick={() => setExpanded(true)}>
        Load Position
      </button>
    )
  }

  return (
    <div className="fen-loader">
      <div className="loader-tabs">
        <button className={`loader-tab ${mode === 'fen' ? 'active' : ''}`} onClick={() => { setMode('fen'); setError('') }}>FEN</button>
        <button className={`loader-tab ${mode === 'pgn' ? 'active' : ''}`} onClick={() => { setMode('pgn'); setError('') }}>PGN</button>
      </div>
      {mode === 'fen' ? (
        <input
          type="text"
          className="fen-input"
          placeholder="Paste FEN string..."
          value={fen}
          onChange={(e) => { setFen(e.target.value); setError('') }}
          onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
        />
      ) : (
        <textarea
          className="fen-input pgn-textarea"
          placeholder="Paste PGN..."
          value={pgnInput}
          onChange={(e) => { setPgnInput(e.target.value); setError('') }}
          rows={3}
        />
      )}
      {error && <span className="fen-error">{error}</span>}
      <div className="fen-actions">
        <button className="btn btn-sm" onClick={mode === 'fen' ? handleLoad : handleLoadPgn}>Load</button>
        {mode === 'fen' && <button className="btn btn-sm btn-secondary" onClick={handleCopyFen}>Copy Current</button>}
        <button className="btn btn-sm btn-secondary" onClick={() => setExpanded(false)}>Cancel</button>
      </div>
    </div>
  )
}

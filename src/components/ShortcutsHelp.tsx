import { useState } from 'react'
import './ShortcutsHelp.css'

const shortcuts = [
  { key: '←', action: 'Previous move' },
  { key: '→', action: 'Next move' },
  { key: 'Home', action: 'Go to start' },
  { key: 'End', action: 'Go to latest' },
  { key: 'U', action: 'Undo move' },
  { key: 'F', action: 'Flip board' },
]

export default function ShortcutsHelp() {
  const [open, setOpen] = useState(false)

  return (
    <div className="shortcuts-help">
      <button
        className="btn btn-secondary btn-sm shortcuts-toggle"
        onClick={() => setOpen(!open)}
      >
        {open ? 'Hide Shortcuts' : 'Keyboard Shortcuts'}
      </button>
      {open && (
        <div className="shortcuts-list">
          {shortcuts.map(({ key, action }) => (
            <div key={key} className="shortcut-row">
              <kbd className="shortcut-key">{key}</kbd>
              <span className="shortcut-action">{action}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

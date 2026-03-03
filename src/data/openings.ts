interface Opening {
  moves: string[]
  name: string
}

const openings: Opening[] = [
  // King's Pawn
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'], name: 'Ruy Lopez' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'], name: 'Italian Game' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4'], name: 'Scotch Game' },
  { moves: ['e4', 'e5', 'Nf3', 'Nf6'], name: 'Petrov Defense' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6'], name: 'Two Knights Defense' },
  { moves: ['e4', 'e5', 'f4'], name: "King's Gambit" },
  { moves: ['e4', 'e5', 'Bc4'], name: "Bishop's Opening" },
  { moves: ['e4', 'e5', 'Nc3'], name: 'Vienna Game' },

  // Sicilian
  { moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3'], name: 'Sicilian Najdorf' },
  { moves: ['e4', 'c5', 'Nf3', 'Nc6', 'd4'], name: 'Sicilian Open' },
  { moves: ['e4', 'c5', 'Nf3', 'e6'], name: 'Sicilian Kan' },
  { moves: ['e4', 'c5', 'c3'], name: 'Sicilian Alapin' },
  { moves: ['e4', 'c5'], name: 'Sicilian Defense' },

  // French & Caro-Kann
  { moves: ['e4', 'e6', 'd4', 'd5'], name: 'French Defense' },
  { moves: ['e4', 'c6', 'd4', 'd5'], name: 'Caro-Kann Defense' },

  // Queen's Pawn
  { moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6'], name: "Queen's Gambit Declined" },
  { moves: ['d4', 'd5', 'c4', 'dxc4'], name: "Queen's Gambit Accepted" },
  { moves: ['d4', 'd5', 'c4'], name: "Queen's Gambit" },
  { moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7'], name: "King's Indian Defense" },
  { moves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4'], name: 'Nimzo-Indian Defense' },
  { moves: ['d4', 'Nf6', 'c4', 'e6', 'g3'], name: 'Catalan Opening' },
  { moves: ['d4', 'Nf6', 'c4', 'c5'], name: 'Benoni Defense' },
  { moves: ['d4', 'Nf6', 'c4', 'g6'], name: "King's Indian Setup" },
  { moves: ['d4', 'Nf6', 'Nf3', 'g6', 'c4'], name: "King's Indian Attack" },
  { moves: ['d4', 'f5'], name: 'Dutch Defense' },

  // Others
  { moves: ['e4', 'd5'], name: 'Scandinavian Defense' },
  { moves: ['e4', 'Nf6'], name: "Alekhine's Defense" },
  { moves: ['e4', 'g6'], name: 'Modern Defense' },
  { moves: ['e4', 'd6'], name: 'Pirc Defense' },
  { moves: ['Nf3'], name: 'Reti Opening' },
  { moves: ['c4'], name: 'English Opening' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6'], name: "King's Knight Opening" },
  { moves: ['e4', 'e5'], name: "King's Pawn Game" },
  { moves: ['d4', 'd5'], name: "Queen's Pawn Game" },
  { moves: ['d4', 'Nf6'], name: 'Indian Defense' },
]

// Sort by longest move sequence first so we match the most specific opening
const sortedOpenings = [...openings].sort((a, b) => b.moves.length - a.moves.length)

export function identifyOpening(moveHistory: string[]): string | null {
  if (moveHistory.length === 0) return null

  for (const opening of sortedOpenings) {
    if (opening.moves.length > moveHistory.length) continue

    let matches = true
    for (let i = 0; i < opening.moves.length; i++) {
      if (moveHistory[i] !== opening.moves[i]) {
        matches = false
        break
      }
    }

    if (matches) return opening.name
  }

  return null
}

export interface ChessPrinciple {
  category: string
  tip: string
}

export const chessPrinciples: ChessPrinciple[] = [
  { category: "Opening", tip: "Control the center with pawns e4/d4" },
  { category: "Opening", tip: "Develop knights before bishops" },
  { category: "Opening", tip: "Castle early for king safety" },
  { category: "Opening", tip: "Don't move the same piece twice in the opening" },
  { category: "Opening", tip: "Don't bring the queen out too early" },
  { category: "Opening", tip: "Connect your rooks" },
  { category: "Opening", tip: "Fight for the center even with flank openings" },
  { category: "Middlegame", tip: "Create and exploit weak squares" },
  { category: "Middlegame", tip: "Place rooks on open files" },
  { category: "Middlegame", tip: "Knights are better in closed positions" },
  { category: "Middlegame", tip: "Bishops are better in open positions" },
  { category: "Middlegame", tip: "Avoid pawn islands" },
  { category: "Middlegame", tip: "Double rooks on open files" },
  { category: "Middlegame", tip: "Trade pieces when ahead in material" },
  { category: "Middlegame", tip: "Create passed pawns" },
  { category: "Middlegame", tip: "Restrict the opponent's pieces" },
  { category: "Middlegame", tip: "Look for tactical motifs: pins, forks, skewers" },
  { category: "Middlegame", tip: "Control key diagonals with bishops" },
  { category: "Endgame", tip: "King becomes an active piece in the endgame" },
]

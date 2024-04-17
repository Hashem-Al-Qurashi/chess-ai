export interface Endgame {
  name: string
  fen: string
}

export const endgamePositions: Endgame[] = [
  { name: "King and Queen vs King", fen: "4k3/8/8/8/8/8/8/4K2Q w - - 0 1" },
  { name: "King and Rook vs King", fen: "4k3/8/8/8/8/8/8/4K2R w - - 0 1" },
  { name: "King and 2 Bishops vs King", fen: "4k3/8/8/8/8/8/8/2B1KB2 w - - 0 1" },
  { name: "King and Pawn vs King", fen: "4k3/8/8/8/8/8/4P3/4K3 w - - 0 1" },
  { name: "Lucena Position", fen: "1K1k4/1P6/8/8/8/8/r7/2R5 w - - 0 1" },
]

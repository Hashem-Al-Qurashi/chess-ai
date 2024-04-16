export interface Endgame {
  name: string
  fen: string
}

export const endgamePositions: Endgame[] = [
  { name: "King and Queen vs King", fen: "4k3/8/8/8/8/8/8/4K2Q w - - 0 1" },
  { name: "King and Rook vs King", fen: "4k3/8/8/8/8/8/8/4K2R w - - 0 1" },
]

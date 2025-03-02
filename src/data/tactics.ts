export interface TacticalPattern {
  name: string
  description: string
}

export const tacticalPatterns: TacticalPattern[] = [
  { name: "Bishop Pair Advantage", description: "Using two bishops' long-range diagonal control in open positions" },
  { name: "Rook on the Seventh Rank", description: "A rook on the seventh rank attacking pawns and restricting the enemy king" },
]

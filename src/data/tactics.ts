export interface TacticalPattern {
  name: string
  description: string
}

export const tacticalPatterns: TacticalPattern[] = [
  { name: "Bishop Pair Advantage", description: "Using two bishops' long-range diagonal control in open positions" },
  { name: "Rook on the Seventh Rank", description: "A rook on the seventh rank attacking pawns and restricting the enemy king" },
  { name: "Overloading", description: "Giving a piece too many defensive tasks so it cannot handle all of them" },
  { name: "Desperado", description: "A piece that is going to be captured anyway captures as much as possible first" },
  { name: "Zwischenzug", description: "An intermediate move played before the expected recapture or continuation" },
  { name: "Exchange Sacrifice", description: "Giving up a rook for a minor piece to gain positional or tactical compensation" },
  { name: "Blockade", description: "Placing a piece in front of an enemy pawn to prevent its advance" },
  { name: "Pin", description: "An attacked piece cannot move without exposing a more valuable piece behind it" },
  { name: "Stalemate Trap", description: "Setting up a position where the opponent has no legal moves but is not in check" },
  { name: "Fianchetto", description: "Developing a bishop to the long diagonal via b2/g2 or b7/g7" },
  { name: "Decoy", description: "Luring an enemy piece to a square where it becomes vulnerable" },
  { name: "Undermining", description: "Removing the defender of a key piece or square" },
  { name: "Backward Pawn", description: "A pawn that cannot be supported by adjacent pawns and is on a semi-open file" },
  { name: "Tempo", description: "Gaining or losing a move in development or initiative" },
  { name: "Windmill", description: "A repeating pattern of discovered checks that wins material" },
  { name: "Semi-Open File", description: "A file with only enemy pawns, useful for attacking those pawns with rooks" },
  { name: "Weak Color Complex", description: "Exploiting squares of one color when the opponent's same-colored bishop is absent" },
]

export interface FamousGame {
  year: number
  white: string
  black: string
  name: string
}

export const famousGames: FamousGame[] = [
  { year: 1851, white: "Anderssen", black: "Kieseritzky", name: "The Immortal Game" },
  { year: 1852, white: "Anderssen", black: "Dufresne", name: "The Evergreen Game" },
  { year: 1858, white: "Morphy", black: "Duke of Brunswick", name: "The Opera Game" },
  { year: 1895, white: "Steinitz", black: "Von Bardeleben", name: "Steinitz Immortal" },
  { year: 1912, white: "Levitsky", black: "Marshall", name: "The Gold Coins Game" },
  { year: 1918, white: "Rotlewi", black: "Rubinstein", name: "Rubinstein's Immortal" },
  { year: 1925, white: "Torre", black: "Lasker", name: "Torre's Immortal" },
]

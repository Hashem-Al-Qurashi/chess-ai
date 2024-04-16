export interface FamousGame {
  year: number
  white: string
  black: string
  name: string
}

export const famousGames: FamousGame[] = [
  { year: 1851, white: "Anderssen", black: "Kieseritzky", name: "The Immortal Game" },
  { year: 1852, white: "Anderssen", black: "Dufresne", name: "The Evergreen Game" },
]

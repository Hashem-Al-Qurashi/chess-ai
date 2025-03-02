export interface EcoOpening {
  eco: string
  name: string
  moves: string
}

export const ecoOpenings: EcoOpening[] = [
  { eco: "E94", name: "King's Indian: Orthodox Variation", moves: "1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Nf3 O-O 6.Be2 e5 7.O-O" },
  { eco: "C47", name: "Four Knights Game", moves: "1.e4 e5 2.Nf3 Nc6 3.Nc3 Nf6" },
  { eco: "B22", name: "Sicilian: Alapin Variation", moves: "1.e4 c5 2.c3" },
  { eco: "B87", name: "Sicilian: Najdorf, Sozin Attack", moves: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Bc4" },
]

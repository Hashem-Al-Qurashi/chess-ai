# Chess AI

A modern web-based chess game with an AI opponent powered by the minimax algorithm with alpha-beta pruning.

**[Live Demo](https://chess-ai-hashem.vercel.app)**

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript) ![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite) ![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## Features

- **2-Player Local Play** — Play against a friend on the same device
- **AI Opponent** — Three difficulty levels (Easy, Medium, Hard)
- **Smart AI** — Minimax algorithm with alpha-beta pruning at depth 3
- **Full Chess Rules** — Castling, en passant, pawn promotion, check/checkmate/stalemate detection
- **Move Highlighting** — Legal moves shown on click, last move highlighted
- **Move History** — Algebraic notation sidebar
- **Board Controls** — Flip board, undo moves, play as white or black
- **Responsive** — Works on desktop and mobile
- **Check Alerts** — Visual feedback when king is in check

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript |
| Build | Vite |
| Chess Logic | chess.js |
| AI Engine | Custom minimax with alpha-beta pruning |
| Styling | Custom CSS (no framework) |
| Deploy | Vercel |

## Getting Started

```bash
git clone https://github.com/Hashem-Al-Qurashi/chess-ai.git
cd chess-ai
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## How the AI Works

The AI uses a **minimax algorithm** with **alpha-beta pruning** for efficient move search:

- **Easy**: Random legal moves
- **Medium**: Prefers captures and checks with randomness
- **Hard**: Depth-3 minimax search with positional evaluation

The evaluation function considers:
- Material balance (standard piece values)
- Center control bonus for pawns and knights
- Checkmate detection

## Project Structure

```
src/
├── App.tsx              # Main game logic, AI engine
├── components/
│   ├── Board.tsx        # 8x8 chess board rendering
│   ├── Piece.tsx        # Unicode piece rendering
│   ├── GameControls.tsx # New game, difficulty, undo
│   ├── GameStatus.tsx   # Turn indicator, check/mate alerts
│   └── MoveHistory.tsx  # Algebraic notation move list
└── index.css            # Global styles
```

## Contributing

Contributions welcome! Open an issue or submit a PR.

## License

MIT

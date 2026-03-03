# Chess AI

A feature-rich web-based chess game with an AI opponent powered by the minimax algorithm with alpha-beta pruning. Built with React, TypeScript, and modern web technologies.

**[Play Now](https://hashem-al-qurashi.github.io/chess-ai/)**

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript) ![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite) ![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## Features

### Gameplay
- **2-Player Local Play** — Play against a friend on the same device
- **AI Opponent** — Three difficulty levels (Easy, Medium, Hard)
- **Smart AI** — Minimax algorithm with alpha-beta pruning at depth 3
- **Full Chess Rules** — Castling, en passant, pawn promotion, check/checkmate/stalemate/draw detection
- **Drag & Drop** — Move pieces by dragging or clicking
- **Pawn Promotion** — Choose Queen, Rook, Bishop, or Knight via modal

### Interface
- **Evaluation Bar** — Visual material advantage indicator beside the board
- **Move History** — Clickable algebraic notation with navigation buttons
- **Captured Pieces** — Shows captured material with advantage count
- **Opening Book** — Identifies 30+ chess openings by name (Sicilian, Ruy Lopez, etc.)
- **Game Over Modal** — Animated result display with play again option
- **Move Counter & Clock** — Shows current move number and elapsed time

### Controls
- **Chess Timers** — Bullet (1min), Blitz (3min), Rapid (10min), Classical (30min)
- **Board Themes** — 5 color schemes (Walnut, Classic, Green, Blue, Purple)
- **Dark/Light Mode** — Full app theme toggle
- **Sound Effects** — Synthesized sounds for moves, captures, checks, and game over
- **Keyboard Shortcuts** — Arrow keys for move navigation, U to undo, F to flip
- **PGN Export** — Copy game in standard PGN format to clipboard
- **Session Stats** — Win/Loss/Draw record tracker

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript |
| Build | Vite 7 |
| Chess Logic | chess.js |
| AI Engine | Custom minimax with alpha-beta pruning |
| Sound | Web Audio API (no external files) |
| Styling | Custom CSS with CSS custom properties |
| Deploy | GitHub Pages |

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
- **Medium**: Prefers captures and checks with 70% probability, random otherwise
- **Hard**: Depth-3 minimax search with positional evaluation

The evaluation function considers:
- Material balance (standard piece values: P=1, N=3, B=3.2, R=5, Q=9)
- Center control bonus for pawns and knights
- Checkmate/draw detection with extreme score values

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Left Arrow | Previous move |
| Right Arrow | Next move |
| Home | Go to start |
| End | Go to latest |
| U | Undo move |
| F | Flip board |

## Project Structure

```
src/
├── App.tsx                    # Main game logic, AI engine (minimax)
├── App.css                    # Layout styles
├── index.css                  # Theme variables, board themes
├── components/
│   ├── Board.tsx              # 8x8 board with drag-and-drop
│   ├── Piece.tsx              # Unicode chess piece rendering
│   ├── GameControls.tsx       # Settings panel (mode, difficulty, themes, timer)
│   ├── GameStatus.tsx         # Turn indicator, opening name, move counter
│   ├── MoveHistory.tsx        # Clickable move list with navigation
│   ├── ChessTimer.tsx         # Per-player countdown timer display
│   ├── CapturedPieces.tsx     # Captured pieces with material advantage
│   ├── EvalBar.tsx            # Vertical evaluation bar
│   ├── GameOverModal.tsx      # Animated game result modal
│   ├── GameStats.tsx          # Session W/D/L tracker
│   └── PromotionModal.tsx     # Pawn promotion piece selector
├── hooks/
│   ├── useSound.ts            # Web Audio API sound synthesis
│   ├── useTheme.ts            # Dark/light theme with localStorage
│   ├── useChessTimer.ts       # Chess clock logic
│   ├── useGameClock.ts        # Total elapsed time tracker
│   └── useKeyboardShortcuts.ts # Keyboard event handler
└── data/
    └── openings.ts            # Chess opening identification database
```

## Contributing

Contributions welcome! Open an issue or submit a PR.

## License

MIT

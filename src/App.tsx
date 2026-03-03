import { useState, useCallback, useEffect } from 'react'
import { Chess } from 'chess.js'
import Board from './components/Board'
import MoveHistory from './components/MoveHistory'
import GameControls from './components/GameControls'
import GameStatus from './components/GameStatus'
import PromotionModal from './components/PromotionModal'
import CapturedPieces from './components/CapturedPieces'
import ChessTimer from './components/ChessTimer'
import { useSound } from './hooks/useSound'
import { useTheme } from './hooks/useTheme'
import { useChessTimer, type TimeControl } from './hooks/useChessTimer'
import './App.css'

export type GameMode = 'local' | 'ai'
export type Difficulty = 'easy' | 'medium' | 'hard'

function App() {
  const [game, setGame] = useState(new Chess())
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [legalMoves, setLegalMoves] = useState<string[]>([])
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [gameMode, setGameMode] = useState<GameMode>('local')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w')
  const [isThinking, setIsThinking] = useState(false)
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null)
  const [boardFlipped, setBoardFlipped] = useState(false)
  const [pendingPromotion, setPendingPromotion] = useState<{ from: string; to: string; color: 'w' | 'b' } | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const sound = useSound()
  const { theme, toggleTheme } = useTheme()
  const { timerState, startTimer, switchTurn, pauseTimer, resetTimer } = useChessTimer()

  const playMoveSound = useCallback((game: Chess, captured: boolean) => {
    if (game.isCheckmate() || game.isDraw()) {
      sound.playGameOver()
      pauseTimer()
    } else if (game.inCheck()) {
      sound.playCheck()
    } else if (captured) {
      sound.playCapture()
    } else {
      sound.playMove()
    }
  }, [sound, pauseTimer])

  const makeAIMove = useCallback((currentGame: Chess) => {
    if (currentGame.isGameOver()) return

    setIsThinking(true)

    setTimeout(() => {
      const moves = currentGame.moves({ verbose: true })
      if (moves.length === 0) {
        setIsThinking(false)
        return
      }

      let selectedMove

      if (difficulty === 'easy') {
        selectedMove = moves[Math.floor(Math.random() * moves.length)]
      } else if (difficulty === 'medium') {
        const captureMoves = moves.filter(m => m.captured)
        const checkMoves = moves.filter(m => m.san.includes('+'))
        const goodMoves = [...captureMoves, ...checkMoves]
        selectedMove = goodMoves.length > 0 && Math.random() > 0.3
          ? goodMoves[Math.floor(Math.random() * goodMoves.length)]
          : moves[Math.floor(Math.random() * moves.length)]
      } else {
        selectedMove = getBestMove(currentGame, 3)
      }

      const captured = !!selectedMove.captured
      currentGame.move(selectedMove)
      setGame(new Chess(currentGame.fen()))
      setMoveHistory(prev => [...prev, selectedMove.san])
      setLastMove({ from: selectedMove.from, to: selectedMove.to })
      playMoveSound(currentGame, captured)
      if (!currentGame.isGameOver()) {
        switchTurn(currentGame.turn())
      }
      setIsThinking(false)
    }, 500)
  }, [difficulty, playMoveSound, switchTurn])

  const handleSquareClick = useCallback((square: string) => {
    if (isThinking) return
    if (timerState.isExpired) return
    if (gameMode === 'ai' && game.turn() !== playerColor) return

    if (selectedSquare) {
      const move = game.moves({ square: selectedSquare as any, verbose: true })
        .find(m => m.to === square)

      if (move) {
        if (move.piece === 'p' && (move.to[1] === '8' || move.to[1] === '1')) {
          setPendingPromotion({ from: move.from, to: move.to, color: game.turn() })
          setSelectedSquare(null)
          setLegalMoves([])
          return
        }

        const newGame = new Chess(game.fen())
        const result = newGame.move(move)

        if (result) {
          setGame(newGame)
          setMoveHistory(prev => [...prev, result.san])
          setLastMove({ from: move.from, to: move.to })
          playMoveSound(newGame, !!move.captured)
          if (!newGame.isGameOver()) {
            switchTurn(newGame.turn())
          }
          setSelectedSquare(null)
          setLegalMoves([])

          if (gameMode === 'ai' && !newGame.isGameOver()) {
            makeAIMove(newGame)
          }
          return
        }
      }

      const piece = game.get(square as any)
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square)
        const moves = game.moves({ square: square as any, verbose: true })
        setLegalMoves(moves.map(m => m.to))
        return
      }

      setSelectedSquare(null)
      setLegalMoves([])
      return
    }

    const piece = game.get(square as any)
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square)
      const moves = game.moves({ square: square as any, verbose: true })
      setLegalMoves(moves.map(m => m.to))
    }
  }, [game, selectedSquare, isThinking, gameMode, playerColor, makeAIMove, switchTurn, timerState.isExpired])

  const handleNewGame = useCallback((mode: GameMode, diff?: Difficulty, color?: 'w' | 'b') => {
    const newGame = new Chess()
    setGame(newGame)
    setSelectedSquare(null)
    setLegalMoves([])
    setMoveHistory([])
    setLastMove(null)
    setIsThinking(false)
    setGameMode(mode)
    if (diff) setDifficulty(diff)
    if (color) {
      setPlayerColor(color)
      setBoardFlipped(color === 'b')
    }
    resetTimer()

    if (mode === 'ai' && color === 'b') {
      makeAIMove(newGame)
    }
  }, [makeAIMove, resetTimer])

  const handleUndo = useCallback(() => {
    const newGame = new Chess(game.fen())
    newGame.undo()
    if (gameMode === 'ai') newGame.undo()
    setGame(newGame)
    setMoveHistory(prev => gameMode === 'ai' ? prev.slice(0, -2) : prev.slice(0, -1))
    setSelectedSquare(null)
    setLegalMoves([])
    setLastMove(null)
  }, [game, gameMode])

  const handlePromotion = useCallback((piece: 'q' | 'r' | 'b' | 'n') => {
    if (!pendingPromotion) return
    const newGame = new Chess(game.fen())
    const result = newGame.move({ from: pendingPromotion.from, to: pendingPromotion.to, promotion: piece })
    if (result) {
      setGame(newGame)
      setMoveHistory(prev => [...prev, result.san])
      setLastMove({ from: pendingPromotion.from, to: pendingPromotion.to })
      playMoveSound(newGame, !!result.captured)
      if (!newGame.isGameOver()) {
        switchTurn(newGame.turn())
      }
      if (gameMode === 'ai' && !newGame.isGameOver()) {
        makeAIMove(newGame)
      }
    }
    setPendingPromotion(null)
  }, [pendingPromotion, game, playMoveSound, gameMode, makeAIMove, switchTurn])

  const handleTimeControl = useCallback((tc: TimeControl) => {
    startTimer(tc)
  }, [startTimer])

  const handleFlipBoard = useCallback(() => {
    setBoardFlipped(prev => !prev)
  }, [])

  // Start timer on first move
  useEffect(() => {
    if (moveHistory.length === 1 && timerState.timeControl !== 'none' && timerState.activeColor === null && !timerState.isExpired) {
      switchTurn(game.turn())
    }
  }, [moveHistory.length, timerState.timeControl, timerState.activeColor, timerState.isExpired, switchTurn, game])

  return (
    <div className="app">
      <div className="header">
        <h1 className="title">Chess AI</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>
      <div className="game-container">
        <div className="board-section">
          <GameStatus
            game={game}
            isThinking={isThinking}
            gameMode={gameMode}
            playerColor={playerColor}
          />
          <ChessTimer timerState={timerState} flipped={boardFlipped} />
          <CapturedPieces game={game} />
          <Board
            game={game}
            selectedSquare={selectedSquare}
            legalMoves={legalMoves}
            lastMove={lastMove}
            flipped={boardFlipped}
            onSquareClick={handleSquareClick}
          />
        </div>
        <div className="side-panel">
          <GameControls
            gameMode={gameMode}
            difficulty={difficulty}
            soundEnabled={soundEnabled}
            timeControl={timerState.timeControl}
            onNewGame={handleNewGame}
            onUndo={handleUndo}
            onFlipBoard={handleFlipBoard}
            onToggleSound={() => { sound.toggleSound(); setSoundEnabled(prev => !prev) }}
            onTimeControl={handleTimeControl}
            canUndo={moveHistory.length > 0 && !isThinking}
          />
          <MoveHistory moves={moveHistory} />
        </div>
      </div>
      {pendingPromotion && (
        <PromotionModal color={pendingPromotion.color} onSelect={handlePromotion} />
      )}
    </div>
  )
}

function getBestMove(game: Chess, depth: number) {
  const moves = game.moves({ verbose: true })
  let bestMove = moves[0]
  let bestValue = -Infinity

  for (const move of moves) {
    game.move(move)
    const value = -minimax(game, depth - 1, -Infinity, Infinity, false)
    game.undo()

    if (value > bestValue) {
      bestValue = value
      bestMove = move
    }
  }

  return bestMove
}

function minimax(game: Chess, depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game)
  }

  const moves = game.moves({ verbose: true })

  if (isMaximizing) {
    let maxEval = -Infinity
    for (const move of moves) {
      game.move(move)
      const eval_ = minimax(game, depth - 1, alpha, beta, false)
      game.undo()
      maxEval = Math.max(maxEval, eval_)
      alpha = Math.max(alpha, eval_)
      if (beta <= alpha) break
    }
    return maxEval
  } else {
    let minEval = Infinity
    for (const move of moves) {
      game.move(move)
      const eval_ = minimax(game, depth - 1, alpha, beta, true)
      game.undo()
      minEval = Math.min(minEval, eval_)
      beta = Math.min(beta, eval_)
      if (beta <= alpha) break
    }
    return minEval
  }
}

function evaluateBoard(game: Chess): number {
  if (game.isCheckmate()) return game.turn() === 'w' ? -9999 : 9999
  if (game.isDraw()) return 0

  const pieceValues: Record<string, number> = {
    p: 1, n: 3, b: 3.2, r: 5, q: 9, k: 0
  }

  let score = 0
  const board = game.board()

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece) {
        const value = pieceValues[piece.type]
        score += piece.color === 'w' ? value : -value

        const centerBonus = (piece.type === 'p' || piece.type === 'n')
          ? (3.5 - Math.abs(3.5 - col)) * 0.1 + (3.5 - Math.abs(3.5 - row)) * 0.1
          : 0
        score += piece.color === 'w' ? centerBonus : -centerBonus
      }
    }
  }

  return score
}

export default App

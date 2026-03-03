import { useState, useCallback, useEffect } from 'react'
import { Chess } from 'chess.js'
import Board from './components/Board'
import MoveHistory from './components/MoveHistory'
import GameControls from './components/GameControls'
import GameStatus from './components/GameStatus'
import PromotionModal from './components/PromotionModal'
import CapturedPieces from './components/CapturedPieces'
import GameOverModal from './components/GameOverModal'
import ChessTimer from './components/ChessTimer'
import EvalBar from './components/EvalBar'
import GameStats from './components/GameStats'
import ShortcutsHelp from './components/ShortcutsHelp'
import OpeningName from './components/OpeningName'
import FenLoader from './components/FenLoader'
import PlayerLabel from './components/PlayerLabel'
import DailyTip from './components/DailyTip'
import { ecoOpenings } from './data/eco'
import { useSound } from './hooks/useSound'
import { useTheme } from './hooks/useTheme'
import { useChessTimer, type TimeControl } from './hooks/useChessTimer'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useGameClock } from './hooks/useGameClock'
import { usePersistedState } from './hooks/usePersistedState'
import './App.css'

export type GameMode = 'local' | 'ai'
export type Difficulty = 'easy' | 'medium' | 'hard'

function App() {
  const [game, setGame] = useState(new Chess())
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [legalMoves, setLegalMoves] = useState<string[]>([])
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [fenHistory, setFenHistory] = useState<string[]>([new Chess().fen()])
  const [viewIndex, setViewIndex] = useState(-1)
  const [gameMode, setGameMode] = useState<GameMode>('local')
  const [difficulty, setDifficulty] = usePersistedState<Difficulty>('chess-difficulty', 'medium')
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w')
  const [isThinking, setIsThinking] = useState(false)
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null)
  const [boardFlipped, setBoardFlipped] = useState(false)
  const [pendingPromotion, setPendingPromotion] = useState<{ from: string; to: string; color: 'w' | 'b' } | null>(null)
  const [soundEnabled, setSoundEnabled] = usePersistedState('chess-sound', true)
  const [autoQueen, setAutoQueen] = usePersistedState('chess-auto-queen', false)
  const [showGameOver, setShowGameOver] = useState(false)
  const [resigned, setResigned] = useState<'w' | 'b' | null>(null)
  const [stats, setStats] = usePersistedState('chess-stats', { wins: 0, losses: 0, draws: 0 })
  const sound = useSound()
  const { theme, toggleTheme } = useTheme()
  const { timerState, startTimer, switchTurn, pauseTimer, resetTimer } = useChessTimer()
  const gameClock = useGameClock()

  const isViewingLatest = viewIndex === moveHistory.length - 1 || (viewIndex === -1 && moveHistory.length === 0)
  const displayGame = isViewingLatest ? game : new Chess(fenHistory[viewIndex + 1])

  const playMoveSound = useCallback((game: Chess, move: { captured?: string; san: string }) => {
    if (game.isCheckmate() || game.isDraw()) {
      sound.playGameOver()
      pauseTimer()
    } else if (game.inCheck()) {
      sound.playCheck()
    } else if (move.san === 'O-O' || move.san === 'O-O-O') {
      sound.playCastle()
    } else if (move.san.includes('=')) {
      sound.playPromotion()
    } else if (move.captured) {
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

      currentGame.move(selectedMove)
      const newFen = currentGame.fen()
      setGame(new Chess(newFen))
      setMoveHistory(prev => [...prev, selectedMove.san])
      setFenHistory(prev => [...prev, newFen])
      setViewIndex(prev => prev + 1)
      setLastMove({ from: selectedMove.from, to: selectedMove.to })
      playMoveSound(currentGame, selectedMove)
      if (!currentGame.isGameOver()) {
        switchTurn(currentGame.turn())
      }
      setIsThinking(false)
    }, 500)
  }, [difficulty, playMoveSound, switchTurn])

  const handleSquareClick = useCallback((square: string) => {
    if (isThinking) return
    if (timerState.isExpired) return
    if (resigned) return
    if (!isViewingLatest) return
    if (gameMode === 'ai' && game.turn() !== playerColor) return

    if (selectedSquare) {
      const move = game.moves({ square: selectedSquare as any, verbose: true })
        .find(m => m.to === square)

      if (move) {
        if (move.piece === 'p' && (move.to[1] === '8' || move.to[1] === '1')) {
          if (autoQueen) {
            const newGame = new Chess(game.fen())
            const result = newGame.move({ from: move.from, to: move.to, promotion: 'q' })
            if (result) {
              setGame(newGame)
              playMoveSound(newGame, result)
              setLastMove({ from: move.from, to: move.to })
              setMoveHistory(prev => [...prev, result.san])
              setFenHistory(prev => [...prev, newGame.fen()])
              setViewIndex(prev => prev + 1)
              if (gameMode === 'ai') makeAIMove(newGame)
              switchTurn(newGame.turn())
            }
            setSelectedSquare(null)
            setLegalMoves([])
            return
          }
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
          setFenHistory(prev => [...prev, newGame.fen()])
          setViewIndex(prev => prev + 1)
          setLastMove({ from: move.from, to: move.to })
          playMoveSound(newGame, result)
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

      sound.playError()
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
  }, [game, selectedSquare, isThinking, gameMode, playerColor, makeAIMove, switchTurn, timerState.isExpired, isViewingLatest])

  const handleDrop = useCallback((from: string, to: string) => {
    if (isThinking) return
    if (timerState.isExpired) return
    if (resigned) return
    if (!isViewingLatest) return
    if (gameMode === 'ai' && game.turn() !== playerColor) return

    const move = game.moves({ square: from as any, verbose: true }).find(m => m.to === to)
    if (!move) return

    if (move.piece === 'p' && (move.to[1] === '8' || move.to[1] === '1')) {
      if (autoQueen) {
        const newGame = new Chess(game.fen())
        const result = newGame.move({ from: move.from, to: move.to, promotion: 'q' })
        if (result) {
          setGame(newGame)
          playMoveSound(newGame, result)
          setLastMove({ from: move.from, to: move.to })
          setMoveHistory(prev => [...prev, result.san])
          setFenHistory(prev => [...prev, newGame.fen()])
          setViewIndex(prev => prev + 1)
          if (gameMode === 'ai') makeAIMove(newGame)
          switchTurn(newGame.turn())
        }
        return
      }
      setPendingPromotion({ from: move.from, to: move.to, color: game.turn() })
      return
    }

    const newGame = new Chess(game.fen())
    const result = newGame.move(move)
    if (result) {
      setGame(newGame)
      setMoveHistory(prev => [...prev, result.san])
      setFenHistory(prev => [...prev, newGame.fen()])
      setViewIndex(prev => prev + 1)
      setLastMove({ from: move.from, to: move.to })
      playMoveSound(newGame, result)
      if (!newGame.isGameOver()) {
        switchTurn(newGame.turn())
      }
      setSelectedSquare(null)
      setLegalMoves([])

      if (gameMode === 'ai' && !newGame.isGameOver()) {
        makeAIMove(newGame)
      }
    }
  }, [game, isThinking, gameMode, playerColor, makeAIMove, playMoveSound, switchTurn, timerState.isExpired, isViewingLatest])

  const handleNewGame = useCallback((mode: GameMode, diff?: Difficulty, color?: 'w' | 'b') => {
    const newGame = new Chess()
    setGame(newGame)
    setSelectedSquare(null)
    setLegalMoves([])
    setMoveHistory([])
    setFenHistory([newGame.fen()])
    setViewIndex(-1)
    setLastMove(null)
    setIsThinking(false)
    setShowGameOver(false)
    setResigned(null)
    gameClock.reset()
    setGameMode(mode)
    if (diff) setDifficulty(diff)
    if (color) {
      setPlayerColor(color)
      setBoardFlipped(color === 'b')
    }
    resetTimer()
    sound.playStart()

    if (mode === 'ai' && color === 'b') {
      makeAIMove(newGame)
    }
  }, [makeAIMove, resetTimer, sound])

  const handleUndo = useCallback(() => {
    const undoCount = gameMode === 'ai' ? 2 : 1
    const newGame = new Chess(game.fen())
    for (let i = 0; i < undoCount; i++) newGame.undo()
    setGame(newGame)
    setMoveHistory(prev => prev.slice(0, -undoCount))
    setFenHistory(prev => prev.slice(0, -undoCount))
    setViewIndex(prev => Math.max(-1, prev - undoCount))
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
      setFenHistory(prev => [...prev, newGame.fen()])
      setViewIndex(prev => prev + 1)
      setLastMove({ from: pendingPromotion.from, to: pendingPromotion.to })
      playMoveSound(newGame, result)
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

  const handleGoToMove = useCallback((index: number) => {
    const clamped = Math.max(-1, Math.min(index, moveHistory.length - 1))
    setViewIndex(clamped)
    setSelectedSquare(null)
    setLegalMoves([])
  }, [moveHistory.length])

  const handleResign = useCallback(() => {
    if (game.isGameOver() || resigned) return
    if (!confirm('Are you sure you want to resign?')) return
    const loser = gameMode === 'ai' ? playerColor : game.turn()
    setResigned(loser)
    pauseTimer()
    gameClock.stop()
    if (gameMode === 'ai') {
      setStats(prev => ({ ...prev, losses: prev.losses + 1 }))
    } else {
      setStats(prev => ({ ...prev, wins: prev.wins + 1 }))
    }
    setTimeout(() => setShowGameOver(true), 300)
  }, [game, resigned, gameMode, playerColor, pauseTimer, gameClock])

  const handleFlipBoard = useCallback(() => {
    setBoardFlipped(prev => !prev)
  }, [])

  const handleRandomOpening = useCallback(() => {
    const opening = ecoOpenings[Math.floor(Math.random() * ecoOpenings.length)]
    const newGame = new Chess()
    newGame.loadPgn(opening.moves)
    const history = newGame.history()
    const fens: string[] = [new Chess().fen()]
    const replay = new Chess()
    for (const san of history) {
      replay.move(san)
      fens.push(replay.fen())
    }
    setGame(newGame)
    setSelectedSquare(null)
    setLegalMoves([])
    setMoveHistory(history)
    setFenHistory(fens)
    setViewIndex(history.length - 1)
    setLastMove(null)
    setShowGameOver(false)
    setResigned(null)
    gameClock.reset()
    resetTimer()
    sound.playStart()
  }, [gameClock, resetTimer, sound])

  const handleLoadFen = useCallback((fen: string) => {
    const newGame = new Chess(fen)
    setGame(newGame)
    setSelectedSquare(null)
    setLegalMoves([])
    setMoveHistory([])
    setFenHistory([fen])
    setViewIndex(-1)
    setLastMove(null)
    setShowGameOver(false)
    gameClock.reset()
    resetTimer()
  }, [gameClock, resetTimer])

  const handleLoadPgn = useCallback((pgn: string) => {
    const newGame = new Chess()
    newGame.loadPgn(pgn)
    const history = newGame.history()
    const fens: string[] = [new Chess().fen()]
    const replay = new Chess()
    for (const san of history) {
      replay.move(san)
      fens.push(replay.fen())
    }
    setGame(newGame)
    setSelectedSquare(null)
    setLegalMoves([])
    setMoveHistory(history)
    setFenHistory(fens)
    setViewIndex(history.length - 1)
    setLastMove(null)
    setShowGameOver(false)
    gameClock.reset()
    resetTimer()
  }, [gameClock, resetTimer])

  // Start timer on first move
  useEffect(() => {
    if (moveHistory.length === 1 && timerState.timeControl !== 'none' && timerState.activeColor === null && !timerState.isExpired) {
      switchTurn(game.turn())
    }
  }, [moveHistory.length, timerState.timeControl, timerState.activeColor, timerState.isExpired, switchTurn, game])

  // Game clock — start on first move, stop on game over
  useEffect(() => {
    if (moveHistory.length === 1 && !gameClock.isRunning) {
      gameClock.start()
    }
    if ((game.isGameOver() || timerState.isExpired) && gameClock.isRunning) {
      gameClock.stop()
    }
  }, [moveHistory.length, game, timerState.isExpired, gameClock])

  // Show game over modal and record stats
  useEffect(() => {
    if (game.isGameOver() || timerState.isExpired) {
      const timeout = setTimeout(() => setShowGameOver(true), 600)

      // Record result
      if (game.isDraw()) {
        setStats(prev => ({ ...prev, draws: prev.draws + 1 }))
      } else if (game.isCheckmate()) {
        const whiteWins = game.turn() === 'b'
        if (gameMode === 'ai') {
          const youWin = (whiteWins && playerColor === 'w') || (!whiteWins && playerColor === 'b')
          setStats(prev => youWin ? { ...prev, wins: prev.wins + 1 } : { ...prev, losses: prev.losses + 1 })
        } else {
          setStats(prev => ({ ...prev, wins: prev.wins + 1 }))
        }
      } else if (timerState.isExpired) {
        if (gameMode === 'ai') {
          const youWin = timerState.isExpired !== playerColor
          setStats(prev => youWin ? { ...prev, wins: prev.wins + 1 } : { ...prev, losses: prev.losses + 1 })
        } else {
          setStats(prev => ({ ...prev, wins: prev.wins + 1 }))
        }
      }

      return () => clearTimeout(timeout)
    }
  }, [game, timerState.isExpired, gameMode, playerColor])

  useKeyboardShortcuts({
    onPrevMove: () => handleGoToMove(viewIndex - 1),
    onNextMove: () => handleGoToMove(viewIndex + 1),
    onFirstMove: () => handleGoToMove(-1),
    onLastMove: () => handleGoToMove(moveHistory.length - 1),
    onUndo: handleUndo,
    onFlip: handleFlipBoard,
  })

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
            moveHistory={moveHistory}
            elapsed={gameClock.elapsed}
          />
          <OpeningName pgn={game.pgn()} />
          <ChessTimer timerState={timerState} flipped={boardFlipped} />
          <CapturedPieces game={displayGame} />
          <PlayerLabel
            color={boardFlipped ? 'w' : 'b'}
            isActive={game.turn() === (boardFlipped ? 'w' : 'b')}
            label={gameMode === 'ai' && (boardFlipped ? 'w' : 'b') !== playerColor ? 'Computer' : (boardFlipped ? 'White' : 'Black')}
            isAI={gameMode === 'ai' && (boardFlipped ? 'w' : 'b') !== playerColor}
          />
          <div className="board-with-eval">
            <EvalBar game={displayGame} />
            <Board
              game={displayGame}
              selectedSquare={isViewingLatest ? selectedSquare : null}
              legalMoves={isViewingLatest ? legalMoves : []}
              lastMove={lastMove}
              flipped={boardFlipped}
              isThinking={isThinking}
              onSquareClick={handleSquareClick}
              onDrop={handleDrop}
            />
          </div>
          <PlayerLabel
            color={boardFlipped ? 'b' : 'w'}
            isActive={game.turn() === (boardFlipped ? 'b' : 'w')}
            label={gameMode === 'ai' && (boardFlipped ? 'b' : 'w') !== playerColor ? 'Computer' : (boardFlipped ? 'Black' : 'White')}
            isAI={gameMode === 'ai' && (boardFlipped ? 'b' : 'w') !== playerColor}
          />
        </div>
        <div className="side-panel">
          <GameControls
            gameMode={gameMode}
            difficulty={difficulty}
            soundEnabled={soundEnabled}
            timeControl={timerState.timeControl}
            pgn={game.pgn()}
            gameInProgress={moveHistory.length > 0 && !game.isGameOver()}
            autoQueen={autoQueen}
            onNewGame={handleNewGame}
            onToggleAutoQueen={() => setAutoQueen(prev => !prev)}
            onResign={handleResign}
            onUndo={handleUndo}
            onFlipBoard={handleFlipBoard}
            onToggleSound={() => { sound.toggleSound(); setSoundEnabled(prev => !prev) }}
            onTimeControl={handleTimeControl}
            onRandomOpening={handleRandomOpening}
            canUndo={moveHistory.length > 0 && !isThinking}
          />
          <MoveHistory moves={moveHistory} currentMoveIndex={viewIndex} onGoToMove={handleGoToMove} />
          <FenLoader currentFen={game.fen()} onLoadFen={handleLoadFen} onLoadPgn={handleLoadPgn} />
          <GameStats wins={stats.wins} losses={stats.losses} draws={stats.draws} onReset={() => setStats({ wins: 0, losses: 0, draws: 0 })} />
          <ShortcutsHelp />
          <DailyTip />
        </div>
      </div>
      {pendingPromotion && (
        <PromotionModal color={pendingPromotion.color} onSelect={handlePromotion} />
      )}
      {showGameOver && (
        <GameOverModal
          game={game}
          gameMode={gameMode}
          playerColor={playerColor}
          timeExpired={timerState.isExpired}
          resigned={resigned}
          onPlayAgain={() => handleNewGame(gameMode, difficulty, playerColor)}
          onClose={() => setShowGameOver(false)}
        />
      )}
      <footer className="app-footer">
        <span>Built with React + chess.js</span>
        <a href="https://github.com/Hashem-Al-Qurashi/chess-ai" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </footer>
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

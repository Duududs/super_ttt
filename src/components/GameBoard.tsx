import { useState, useCallback, useEffect, useMemo } from "react";
import marioBg from "@/assets/mario-bg.png";
import { type GameMode } from "@/components/StartMenu";

type Player = "X" | "O" | null;

const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

interface GameBoardProps {
  mode: GameMode;
  onBack: () => void;
}

const GameBoard = ({ mode, onBack }: GameBoardProps) => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [scores, setScores] = useState({ mario: 0, luigi: 0 });
  const [winLine, setWinLine] = useState<number[] | null>(null);

  const playerMeta = useMemo(
    () => ({
      X: { name: "MARIO", icon: "/icons/mario.png", alt: "Mario" },
      O:
        mode === "robot"
          ? { name: "ROBÔ", icon: "/icons/ghost.png", alt: "Fantasma" }
          : { name: "LUIGI", icon: "/icons/luigi.png", alt: "Luigi" },
    }),
    [mode],
  );

  const checkWinner = useCallback((b: Player[]): number[] | null => {
    for (const combo of WINNING_COMBOS) {
      if (
        b[combo[0]] &&
        b[combo[0]] === b[combo[1]] &&
        b[combo[1]] === b[combo[2]]
      ) {
        return combo;
      }
    }
    return null;
  }, []);

  const isDraw = board.every((c) => c !== null) && !winLine;
  const winnerSymbol = winLine ? board[winLine[0]] : null;
  const winnerName = winnerSymbol ? playerMeta[winnerSymbol].name : null;
  const currentPlayer = isXTurn ? playerMeta.X : playerMeta.O;
  const isRobotTurn = mode === "robot" && !isXTurn && !winLine && !isDraw;
  const robotWon = mode === "robot" && winnerSymbol === "O";
  const localWon = mode === "local" && winnerSymbol !== null;
  const gameFinished = winnerSymbol !== null || isDraw;

  const pickRobotMove = useCallback(
    (b: Player[]) => {
      const empty = b
        .map((value, index) => (value === null ? index : -1))
        .filter((index) => index !== -1);

      for (const index of empty) {
        const test = [...b];
        test[index] = "O";
        if (checkWinner(test)) return index;
      }

      for (const index of empty) {
        const test = [...b];
        test[index] = "X";
        if (checkWinner(test)) return index;
      }

      if (b[4] === null) return 4;

      const corners = [0, 2, 6, 8].filter((index) => b[index] === null);
      if (corners.length > 0) return corners[0];

      return empty[0] ?? -1;
    },
    [checkWinner],
  );

  const handleClick = (index: number) => {
    if (board[index] || winLine || isRobotTurn) return;

    const newBoard = [...board];
    newBoard[index] = isXTurn ? "X" : "O";
    setBoard(newBoard);

    const win = checkWinner(newBoard);
    if (win) {
      setWinLine(win);
      setScores((s) => ({
        ...s,
        [newBoard[win[0]] === "X" ? "mario" : "luigi"]:
          s[newBoard[win[0]] === "X" ? "mario" : "luigi"] + 1,
      }));
      return;
    }

    setIsXTurn(!isXTurn);
  };

  useEffect(() => {
    if (!isRobotTurn) return;

    const robotMove = pickRobotMove(board);
    if (robotMove < 0) return;

    const timeout = setTimeout(() => {
      const newBoard = [...board];
      newBoard[robotMove] = "O";
      setBoard(newBoard);

      const win = checkWinner(newBoard);
      if (win) {
        setWinLine(win);
        setScores((s) => ({ ...s, luigi: s.luigi + 1 }));
        return;
      }

      setIsXTurn(true);
    }, 350);

    return () => clearTimeout(timeout);
  }, [board, checkWinner, isRobotTurn, pickRobotMove]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setWinLine(null);
  }, []);

  useEffect(() => {
    if (!gameFinished) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      resetGame();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameFinished, resetGame]);

  const renderPlayerIcon = (player: "X" | "O", className: string) => (
    <img
      src={playerMeta[player].icon}
      alt={playerMeta[player].alt}
      className={className}
      draggable={false}
    />
  );

  const renderCell = (index: number) => {
    const value = board[index];
    const isWinCell = winLine?.includes(index);

    return (
      <button
        key={index}
        onClick={() => handleClick(index)}
        className={`mario-cell flex aspect-square w-full items-center justify-center rounded-xl transition-all
          ${!value ? "cursor-pointer hover:brightness-110" : "cursor-default"}
          ${isWinCell ? "ring-4 ring-accent animate-bounce-in brightness-110" : ""}
        `}
      >
        {value && (
          <span className="animate-bounce-in inline-flex items-center justify-center">
            {renderPlayerIcon(
              value,
              "h-12 w-12 sm:h-14 sm:w-14 object-contain",
            )}
          </span>
        )}
      </button>
    );
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center bg-no-repeat p-4 pb-24"
      style={{ backgroundImage: `url(${marioBg})` }}
    >
      <div className="mb-4 flex w-full max-w-md items-center justify-between px-2">
        <button
          onClick={onBack}
          className="pixel-border rounded-lg bg-primary px-3 py-2 text-xs text-primary-foreground transition-transform hover:scale-105"
        >
          ← MENU
        </button>

        <div className="question-block rounded-lg px-4 py-2 text-center">
          {winnerName ? (
            <p className="text-xs text-accent-foreground">{winnerName} VENCEU!</p>
          ) : isDraw ? (
            <p className="text-xs text-accent-foreground">EMPATE!</p>
          ) : (
            <p className="flex items-center gap-2 text-xs text-accent-foreground">
              <img
                src={currentPlayer.icon}
                alt={currentPlayer.alt}
                className="h-4 w-4 object-contain"
                draggable={false}
              />
              VEZ DE {currentPlayer.name}
            </p>
          )}
        </div>
      </div>

      <div className="mario-board-card w-full max-w-md p-4 sm:p-5">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {Array.from({ length: 9 }, (_, i) => renderCell(i))}
        </div>
      </div>

      <button
        onClick={resetGame}
        className="question-block fixed bottom-20 left-1/2 z-20 -translate-x-1/2 cursor-pointer rounded-lg px-6 py-3 text-sm text-accent-foreground transition-transform hover:scale-110"
      >
        {gameFinished ? "VOLTAR AO JOGO" : "REINICIAR"}
      </button>

      {localWon && (
        <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center bg-black/55 backdrop-blur-[1px]">
          <div className="flex flex-col items-center">
            <img
              src={winnerName === "MARIO" ? "/icons/mario.gif" : "/icons/luigi.gif"}
              alt={`${winnerName} venceu`}
              className="h-56 w-56 object-contain sm:h-80 sm:w-80"
              draggable={false}
            />
            <div className="question-block mt-3 rounded-lg px-6 py-4 text-center">
              <p className="pixel-shadow text-2xl leading-none text-accent sm:text-4xl">
                {winnerName} VENCEU!
              </p>
              <p className="mt-2 animate-blink text-xs text-foreground sm:text-sm">
                PRESSIONE ENTER PARA VOLTAR
              </p>
            </div>
          </div>
        </div>
      )}

      {robotWon && (
        <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-[1px]">
          <div className="flex flex-col items-center">
            <img
              src="/icons/Ghost.gif"
              alt="Robô venceu"
              className="h-56 w-56 object-contain sm:h-80 sm:w-80"
              draggable={false}
            />
            <div className="question-block mt-3 rounded-lg px-6 py-4 text-center">
              <p className="pixel-shadow text-2xl leading-none text-accent sm:text-4xl">
                VOCÊ PERDEU
              </p>
              <p className="mt-2 animate-blink text-xs text-foreground sm:text-sm">
                PRESSIONE ENTER PARA VOLTAR
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 left-1/2 z-20 flex w-[min(92vw,28rem)] -translate-x-1/2 items-center justify-between gap-4 text-xs text-foreground sm:bottom-5 sm:text-sm">
        <div className="mario-score-item flex items-center gap-2">
          {renderPlayerIcon("X", "h-6 w-6 sm:h-7 sm:w-7 object-contain")}
          <span>MARIO ({scores.mario})</span>
        </div>
        <div className="mario-score-item flex items-center gap-2">
          <span>{playerMeta.O.name} ({scores.luigi})</span>
          {renderPlayerIcon("O", "h-6 w-6 sm:h-7 sm:w-7 object-contain")}
        </div>
      </div>

      <div className="brick-pattern fixed bottom-0 left-0 right-0 h-16" />
    </div>
  );
};

export default GameBoard;


import { useState } from "react";
import StartMenu, { type GameMode } from "@/components/StartMenu";
import GameBoard from "@/components/GameBoard";

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>("local");

  return gameStarted ? (
    <GameBoard
      mode={gameMode}
      onBack={() => {
        setGameStarted(false);
        setGameMode("local");
      }}
    />
  ) : (
    <StartMenu
      onSelectMode={(mode) => {
        setGameMode(mode);
        setGameStarted(true);
      }}
    />
  );
};

export default Index;

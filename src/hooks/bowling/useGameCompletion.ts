import { Frame } from "@/types/game";

export const useGameCompletion = (frames: Frame[]) => {
  const calculateTotalScore = () => {
    const lastFrame = frames[9];
    return lastFrame?.score || 0;
  };

  const handleNewGame = () => {
    window.location.reload();
  };

  return {
    calculateTotalScore,
    handleNewGame,
  };
};
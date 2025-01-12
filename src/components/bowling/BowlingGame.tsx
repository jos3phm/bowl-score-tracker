import { GameContainer } from "./GameContainer";
import { GameContent } from "./GameContent";
import { GameComplete } from "./GameComplete";
import { useBowlingGame } from "@/hooks/useBowlingGame";
import { useBallSelection } from "@/hooks/bowling/useBallSelection";
import { useHistoricalFrame } from "@/hooks/bowling/useHistoricalFrame";
import { useGameCompletion } from "@/hooks/bowling/useGameCompletion";
import { useEffect } from "react";
import { usePinHandling } from "@/hooks/bowling/usePinHandling";

interface BowlingGameProps {
  gameId: string;
}

export const BowlingGame = ({ gameId }: BowlingGameProps) => {
  const {
    frames,
    currentFrame,
    currentShot,
    handleStrike,
    handleSpare,
    handleRegularShot,
    handleClear,
    getRemainingPins,
    isGameComplete,
  } = useBowlingGame();

  const { 
    selectedBallId, 
    handleBallSelect, 
    recordBallUsage,
    checkSpareBallPreference 
  } = useBallSelection(gameId);

  const {
    calculateTotalScore,
    handleNewGame,
    handleSaveGame,
    isSaving,
  } = useGameCompletion(frames, gameId);

  const handleShotWithBall = async (
    shotHandler: () => void,
    shotType: 'strike' | 'spare' | 'regular'
  ) => {
    if (selectedBallId) {
      try {
        const remainingPins = getRemainingPins(currentFrame, currentShot);
        await recordBallUsage(currentFrame, currentShot, shotType, remainingPins);
      } catch (error) {
        console.error('Failed to record ball usage:', error);
      }
    }
    shotHandler();
  };

  const {
    handlePinShot,
    handleMiss,
    handleStrikeShot,
    handleSpareShot,
  } = usePinHandling(
    handleShotWithBall,
    handleRegularShot,
    handleStrike,
    handleSpare,
    handleClear,
  );

  // Check for spare ball preference when remaining pins change
  useEffect(() => {
    const checkAndSetSpareBall = async () => {
      const remainingPins = getRemainingPins(currentFrame, currentShot);
      if (currentShot === 2 && remainingPins && remainingPins.length === 1) {
        const preferredBallId = await checkSpareBallPreference(remainingPins);
        if (preferredBallId) {
          handleBallSelect(preferredBallId);
        }
      }
    };

    checkAndSetSpareBall();
  }, [currentFrame, currentShot, getRemainingPins, checkSpareBallPreference, handleBallSelect]);

  const remainingPins = getRemainingPins(currentFrame, currentShot);
  console.log('Remaining pins for frame', currentFrame, 'shot', currentShot, ':', remainingPins);

  if (isGameComplete) {
    return (
      <GameContainer>
        <GameComplete
          totalScore={calculateTotalScore()}
          onNewGame={handleNewGame}
          frames={frames}
          gameId={gameId}
        />
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      <GameContent
        frames={frames}
        currentFrame={currentFrame}
        currentShot={currentShot}
        handleStrike={handleStrikeShot}
        handleSpare={handleSpareShot}
        handlePinClick={handlePinShot}
        handleMiss={handleMiss}
        isStrike={currentFrame === 10 ? frames[9]?.isStrike : frames[currentFrame - 1]?.isStrike}
        calculateTotalScore={calculateTotalScore}
        handleNewGame={handleNewGame}
        handleSaveGame={handleSaveGame}
        isSaving={isSaving}
        selectedBallId={selectedBallId}
        handleBallSelect={handleBallSelect}
        remainingPins={remainingPins}
        gameId={gameId}
      />
    </GameContainer>
  );
};

import { GameContainer } from "./GameContainer";
import { GameContent } from "./GameContent";
import { useBowlingGame } from "@/hooks/useBowlingGame";
import { useBallSelection } from "@/hooks/bowling/useBallSelection";
import { useHistoricalFrame } from "@/hooks/bowling/useHistoricalFrame";
import { useGameCompletion } from "@/hooks/bowling/useGameCompletion";
import { useEffect } from "react";
import { Pin } from "@/types/game";

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
    handlePinClick,
    handleClear,
    getRemainingPins,
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
  } = useGameCompletion(frames);

  const {
    selectedHistoricalFrame,
    setSelectedHistoricalFrame,
  } = useHistoricalFrame();

  const isStrike = currentFrame === 10 
    ? frames[9]?.isStrike 
    : frames[currentFrame - 1]?.isStrike;

  // Check for spare ball preference when remaining pins change
  useEffect(() => {
    const checkAndSetSpareBall = async () => {
      if (currentShot === 2) {
        const remainingPins = getRemainingPins(currentFrame, currentShot);
        if (remainingPins && remainingPins.length > 0) {
          const preferredBallId = await checkSpareBallPreference(remainingPins);
          if (preferredBallId) {
            handleBallSelect(preferredBallId);
          }
        }
      }
    };

    checkAndSetSpareBall();
  }, [currentFrame, currentShot, getRemainingPins]);

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

  // Wrapper for handlePinClick to handle regular shots
  const handleRegularShot = (pins: Pin[]) => {
    console.log('Recording regular shot with pins:', pins);
    const allPins: Pin[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // Convert standing pins to knocked down pins
    const knockedDownPins = allPins.filter(pin => !pins.includes(pin));
    handleShotWithBall(() => {
      // Pass each knocked down pin individually to handlePinClick
      knockedDownPins.forEach(pin => handlePinClick(pin));
    }, 'regular');
  };

  return (
    <GameContainer>
      <GameContent
        frames={frames}
        currentFrame={currentFrame}
        currentShot={currentShot}
        handleStrike={() => handleShotWithBall(handleStrike, 'strike')}
        handleSpare={() => handleShotWithBall(handleSpare, 'spare')}
        handlePinClick={handleRegularShot}
        handleClear={handleClear}
        isStrike={isStrike}
        calculateTotalScore={calculateTotalScore}
        handleNewGame={handleNewGame}
        handleSaveGame={handleSaveGame}
        isSaving={isSaving}
        selectedBallId={selectedBallId}
        handleBallSelect={handleBallSelect}
      />
    </GameContainer>
  );
};
import { useState } from "react";
import { useBowlingGame } from "@/hooks/useBowlingGame";
import { Pin } from "@/types/game";
import { ScoreCard } from "./ScoreCard";
import { GameContainer } from "./GameContainer";
import { GameContent } from "./GameContent";
import { GameComplete } from "./GameComplete";
import { useBallSelection } from "@/hooks/bowling/useBallSelection";
import { toast } from "sonner";

export const BowlingGame = () => {
  const {
    currentFrame,
    currentShot,
    selectedPins,
    frames,
    isGameComplete,
    handlePinSelect,
    handleStrike,
    handleSpare,
    handleRegularShot,
    handleClear,
    gameId,
  } = useBowlingGame();

  const [selectedHistoricalFrame, setSelectedHistoricalFrame] = useState<number | null>(null);
  const { selectedBallId, handleBallSelect, recordBallUsage } = useBallSelection(gameId);

  const isFirstShotStrike = currentFrame === 10 
    ? frames[9]?.isStrike 
    : frames[currentFrame - 1]?.isStrike;

  const handleShotWithBall = async (
    shotHandler: () => void,
    shotType: 'strike' | 'spare' | 'regular'
  ) => {
    // Record the shot first, regardless of ball selection
    shotHandler();
    
    // Only attempt to record ball usage if a ball is selected
    if (selectedBallId) {
      try {
        await recordBallUsage(currentFrame, currentShot, shotType);
      } catch (error) {
        console.error('Failed to record ball usage:', error);
        // Only show error for ball usage, not the shot itself
        toast.error('Failed to record ball usage. Make sure you own this ball.');
      }
    }
  };

  const getRemainingPins = (): Pin[] | undefined => {
    if (currentShot !== 2) return undefined;
    
    const frame = frames[currentFrame - 1];
    if (!frame?.firstShot) return undefined;

    if (currentFrame === 10 && frame.isStrike) {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as Pin[];
    }

    const knockedDownPins = frame.firstShot;
    return ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as Pin[]).filter(pin => !knockedDownPins.includes(pin));
  };

  const getHistoricalFrameData = () => {
    if (selectedHistoricalFrame === null) return null;
    
    const frame = frames[selectedHistoricalFrame];
    if (!frame) return null;

    return {
      firstShot: frame.firstShot || [],
      secondShot: frame.secondShot || [],
      isSpare: frame.isSpare,
      isStrike: frame.isStrike
    };
  };

  const calculateTotalScore = () => {
    const lastFrame = frames[9];
    return lastFrame?.score || 0;
  };

  const handleNewGame = () => {
    window.location.reload();
  };

  return (
    <GameContainer>
      {isGameComplete ? (
        <GameComplete
          totalScore={calculateTotalScore()}
          onNewGame={handleNewGame}
        />
      ) : (
        <>
          <ScoreCard
            frames={frames}
            currentFrame={currentFrame}
            onFrameClick={(frameIndex) => setSelectedHistoricalFrame(frameIndex)}
            selectedFrame={selectedHistoricalFrame}
          />
          
          <GameContent
            currentFrame={currentFrame}
            currentShot={currentShot}
            selectedPins={selectedPins}
            isGameComplete={isGameComplete}
            isFirstShotStrike={isFirstShotStrike}
            remainingPins={getRemainingPins()}
            historicalFrame={getHistoricalFrameData()}
            isHistoricalView={selectedHistoricalFrame !== null}
            onPinSelect={handlePinSelect}
            onStrike={() => handleShotWithBall(handleStrike, 'strike')}
            onSpare={() => handleShotWithBall(handleSpare, 'spare')}
            onRegularShot={() => handleShotWithBall(handleRegularShot, 'regular')}
            onClear={handleClear}
            onBallSelect={handleBallSelect}
            selectedBallId={selectedBallId}
          />
        </>
      )}
    </GameContainer>
  );
};
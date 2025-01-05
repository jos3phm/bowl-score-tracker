import { useBowlingGame } from "@/hooks/useBowlingGame";
import { ScoreCard } from "./ScoreCard";
import { GameContainer } from "./GameContainer";
import { GameContent } from "./GameContent";
import { GameComplete } from "./GameComplete";
import { useBallSelection } from "@/hooks/bowling/useBallSelection";
import { useHistoricalFrame } from "@/hooks/bowling/useHistoricalFrame";
import { useGameCompletion } from "@/hooks/bowling/useGameCompletion";
import { useEffect } from "react";

interface BowlingGameProps {
  gameId: string;
}

export const BowlingGame = ({ gameId }: BowlingGameProps) => {
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
    notes,
    setNotes,
    photo,
    handlePhotoChange,
    isSaving,
    handleSaveGame
  } = useGameCompletion(frames);

  const {
    selectedHistoricalFrame,
    setSelectedHistoricalFrame,
    getHistoricalFrameData,
    getRemainingPins,
  } = useHistoricalFrame(frames);

  const isFirstShotStrike = currentFrame === 10 
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
    shotHandler();
    
    if (selectedBallId) {
      try {
        const remainingPins = getRemainingPins(currentFrame, currentShot);
        await recordBallUsage(currentFrame, currentShot, shotType, remainingPins);
      } catch (error) {
        console.error('Failed to record ball usage:', error);
      }
    }
  };

  return (
    <GameContainer>
      {isGameComplete ? (
        <GameComplete
          totalScore={calculateTotalScore()}
          onNewGame={handleNewGame}
          frames={frames}
          gameId={gameId}
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
            remainingPins={getRemainingPins(currentFrame, currentShot)}
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
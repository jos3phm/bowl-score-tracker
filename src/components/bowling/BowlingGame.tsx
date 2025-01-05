import { useBowlingGame } from "@/hooks/useBowlingGame";
import { ScoreCard } from "./ScoreCard";
import { GameContainer } from "./GameContainer";
import { GameContent } from "./GameContent";
import { GameComplete } from "./GameComplete";
import { useBallSelection } from "@/hooks/bowling/useBallSelection";
import { useHistoricalFrame } from "@/hooks/bowling/useHistoricalFrame";
import { useGameCompletion } from "@/hooks/bowling/useGameCompletion";

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

  const { selectedBallId, handleBallSelect, recordBallUsage } = useBallSelection(gameId);
  const { calculateTotalScore, handleNewGame } = useGameCompletion(frames);
  const {
    selectedHistoricalFrame,
    setSelectedHistoricalFrame,
    getHistoricalFrameData,
    getRemainingPins,
  } = useHistoricalFrame(frames);

  const isFirstShotStrike = currentFrame === 10 
    ? frames[9]?.isStrike 
    : frames[currentFrame - 1]?.isStrike;

  const handleShotWithBall = async (
    shotHandler: () => void,
    shotType: 'strike' | 'spare' | 'regular'
  ) => {
    shotHandler();
    
    if (selectedBallId) {
      try {
        await recordBallUsage(currentFrame, currentShot, shotType);
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
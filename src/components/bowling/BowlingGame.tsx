import { useState } from "react";
import { useBowlingGame } from "@/hooks/useBowlingGame";
import { Pin } from "@/types/game";
import { ScoreCard } from "./ScoreCard";
import { GameContainer } from "./GameContainer";
import { GameContent } from "./GameContent";

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
  } = useBowlingGame();

  const [selectedHistoricalFrame, setSelectedHistoricalFrame] = useState<number | null>(null);

  const isFirstShotStrike = currentFrame === 10 
    ? frames[9]?.isStrike 
    : frames[currentFrame - 1]?.isStrike;

  const getRemainingPins = (): Pin[] | undefined => {
    if (currentShot !== 2) return undefined;
    
    const frame = frames[currentFrame - 1];
    if (!frame?.firstShot) return undefined;

    if (currentFrame === 10 && frame.isStrike) {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }

    // Get all pins that were knocked down in the first shot
    const knockedDownPins = frame.firstShot;
    // Return all pins that were NOT knocked down in the first shot
    const allPins: Pin[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return allPins.filter(pin => !knockedDownPins.includes(pin));
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

  const historicalFrame = getHistoricalFrameData();

  return (
    <GameContainer>
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
        historicalFrame={historicalFrame}
        isHistoricalView={selectedHistoricalFrame !== null}
        onPinSelect={handlePinSelect}
        onStrike={handleStrike}
        onSpare={handleSpare}
        onRegularShot={handleRegularShot}
        onClear={handleClear}
      />
    </GameContainer>
  );
};
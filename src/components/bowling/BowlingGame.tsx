import { PinDiagram } from "./PinDiagram";
import { ScoreCard } from "./ScoreCard";
import { GameControls } from "./GameControls";
import { GameStatus } from "./GameStatus";
import { useBowlingGame } from "@/hooks/useBowlingGame";
import { Pin } from "@/types/game";
import { useState } from "react";

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

  // Determine if the first shot of the current frame (or 10th frame) was a strike
  const isFirstShotStrike = currentFrame === 10 
    ? frames[9]?.isStrike 
    : frames[currentFrame - 1]?.isStrike;

  // Calculate remaining pins for second shot
  const getRemainingPins = (): Pin[] | undefined => {
    if (currentShot !== 2) return undefined;
    
    const frame = frames[currentFrame - 1];
    if (!frame?.firstShot) return undefined;

    // Special case: In 10th frame after a strike, all pins are available
    if (currentFrame === 10 && frame.isStrike) {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }

    // For regular shots, return the pins that weren't knocked down
    return frame.firstShot;
  };

  // Get historical frame data for pin diagram
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-8">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Bowling Scorecard
          </h1>
          
          <ScoreCard
            frames={frames}
            currentFrame={currentFrame}
            onFrameClick={(frameIndex) => setSelectedHistoricalFrame(frameIndex)}
            selectedFrame={selectedHistoricalFrame}
          />
          
          <div className="space-y-6">
            <PinDiagram
              onPinSelect={handlePinSelect}
              selectedPins={selectedPins}
              disabled={currentFrame > 10 || isGameComplete}
              remainingPins={getRemainingPins()}
              historicalFrame={historicalFrame}
              isHistoricalView={selectedHistoricalFrame !== null}
            />
            
            <GameControls
              onStrike={handleStrike}
              onSpare={handleSpare}
              onRegularShot={handleRegularShot}
              onClear={handleClear}
              disabled={currentFrame > 10 || isGameComplete}
              currentFrame={currentFrame}
              currentShot={currentShot}
              isFirstShotStrike={isFirstShotStrike}
            />
          </div>
          
          <GameStatus
            currentFrame={currentFrame}
            currentShot={currentShot}
          />
        </div>
      </div>
    </div>
  );
};

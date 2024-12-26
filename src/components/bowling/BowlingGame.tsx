import { PinDiagram } from "./PinDiagram";
import { ScoreCard } from "./ScoreCard";
import { GameControls } from "./GameControls";
import { GameStatus } from "./GameStatus";
import { useBowlingGame } from "@/hooks/useBowlingGame";
import { Pin } from "@/types/game";

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

  // Determine if the first shot of the current frame (or 10th frame) was a strike
  const isFirstShotStrike = currentFrame === 10 
    ? frames[9]?.isStrike 
    : frames[currentFrame - 1]?.isStrike;

  // Calculate remaining pins for second shot
  const getRemainingPins = (): Pin[] | undefined => {
    if (currentShot !== 2) return undefined;
    
    const frame = frames[currentFrame - 1];
    if (!frame?.firstShot) return undefined;

    const allPins: Pin[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return allPins.filter(pin => !frame.firstShot?.includes(pin));
  };

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
          />
          
          <div className="space-y-6">
            <PinDiagram
              onPinSelect={handlePinSelect}
              selectedPins={selectedPins}
              disabled={currentFrame > 10 || isGameComplete}
              remainingPins={getRemainingPins()}
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
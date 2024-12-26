import { PinDiagram } from "./PinDiagram";
import { ScoreCard } from "./ScoreCard";
import { GameControls } from "./GameControls";
import { GameStatus } from "./GameStatus";
import { useBowlingGame } from "@/hooks/useBowlingGame";

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
            />
            
            <GameControls
              onStrike={handleStrike}
              onSpare={handleSpare}
              onRegularShot={handleRegularShot}
              onClear={handleClear}
              disabled={currentFrame > 10 || isGameComplete}
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
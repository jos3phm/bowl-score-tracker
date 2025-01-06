import { useState } from "react";
import { Pin } from "@/types/game";
import { PinDiagram } from "./PinDiagram";
import { GameControls } from "./GameControls";
import { GameStatus } from "./GameStatus";
import { ScoreCard } from "./ScoreCard";
import { Frame } from "@/types/game";

interface GameContentProps {
  frames: Frame[];
  currentFrame: number;
  currentShot: 1 | 2 | 3;
  handleStrike: () => void;
  handleSpare: () => void;
  handlePinClick: (pins: Pin[]) => void;
  handleMiss: () => void;
  isStrike: boolean;
  calculateTotalScore: () => number;
  handleNewGame: () => void;
  handleSaveGame: () => Promise<void>;
  isSaving: boolean;
  selectedBallId: string | null;
  handleBallSelect: (ballId: string | null) => void;
  remainingPins?: Pin[];
}

export const GameContent = ({
  frames,
  currentFrame,
  currentShot,
  handleStrike,
  handleSpare,
  handlePinClick,
  handleMiss,
  isStrike,
  calculateTotalScore,
  handleNewGame,
  handleSaveGame,
  isSaving,
  selectedBallId,
  handleBallSelect,
  remainingPins = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
}: GameContentProps) => {
  const [selectedPins, setSelectedPins] = useState<Pin[]>([]);

  const handleRegularShot = () => {
    // Always call handlePinClick with the current selectedPins
    // This ensures that even when no pins are selected (a miss),
    // we still record the shot
    handlePinClick(selectedPins);
    setSelectedPins([]);
  };

  return (
    <div className="space-y-6">
      <ScoreCard
        frames={frames}
        currentFrame={currentFrame}
        onFrameClick={() => {}}
        selectedFrame={null}
      />
      
      <PinDiagram
        onPinSelect={setSelectedPins}
        selectedPins={selectedPins}
        disabled={currentFrame > 10}
        onRegularShot={handleRegularShot}
        remainingPins={remainingPins}
      />
      
      <GameControls
        onStrike={handleStrike}
        onSpare={handleSpare}
        onRegularShot={handleRegularShot}
        onMiss={handleMiss}
        disabled={currentFrame > 10}
        currentFrame={currentFrame}
        currentShot={currentShot}
        isFirstShotStrike={isStrike}
        selectedPins={selectedPins}
        onBallSelect={handleBallSelect}
        selectedBallId={selectedBallId}
      />
      
      <GameStatus
        currentFrame={currentFrame}
        currentShot={currentShot}
      />
    </div>
  );
};
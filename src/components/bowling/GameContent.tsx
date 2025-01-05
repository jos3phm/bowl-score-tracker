import { Pin } from "@/types/game";
import { PinDiagram } from "./PinDiagram";
import { GameControls } from "./GameControls";
import { GameStatus } from "./GameStatus";
import { Frame } from "@/types/game";

interface GameContentProps {
  frames: Frame[];
  currentFrame: number;
  currentShot: 1 | 2 | 3;
  handleStrike: () => void;
  handleSpare: () => void;
  handlePinClick: (pin: Pin) => void;
  handleClear: () => void;
  isStrike: boolean;
  calculateTotalScore: () => number;
  handleNewGame: () => void;
  handleSaveGame: () => Promise<void>;
  isSaving: boolean;
  selectedBallId: string | null;
  handleBallSelect: (ballId: string | null) => void;
}

export const GameContent = ({
  frames,
  currentFrame,
  currentShot,
  handleStrike,
  handleSpare,
  handlePinClick,
  handleClear,
  isStrike,
  calculateTotalScore,
  handleNewGame,
  handleSaveGame,
  isSaving,
  selectedBallId,
  handleBallSelect,
}: GameContentProps) => {
  return (
    <div className="space-y-6">
      <PinDiagram
        onPinSelect={handlePinClick}
        selectedPins={[]}
        disabled={currentFrame > 10}
        onRegularShot={() => {}}
      />
      
      <GameControls
        onStrike={handleStrike}
        onSpare={handleSpare}
        onRegularShot={() => {}}
        onMiss={() => {}}
        onClear={handleClear}
        disabled={currentFrame > 10}
        currentFrame={currentFrame}
        currentShot={currentShot}
        isFirstShotStrike={isStrike}
        selectedPins={[]}
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
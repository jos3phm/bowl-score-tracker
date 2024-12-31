import { Pin } from "@/types/game";
import { PinDiagram } from "./PinDiagram";
import { GameControls } from "./GameControls";
import { GameStatus } from "./GameStatus";

interface GameContentProps {
  currentFrame: number;
  currentShot: 1 | 2 | 3;
  selectedPins: Pin[];
  isGameComplete: boolean;
  isFirstShotStrike: boolean;
  remainingPins?: Pin[];
  historicalFrame?: {
    firstShot: Pin[];
    secondShot: Pin[];
    isSpare: boolean;
    isStrike: boolean;
  } | null;
  isHistoricalView: boolean;
  onPinSelect: (pins: Pin[] | ((currentPins: Pin[]) => Pin[])) => void;
  onStrike: () => void;
  onSpare: () => void;
  onRegularShot: () => void;
  onClear: () => void;
  onBallSelect: (ballId: string | null) => void;
  selectedBallId: string | null;
}

export const GameContent = ({
  currentFrame,
  currentShot,
  selectedPins,
  isGameComplete,
  isFirstShotStrike,
  remainingPins,
  historicalFrame,
  isHistoricalView,
  onPinSelect,
  onStrike,
  onSpare,
  onRegularShot,
  onClear,
  onBallSelect,
  selectedBallId,
}: GameContentProps) => {
  const handleMiss = () => {
    onPinSelect([]);
    onRegularShot();
  };

  return (
    <div className="space-y-6">
      <PinDiagram
        onPinSelect={onPinSelect}
        onRegularShot={onRegularShot}
        selectedPins={selectedPins}
        disabled={currentFrame > 10 || isGameComplete}
        remainingPins={remainingPins}
        historicalFrame={historicalFrame}
        isHistoricalView={isHistoricalView}
      />
      
      <GameControls
        onStrike={onStrike}
        onSpare={onSpare}
        onRegularShot={onRegularShot}
        onMiss={handleMiss}
        onClear={onClear}
        disabled={currentFrame > 10 || isGameComplete}
        currentFrame={currentFrame}
        currentShot={currentShot}
        isFirstShotStrike={isFirstShotStrike}
        selectedPins={selectedPins}
        onBallSelect={onBallSelect}
        selectedBallId={selectedBallId}
      />
      
      <GameStatus
        currentFrame={currentFrame}
        currentShot={currentShot}
      />
    </div>
  );
};
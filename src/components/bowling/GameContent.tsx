import { Pin } from "@/types/game";
import { PinDiagram } from "./PinDiagram";
import { GameControls } from "./GameControls";
import { GameStatus } from "./GameStatus";

interface GameContentProps {
  currentFrame: number;
  currentShot: number;
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
  onPinSelect: (pins: Pin[]) => void;
  onStrike: () => void;
  onSpare: () => void;
  onRegularShot: () => void;
  onClear: () => void;
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
}: GameContentProps) => {
  return (
    <div className="space-y-6">
      <PinDiagram
        onPinSelect={onPinSelect}
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
        onClear={onClear}
        disabled={currentFrame > 10 || isGameComplete}
        currentFrame={currentFrame}
        currentShot={currentShot}
        isFirstShotStrike={isFirstShotStrike}
      />
      
      <GameStatus
        currentFrame={currentFrame}
        currentShot={currentShot}
      />
    </div>
  );
};
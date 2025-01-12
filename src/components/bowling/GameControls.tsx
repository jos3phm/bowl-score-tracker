import { Pin } from "@/types/game";
import { BallSelector } from "./controls/BallSelector";
import { ActionButtons } from "./controls/ActionButtons";

interface GameControlsProps {
  onStrike: () => void;
  onSpare: () => void;
  onRegularShot: () => void;
  onMiss: () => void;
  disabled?: boolean;
  currentFrame: number;
  currentShot: 1 | 2 | 3;
  isFirstShotStrike?: boolean;
  selectedPins?: Pin[];
  onBallSelect: (ballId: string | null) => void;
  selectedBallId: string | null;
  showSpareButton?: boolean;
}

export const GameControls = ({
  onStrike,
  onSpare,
  onRegularShot,
  onMiss,
  disabled,
  currentFrame,
  currentShot,
  isFirstShotStrike = false,
  selectedPins = [],
  onBallSelect,
  selectedBallId,
  showSpareButton = false,
}: GameControlsProps) => {
  return (
    <div className="space-y-4">
      <BallSelector
        onBallSelect={onBallSelect}
        selectedBallId={selectedBallId}
      />
      
      <ActionButtons
        onStrike={onStrike}
        onSpare={onSpare}
        onRegularShot={onRegularShot}
        onMiss={onMiss}
        disabled={disabled}
        currentFrame={currentFrame}
        currentShot={currentShot}
        isFirstShotStrike={isFirstShotStrike}
        selectedPins={selectedPins}
        showSpareButton={showSpareButton}
      />
    </div>
  );
};
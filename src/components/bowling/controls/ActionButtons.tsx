import { Button } from "@/components/ui/button";
import { Pin } from "@/types/game";

interface ActionButtonsProps {
  onStrike: () => void;
  onSpare: () => void;
  onRegularShot: () => void;
  onMiss: () => void;
  disabled?: boolean;
  currentFrame: number;
  currentShot: 1 | 2 | 3;
  isFirstShotStrike?: boolean;
  selectedPins?: Pin[];
}

export const ActionButtons = ({
  onStrike,
  onSpare,
  onRegularShot,
  onMiss,
  disabled,
  currentFrame,
  currentShot,
  isFirstShotStrike = false,
  selectedPins = [],
}: ActionButtonsProps) => {
  // In 10th frame:
  // - First shot can be strike
  // - Second shot can be strike if first was strike, otherwise spare
  // - Third shot can be strike if second was strike or spare
  const canStrike = 
    currentShot === 1 || 
    (currentFrame === 10 && currentShot === 2 && isFirstShotStrike) ||
    (currentFrame === 10 && currentShot === 3);
    
  const canSpare = 
    (currentShot === 2 && currentFrame !== 10) || 
    (currentFrame === 10 && currentShot === 2 && !isFirstShotStrike);
  
  const handleStrikeSpare = () => {
    if (canStrike) {
      onStrike();
    } else if (canSpare) {
      onSpare();
    }
  };

  return (
    <div className="flex gap-2 justify-center flex-wrap">
      {/* Combined Strike/Spare button */}
      <Button
        onClick={handleStrikeSpare}
        disabled={disabled || (!canStrike && !canSpare)}
        className="bg-primary hover:bg-primary/90"
      >
        {canStrike ? "Strike" : "Spare"}
      </Button>

      <Button
        onClick={onMiss}
        disabled={disabled}
        variant="destructive"
      >
        Miss
      </Button>

      <Button
        onClick={onRegularShot}
        disabled={disabled || selectedPins.length === 10}
        variant="default"
      >
        Record Shot
      </Button>
    </div>
  );
};
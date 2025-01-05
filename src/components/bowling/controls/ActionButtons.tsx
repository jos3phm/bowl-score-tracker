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
  const isStrikeDisabled = disabled || 
    (currentShot === 2 && (currentFrame !== 10 || !isFirstShotStrike));

  const isSpareDisabled = disabled || 
    currentShot === 1 || 
    (currentFrame === 10 && currentShot === 3 && isFirstShotStrike);

  const isRegularShotDisabled = disabled || 
    (currentShot === 1 && selectedPins.length === 10);

  const handleRegularShot = () => {
    if (selectedPins.length === 0) {
      onMiss();
    } else {
      onRegularShot();
    }
  };

  return (
    <div className="flex gap-2 justify-center flex-wrap">
      <Button
        onClick={onStrike}
        disabled={isStrikeDisabled}
        className="bg-primary hover:bg-primary/90"
      >
        Strike
      </Button>
      <Button
        onClick={onSpare}
        disabled={isSpareDisabled}
        className="bg-secondary hover:bg-secondary/90"
      >
        Spare
      </Button>
      <Button
        onClick={onMiss}
        disabled={disabled}
        variant="destructive"
      >
        Miss
      </Button>
      <Button
        onClick={handleRegularShot}
        disabled={isRegularShotDisabled}
        variant="default"
      >
        Record Shot
      </Button>
    </div>
  );
};
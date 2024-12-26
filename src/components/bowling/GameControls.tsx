import { Button } from "@/components/ui/button";

interface GameControlsProps {
  onStrike: () => void;
  onSpare: () => void;
  onClear: () => void;
  onRegularShot: () => void;
  disabled?: boolean;
  currentFrame: number;
  currentShot: 1 | 2 | 3;
  isFirstShotStrike?: boolean;
}

export const GameControls = ({
  onStrike,
  onSpare,
  onClear,
  onRegularShot,
  disabled,
  currentFrame,
  currentShot,
  isFirstShotStrike = false
}: GameControlsProps) => {
  // Disable strike button on second shot unless it's the 10th frame with a first strike
  const isStrikeDisabled = disabled || 
    (currentShot === 2 && (currentFrame !== 10 || !isFirstShotStrike));

  // Disable spare button on first shot, and in 10th frame third shot if first two shots were strikes
  const isSpareDisabled = disabled || 
    currentShot === 1 || 
    (currentFrame === 10 && currentShot === 3 && isFirstShotStrike);

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
        onClick={onRegularShot}
        disabled={disabled}
        variant="default"
      >
        Record Shot
      </Button>
      <Button
        onClick={onClear}
        disabled={disabled}
        variant="outline"
      >
        Clear
      </Button>
    </div>
  );
};
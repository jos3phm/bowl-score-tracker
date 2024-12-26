import { Button } from "@/components/ui/button";

interface GameControlsProps {
  onStrike: () => void;
  onSpare: () => void;
  onClear: () => void;
  onRegularShot: () => void;
  disabled?: boolean;
  currentFrame: number;
  currentShot: 1 | 2 | 3;
}

export const GameControls = ({
  onStrike,
  onSpare,
  onClear,
  onRegularShot,
  disabled,
  currentFrame,
  currentShot
}: GameControlsProps) => {
  // Disable strike button on second shot unless it's the 10th frame with a first strike
  const isStrikeDisabled = disabled || 
    (currentShot === 2 && (currentFrame !== 10 || !frames?.[9]?.isStrike));

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
        disabled={disabled}
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
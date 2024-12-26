import { Button } from "@/components/ui/button";

interface GameControlsProps {
  onStrike: () => void;
  onSpare: () => void;
  onClear: () => void;
  disabled?: boolean;
}

export const GameControls = ({
  onStrike,
  onSpare,
  onClear,
  disabled
}: GameControlsProps) => {
  return (
    <div className="flex gap-2 justify-center">
      <Button
        onClick={onStrike}
        disabled={disabled}
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
        onClick={onClear}
        disabled={disabled}
        variant="outline"
      >
        Clear
      </Button>
    </div>
  );
};